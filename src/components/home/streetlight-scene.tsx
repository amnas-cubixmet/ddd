"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import {
  Group,
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
  const { camera, gl, get, size, invalidate } = useThree();
  const mount = useRef<Group>(null);
  const fixture = useRef<ReturnType<typeof buildStreetlight> | null>(null);
  const frames = useRef(0);
  const reveal = useRef(0);
  const projected = useRef(new Vector3());

  useLayoutEffect(() => {
    const root = mount.current!;
    const { scene } = get();
    const product = buildStreetlight();
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
      product.dispose();
      scene.environment = null;
      reflections.dispose();
      cancelAnimationFrame(reveal.current);
      frames.current = 0;
    };
  }, [gl, get, invalidate]);

  useLayoutEffect(() => {
    const { camera } = get();
    if (!(camera instanceof OrthographicCamera)) return;
    camera.zoom = Math.min(size.width / 4.45, size.height / 3.65);
    camera.updateProjectionMatrix();
    invalidate();
  }, [get, size, invalidate]);

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
    const yaw = reduced ? 0 : pointer.current.x * 0.32;
    const tilt = reduced ? 0 : pointer.current.y * 0.14;
    const emission = power * 6;
    const blend = reduced ? 1 : 1 - Math.exp(-12 * Math.min(delta, 0.06));
    root.rotation.y = MathUtils.lerp(root.rotation.y, yaw, blend);
    root.rotation.x = MathUtils.lerp(root.rotation.x, tilt, blend);
    product.opal.emissiveIntensity = MathUtils.lerp(
      product.opal.emissiveIntensity,
      emission,
      blend,
    );
    if (illumination.current) {
      const lens = root
        .localToWorld(projected.current.set(-0.62, 0.68, 0.08))
        .project(camera);
      illumination.current.style.setProperty(
        "--lens-x",
        ((lens.x + 1) * 50).toFixed(1) + "%",
      );
      illumination.current.style.setProperty(
        "--lens-y",
        ((1 - lens.y) * 50).toFixed(1) + "%",
      );
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
      camera={{ position: [0, -0.1, 8], near: 0.1, far: 20 }}
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
