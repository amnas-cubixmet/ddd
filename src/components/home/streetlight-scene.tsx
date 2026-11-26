"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import {
  MathUtils,
  PerspectiveCamera,
  Object3D,
  Vector3,
  type Group,
  type DirectionalLight,
  type MeshStandardMaterial,
  type SpotLight,
} from "three";

type SceneProps = {
  power: number;
  reduced: boolean;
  active: boolean;
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

// Both canvas and poster use these fixed aspect ratios and camera poses.
function configureCamera(camera: PerspectiveCamera, aspect: number) {
  camera.aspect = aspect;
  camera.fov = 39;
  if (aspect < 0.8) {
    camera.position.set(-0.62, -2.7, 8.4);
    camera.lookAt(-0.62, -1.8, 0);
  } else {
    camera.position.set(-0.18, -1.26, 6.5);
    camera.lookAt(-0.12, -0.26, 0);
  }
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
}

function Fixture({ power, reduced, pointer, illumination, onReady, onFailure }: SceneProps) {
  const group = useRef<Group>(null);
  const diffuser = useRef<MeshStandardMaterial>(null);
  const lensCenter = useRef<Object3D>(null);
  const spotlight = useRef<SpotLight>(null);
  const reflection = useRef<DirectionalLight>(null);
  const target = useMemo(() => new Object3D(), []);
  const projected = useMemo(() => new Vector3(), []);
  const gl = useThree(state => state.gl);
  const camera = useThree(state => state.camera);
  const width = useThree(state => state.size.width);
  const height = useThree(state => state.size.height);
  const invalidate = useThree(state => state.invalidate);
  const frames = useRef(0);
  const readySent = useRef(false);
  const revealFrame = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (!width || !height || !(camera instanceof PerspectiveCamera)) return;
    configureCamera(camera, width / height);
    if (!readySent.current) frames.current = 0;
    invalidate();
  }, [camera, width, height, invalidate]);

  useEffect(() => { invalidate(); }, [power, reduced, invalidate]);
  useEffect(() => {
    const canvas = gl.domElement;
    const fail = (event: Event) => { event.preventDefault(); onFailure(); };
    canvas.addEventListener("webglcontextlost", fail);
    return () => {
      canvas.removeEventListener("webglcontextlost", fail);
      if (revealFrame.current !== null) {
        cancelAnimationFrame(revealFrame.current);
        revealFrame.current = null;
        if (!readySent.current) frames.current = 0;
      }
    };
  }, [gl, onFailure]);

  useFrame((_, delta) => {
    const fixture = group.current;
    const lens = diffuser.current;
    if (!fixture || !lens || !width || !height || !(camera instanceof PerspectiveCamera)) return;
    configureCamera(camera, width / height);
    fixture.updateWorldMatrix(true, true);
    const emission = power * 3;
    lens.emissiveIntensity = !readySent.current || reduced
      ? emission : MathUtils.damp(lens.emissiveIntensity, emission, 12, Math.min(delta, 0.05));
    if (spotlight.current) spotlight.current.intensity = lens.emissiveIntensity * (20 / 3);
    // Move the reflection, not the fixture: no camera or geometry movement on pointer input.
    if (reflection.current) {
      const x = -3 + (readySent.current && !reduced ? pointer.current.x * 0.8 : 0);
      const y = 5 + (readySent.current && !reduced ? pointer.current.y * 0.6 : 0);
      reflection.current.position.x = reduced ? x : MathUtils.damp(reflection.current.position.x, x, 5, Math.min(delta, 0.05));
      reflection.current.position.y = reduced ? y : MathUtils.damp(reflection.current.position.y, y, 5, Math.min(delta, 0.05));
    }
    const overlay = illumination.current;
    if (overlay && lensCenter.current) {
      lensCenter.current.getWorldPosition(projected).project(camera);
      setLightProperty(overlay, "--lens-x", `${((projected.x + 1) * 50).toFixed(1)}%`);
      setLightProperty(overlay, "--lens-y", `${((1 - projected.y) * 50).toFixed(1)}%`);
    }
    if (!readySent.current && revealFrame.current === null) {
      frames.current += 1;
      if (frames.current < 2) invalidate();
      else revealFrame.current = requestAnimationFrame(() => {
        revealFrame.current = null;
        readySent.current = true;
        onReady();
      });
    }
    if (!reduced && Math.abs(lens.emissiveIntensity - emission) > 0.005) invalidate();
  });
  return (
    <>
    <directionalLight ref={reflection} position={[-3, 5, 3]} intensity={3.1} color="#ffffff" />
    <group ref={group} rotation={[0.02, -0.39, -0.13]}>
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
    </>
  );
}

export default function StreetlightScene(props: SceneProps) {
  return (
    <Canvas
      aria-hidden
      dpr={[1, 1.5]}
      frameloop={props.active && !props.reduced ? "always" : "demand"}
      camera={{ position: [-0.18, -1.26, 6.5], fov: 39 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      onCreated={({ camera, gl, size }) => {
        if (camera instanceof PerspectiveCamera && size.height > 0) configureCamera(camera, size.width / size.height);
        gl.setClearAlpha(0);
      }}
    >
      <hemisphereLight intensity={1.55} color="#ffffff" groundColor="#686868" />
      <directionalLight position={[3, 3, -4]} intensity={2} color="#d4d4d4" />
      <Fixture {...props} />
    </Canvas>
  );
}
