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

const chips = Array.from({ length: 40 }, (_, index) => [
  -0.67 + (index % 10) * 0.19,
  -0.253 + Math.floor(index / 10) * 0.16,
]);
const fins = Array.from({ length: 12 }, (_, index) => -0.95 + index * 0.19);

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
      <group ref={group} rotation={[-0.28, -0.43, 0.28]}>
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
        <mesh position={[-1.62, -1.15, -0.14]} rotation={[0, 0, -0.17]}>
          <cylinderGeometry args={[0.13, 0.16, 2.6, 24]} />
          <meshStandardMaterial color="#17191c" roughness={0.52} metalness={0.45} />
        </mesh>
        <mesh position={[-1.46, 0, -0.03]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.65, 24]} />
          <meshStandardMaterial color="#292b2e" roughness={0.42} metalness={0.55} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.43]}>
          <capsuleGeometry args={[0.57, 1.98, 12, 32]} />
          <meshStandardMaterial color="#34383e" roughness={0.42} metalness={0.58} />
        </mesh>
        <mesh position={[0.18, 0, 0.17]}>
          <boxGeometry args={[2.03, 0.78, 0.13]} />
          <meshStandardMaterial color="#585b5d" roughness={0.48} metalness={0.53} />
        </mesh>
        {chips.map(([x, y], index) => (
          <mesh key={index} ref={index === 0 ? firstChip : undefined} position={[x, y, 0.245]} material={diffuser}>
            <boxGeometry args={[0.105, 0.095, 0.035]} />
          </mesh>
        ))}
        {fins.map((x) => (
          <mesh key={x} position={[x, 0.16, -0.23]}>
            <boxGeometry args={[0.045, 0.66, 0.16]} />
            <meshStandardMaterial color="#303238" roughness={0.48} metalness={0.54} />
          </mesh>
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
