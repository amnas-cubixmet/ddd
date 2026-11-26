"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import {
  MathUtils,
  PerspectiveCamera,
  Object3D,
  Vector3,
  type Group,
  type Mesh,
  type DirectionalLight,
  MeshStandardMaterial,
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
    camera.position.set(0, -0.45, 7.25);
    camera.lookAt(0, -0.1, 0);
  } else {
    camera.position.set(-0.18, -1.26, 6.5);
    camera.lookAt(0, 0, 0);
  }
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
}

const vents = Array.from({ length: 16 }, (_, index) => index * Math.PI / 8);
const fasteners = Array.from({ length: 6 }, (_, index) => index * Math.PI / 3);
const chips = [
  { radius: 0.36, count: 4 },
  { radius: 0.68, count: 7 },
  { radius: 0.95, count: 10 },
].flatMap(({ radius, count }) => Array.from({ length: count }, (_, index) => {
  const angle = (index + 0.25) * Math.PI * 2 / count;
  return [radius * Math.cos(angle), radius * Math.sin(angle)] as const;
}));

function Fixture({ power, reduced, pointer, illumination, onReady, onFailure }: SceneProps) {
  const group = useRef<Group>(null);
  const diffuser = useMemo(() => new MeshStandardMaterial({
    color: "#e8d962", emissive: "#ffffff", emissiveIntensity: 0, roughness: 0.48,
  }), []);
  useEffect(() => () => diffuser.dispose(), [diffuser]);
  const firstChip = useRef<Mesh>(null);
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
    const lens = firstChip.current?.material;
    if (!fixture || !(lens instanceof MeshStandardMaterial) || !width || !height || !(camera instanceof PerspectiveCamera)) return;
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
      <group ref={group} rotation={[-0.28, -0.43, 0.17]}>
        <object3D ref={lensCenter} position={[0, 0, 0.24]} />
        <primitive object={target} position={[0, 0, 4]} />
        <spotLight
          ref={spotlight}
          target={target}
          position={[0, 0, 0.28]}
          intensity={0}
          distance={6}
          decay={2}
          angle={Math.PI / 3}
          penumbra={0.9}
          color="#ffffff"
        />
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.07]}>
          <cylinderGeometry args={[1.29, 1.34, 0.46, 64]} />
          <meshStandardMaterial color="#25282b" roughness={0.46} metalness={0.55} />
        </mesh>
        <mesh position={[0, 0, 0.178]}>
          <ringGeometry args={[1.04, 1.54, 96]} />
          <meshStandardMaterial color="#292c30" roughness={0.38} metalness={0.53} />
        </mesh>
        <mesh position={[0, 0, 0.19]}>
          <circleGeometry args={[1.055, 64]} />
          <meshStandardMaterial color="#dce6de" roughness={0.69} />
        </mesh>
        <mesh position={[0, 0, 0.245]}>
          <ringGeometry args={[1.035, 1.105, 64]} />
          <meshStandardMaterial color="#8b989e" roughness={0.38} metalness={0.56} />
        </mesh>
        <mesh position={[0, 0, 0.247]} renderOrder={1}>
          <circleGeometry args={[1.035, 64]} />
          <meshPhysicalMaterial color="#f2f5f8" roughness={0.24} transparent opacity={0.09} depthWrite={false} />
        </mesh>
        {chips.map(([x, y], index) => (
          <mesh key={index} ref={index === 0 ? firstChip : undefined} position={[x, y, 0.216]} material={diffuser}>
            <boxGeometry args={[0.054, 0.054, 0.018]} />
          </mesh>
        ))}
        {fasteners.map((angle) => (
          <mesh key={angle} position={[1.17 * Math.cos(angle), 1.17 * Math.sin(angle), 0.195]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.044, 0.044, 0.025, 12]} />
            <meshStandardMaterial color="#c3c6ca" metalness={0.7} roughness={0.45} />
          </mesh>
        ))}
        {vents.map((angle) => (
          <group key={angle} rotation={[0, 0, angle]}>
            <mesh position={[1.43, 0, 0.185]}>
              <planeGeometry args={[0.105, 0.23]} />
              <meshBasicMaterial color="#111316" />
            </mesh>
            <mesh position={[1.31, 0, -0.11]}>
              <boxGeometry args={[0.11, 0.055, 0.38]} />
              <meshStandardMaterial color="#383a3e" roughness={0.55} metalness={0.45} />
            </mesh>
          </group>
        ))}
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
