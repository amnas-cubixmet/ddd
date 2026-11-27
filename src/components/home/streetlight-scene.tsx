"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import {
  Box3,
  Group,
  Color,
  MathUtils,
  OrthographicCamera,
  PMREMGenerator,
  Vector3,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { buildStreetlight } from "./streetlight-model";

type SceneProps = {
  power: number;
  reduced: boolean;
  active: boolean;
  pointer: RefObject<{ x: number; y: number }>;
  wakeRef: RefObject<(() => void) | null>;
  illumination: RefObject<HTMLDivElement | null>;
  onReady: () => void;
  onFailure: () => void;
};

const ledOff = new Color("#14171c");
const ledOn = new Color("#f1f3f6");
const maxTilt = 0.07;
const maxYaw = 0.16;

function measureFixture(model: Group, headBounds: Box3) {
  const poseBounds = new Box3().setFromObject(model, true);
  const neutralWidth = poseBounds.max.x - poseBounds.min.x;
  const motionBounds = poseBounds.clone();
  const headMotionBounds = headBounds.clone();

  // Measure the visible geometry across the pointer motion range once per model.
  for (const tilt of [-maxTilt, 0, maxTilt]) {
    for (const yaw of [-maxYaw, 0, maxYaw]) {
      model.rotation.set(tilt, yaw, 0);
      motionBounds.union(poseBounds.setFromObject(model, true));
      model.updateMatrixWorld(true);
      headMotionBounds.union(headBounds.clone().applyMatrix4(model.matrixWorld));
    }
  }

  model.rotation.set(0, 0, 0);
  return {
    neutralWidth,
    head: headMotionBounds,
    center: motionBounds.getCenter(new Vector3()),
    size: motionBounds.getSize(new Vector3()),
  };
}

function Fixture({
  power,
  reduced,
  active,
  pointer,
  wakeRef,
  illumination,
  onReady,
  onFailure,
}: SceneProps) {
  const { camera, gl, get, size: { width, height }, invalidate } = useThree();
  const mount = useRef<Group>(null);
  const fixture = useRef<ReturnType<typeof buildStreetlight> | null>(null);
  const bounds = useRef<ReturnType<typeof measureFixture> | null>(null);
  const frames = useRef(0);
  const reveal = useRef(0);
  const projected = useRef(new Vector3());

  useLayoutEffect(() => {
    const root = mount.current!;
    const { scene } = get();
    const product = buildStreetlight();
    bounds.current = measureFixture(product.model, product.headBounds);
    const studio = new RoomEnvironment();
    const generator = new PMREMGenerator(gl);
    const reflections = generator.fromScene(studio, 0, 0.1, 100, { size: 64 });
    studio.dispose();
    generator.dispose();
    scene.environment = reflections.texture;
    root.add(product.model);
    fixture.current = product;
    invalidate();
    return () => {
      root.remove(product.model);
      fixture.current = null;
      bounds.current = null;
      product.dispose();
      scene.environment = null;
      reflections.dispose();
      cancelAnimationFrame(reveal.current);
      frames.current = 0;
    };
  }, [gl, get, invalidate]);

  useLayoutEffect(() => {
    const { camera } = get();
    const framing = bounds.current;
    if (!(camera instanceof OrthographicCamera) || !framing || width < 1 || height < 1) return;

    // Fit the head across pointer poses; allow the longer pole to extend below.
    const inset = Math.min(MathUtils.clamp(width * 0.025, 8, 18), width / 4, height / 4);
    const headSize = framing.head.getSize(new Vector3());
    const headCenter = framing.head.getCenter(new Vector3());
    camera.zoom = Math.min(
      (width * 0.9) / framing.neutralWidth,
      (width - inset * 2) / framing.size.x,
      (width - inset * 2) / headSize.x,
      (height * 0.58) / headSize.y,
    );
    const viewWidth = width / camera.zoom;
    const viewHeight = height / camera.zoom;
    const desiredX = headCenter.x + viewWidth * 0.10;
    const halfSafeWidth = viewWidth / 2 - inset / camera.zoom;
    camera.position.x = MathUtils.clamp(desiredX, framing.head.max.x - halfSafeWidth, framing.head.min.x + halfSafeWidth);
    camera.position.y = framing.head.max.y - viewHeight / 2 + inset / camera.zoom;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    invalidate();
  }, [get, width, height, invalidate]);

  useEffect(() => {
    const layer = illumination.current;
    if (!layer || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => invalidate());
    observer.observe(layer);
    return () => observer.disconnect();
  }, [illumination, invalidate]);

  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);

  useEffect(() => {
    wakeRef.current = active ? invalidate : null;
    if (active) invalidate();
    return () => {
      wakeRef.current = null;
    };
  }, [wakeRef, active, power, reduced, invalidate]);

  useFrame((_, delta) => {
    const product = fixture.current;
    const root = mount.current;
    if (!root || !product || (!active && frames.current >= 2)) return;
    const yaw = reduced ? 0 : pointer.current.x * 2 * maxYaw;
    const tilt = reduced ? 0 : pointer.current.y * 2 * maxTilt;
    const emission = power * 6;
    const blend = reduced ? 1 : 1 - Math.exp(-12 * Math.min(delta, 0.06));
    root.rotation.y = MathUtils.lerp(root.rotation.y, yaw, blend);
    root.rotation.x = MathUtils.lerp(root.rotation.x, tilt, blend);
    product.opal.emissiveIntensity = MathUtils.lerp(
      product.opal.emissiveIntensity,
      emission,
      blend,
    );
    // The lens itself brightens smoothly from dark graphite to neutral white.
    product.opal.color.copy(ledOff).lerp(ledOn, MathUtils.clamp(product.opal.emissiveIntensity / 6, 0, 1));
    if (illumination.current) {
      const lens = root.localToWorld(projected.current.copy(product.lensCenter)).project(camera);
      const canvasRect = gl.domElement.getBoundingClientRect();
      const glowRect = illumination.current.getBoundingClientRect();
      const x = canvasRect.left - glowRect.left + (lens.x + 1) * canvasRect.width / 2;
      const y = canvasRect.top - glowRect.top + (1 - lens.y) * canvasRect.height / 2;
      if (glowRect.width > 0 && glowRect.height > 0) {
        illumination.current.style.setProperty("--lens-x", (x / glowRect.width * 100).toFixed(2) + "%");
        illumination.current.style.setProperty("--lens-y", (y / glowRect.height * 100).toFixed(2) + "%");
      }
    }
    if (frames.current < 2) {
      frames.current++;
      if (frames.current === 2) reveal.current = requestAnimationFrame(onReady);
      else invalidate();
    }
    if (
      Math.abs(root.rotation.y - yaw) +
        Math.abs(root.rotation.x - tilt) +
        Math.abs(product.opal.emissiveIntensity - emission) >
      0.0005
    )
      invalidate();
  });
  return <group ref={mount} />;
}

export default function StreetlightScene(props: SceneProps) {
  return (
    <Canvas
      aria-hidden
      orthographic
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], near: 0.1, far: 20 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => gl.setClearAlpha(0)}
    >
      <hemisphereLight color="#ffffff" groundColor="#b2bed1" intensity={1.15} />
      <directionalLight position={[-3, 4, 5]} intensity={2.4} />
      <directionalLight position={[1, -3, 3]} intensity={1.1} />
      <Fixture {...props} />
    </Canvas>
  );
}
