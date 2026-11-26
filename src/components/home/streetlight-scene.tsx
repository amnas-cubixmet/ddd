"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  MathUtils,
  Object3D,
  Vector3,
  type Group,
  type MeshStandardMaterial,
  type SpotLight,
} from "three";

type SceneProps = {
  power: number;
  reduced: boolean;
  compactLayout: boolean;
  paused: boolean;
  renderOnDemand: boolean;
  pointer: RefObject<{ x: number; y: number }>;
  illumination: RefObject<HTMLDivElement | null>;
  onReady: () => void;
  onFailure: () => void;
};

function setLightProperty(overlay: HTMLDivElement, name: string, value: string) {
  if (overlay.style.getPropertyValue(name) !== value) {
    overlay.style.setProperty(name, value);
  }
}

function Fixture({
  power,
  paused,
  reduced,
  renderOnDemand,
  compactLayout,
  pointer,
  illumination,
  onReady,
  onFailure,
}: SceneProps) {
  const group = useRef<Group>(null);
  const diffuser = useRef<MeshStandardMaterial>(null);
  const lensCenter = useRef<Object3D>(null);
  const spotlight = useRef<SpotLight>(null);
  const target = useMemo(() => new Object3D(), []);
  const projected = useMemo(() => new Vector3(), []);
  const gl = useThree((state) => state.gl);
  const elapsedRef = useRef(0);
  const readySent = useRef(false);
  const camera = useThree((state) => state.camera);
  const aspect = useThree(({ size }) => size.width / (size.height || 1));
  const compact = useThree(({ size }) => size.width < 620);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    if (compactLayout) {
      const distance = Math.max(8.4, 4.8 / Math.max(0.4, aspect));
      camera.position.set(-0.62, -2.7, distance);
      camera.lookAt(-0.62, -1.8, 0);
    } else {
      const distance = compact ? Math.max(5.15, 5.75 / Math.max(0.8, aspect)) : 6.5;
      camera.position.set(
        compact ? -0.38 : -0.18,
        compact ? -1.7 : -1.26,
        distance,
      );
      camera.lookAt(compact ? -0.38 : -0.12, compact ? -0.68 : -0.26, 0);
    }
    invalidate();
  }, [aspect, camera, compact, compactLayout, invalidate]);

  useEffect(() => {
    invalidate();
  }, [invalidate, paused, power, reduced]);

  useEffect(() => {
    const canvas = gl.domElement;
    const fail = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", fail);
    return () => canvas.removeEventListener("webglcontextlost", fail);
  }, [gl, onFailure]);
  useFrame((_, delta) => {
    const fixture = group.current;
    const lens = diffuser.current;
    if (!fixture || !lens) return;
    const firstFrame = !readySent.current;
    readySent.current = true;
    // Three.Clock is deprecated. Cap frame gaps after Safari tab suspension.
    const elapsed = elapsedRef.current;
    const frameDelta = Math.min(delta, 0.05);
    elapsedRef.current += frameDelta;
    const t = MathUtils.smoothstep(elapsed, 0, 1.4);
    fixture.rotation.y = reduced
      ? -0.39
      : MathUtils.damp(
          fixture.rotation.y,
          -0.39 + (1 - t) * 0.5 + pointer.current.x * 0.13,
          5,
          frameDelta,
        );
    fixture.rotation.x = reduced
      ? 0.02
      : MathUtils.damp(
          fixture.rotation.x,
          0.02 + pointer.current.y * 0.085,
          5,
          frameDelta,
        );
    fixture.position.y = reduced
      ? 0
      : MathUtils.damp(
          fixture.position.y,
          (1 - t) * 0.16 - pointer.current.y * 0.06,
          5,
          frameDelta,
        );
    const intensity = reduced
      ? 1
      : 0.08 + 0.92 * MathUtils.smoothstep(elapsed, 0.5, 1.5);
    const spread = reduced ? 1 : MathUtils.smoothstep(elapsed, 1.5, 2.5);
    const emission = power * intensity * 3;
    lens.emissiveIntensity =
      reduced || firstFrame || paused
        ? emission
        : MathUtils.damp(lens.emissiveIntensity, emission, 12, frameDelta);
    if (spotlight.current) spotlight.current.intensity = 20 * power * intensity;

    const overlay = illumination.current;
    if (overlay && lensCenter.current) {
      lensCenter.current.getWorldPosition(projected).project(camera);
      setLightProperty(overlay, "--lens-x", `${((projected.x + 1) * 50).toFixed(1)}%`);
      setLightProperty(overlay, "--lens-y", `${((1 - projected.y) * 50).toFixed(1)}%`);
      setLightProperty(overlay, "--lens-halo", intensity.toFixed(3));
      setLightProperty(overlay, "--light-spread", spread.toFixed(3));
    }
    if (firstFrame) onReady();
    if (
      renderOnDemand && !reduced && !paused &&
      (elapsed < 2.6 || Math.abs(lens.emissiveIntensity - emission) > 0.005)
    ) {
      invalidate();
    }
  });
  return (
    <group ref={group} rotation={[0.02, -0.2, -0.13]}>
      <RoundedBox
        args={[0.25, 4.2, 0.32]}
        radius={0.055}
        smoothness={3}
        position={[1.12, -1.35, 0.02]}
      >
        <meshStandardMaterial
          color="#282828"
          roughness={0.49}
          metalness={0.42}
        />
      </RoundedBox>
      <group position={[0.7, 0.57, 0]} rotation={[0, 0, -0.18]}>
        <RoundedBox args={[1.1, 0.22, 0.24]} radius={0.09} smoothness={3}>
          <meshStandardMaterial
            color="#383838"
            roughness={0.42}
            metalness={0.55}
          />
        </RoundedBox>
        <RoundedBox
          args={[0.3, 0.32, 0.32]}
          radius={0.055}
          smoothness={3}
          position={[0.45, -0.045, 0]}
        >
          <meshStandardMaterial color="#292929" roughness={0.52} />
        </RoundedBox>
      </group>
      <group position={[-0.53, 0.69, 0.02]} rotation={[-0.34, 0.01, -0.23]}>
        <object3D ref={lensCenter} position={[0, -0.225, 0]} />
        <primitive object={target} position={[0, -3.8, 0.7]} />
        <spotLight
          ref={spotlight}
          target={target}
          position={[0, -0.24, 0]}
          intensity={0}
          distance={6}
          decay={2}
          angle={Math.PI / 3}
          penumbra={0.9}
          color="#ffffff"
        />
        <RoundedBox
          args={[2.58, 0.37, 1.14]}
          radius={0.17}
          smoothness={5}
          position={[0, 0.034, 0]}
        >
          <meshStandardMaterial
            color="#262626"
            roughness={0.35}
            metalness={0.5}
          />
        </RoundedBox>
        <RoundedBox
          args={[2.44, 0.1, 1.05]}
          radius={0.043}
          smoothness={3}
          position={[0, -0.13, 0]}
        >
          <meshStandardMaterial
            color="#555555"
            roughness={0.56}
            metalness={0.32}
          />
        </RoundedBox>
        <RoundedBox
          args={[2.24, 0.09, 0.9]}
          radius={0.043}
          smoothness={4}
          position={[0, -0.174, 0]}
        >
          <meshStandardMaterial
            ref={diffuser}
            color="#838383"
            emissive="#ffffff"
            emissiveIntensity={0}
            roughness={0.37}
            metalness={0.06}
          />
        </RoundedBox>
        <RoundedBox
          args={[1.95, 0.02, 0.055]}
          radius={0.008}
          smoothness={2}
          position={[0, -0.225, 0]}
        >
          <meshStandardMaterial
            color="#767676"
            roughness={0.53}
            metalness={0.1}
          />
        </RoundedBox>
        {[-0.83, -0.58, -0.33, -0.08, 0.17, 0.42].map((x) => (
          <RoundedBox
            key={x}
            args={[0.075, 0.055, 0.64]}
            radius={0.018}
            smoothness={2}
            position={[x, 0.226, 0]}
          >
            <meshStandardMaterial
              color="#4d4d4d"
              roughness={0.44}
              metalness={0.45}
            />
          </RoundedBox>
        ))}
      </group>
    </group>
  );
}

export default function StreetlightScene(props: SceneProps) {
  return (
    <Canvas
      aria-hidden
      dpr={[1, props.compactLayout ? 1.2 : 1.5]}
      frameloop={props.reduced || props.paused || props.renderOnDemand ? "demand" : "always"}
      camera={{ position: [-0.18, -1.26, 6.5], fov: 39 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      onCreated={({ camera, gl }) => {
        camera.lookAt(-0.12, -0.26, 0);
        gl.setClearAlpha(0);
      }}
    >
      <hemisphereLight intensity={1.55} color="#ffffff" groundColor="#686868" />
      <directionalLight position={[-3, 5, 3]} intensity={3.1} color="#ffffff" />
      <directionalLight position={[3, 3, -4]} intensity={2} color="#d4d4d4" />
      <Fixture {...props} />
    </Canvas>
  );
}
