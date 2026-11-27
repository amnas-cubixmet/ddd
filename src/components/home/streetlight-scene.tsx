"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import {
  MathUtils,
  PerspectiveCamera,
  Shape,
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

// Use fixed aspect ratios and camera poses for the live canvas.
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

// Reference-inspired die-cast housing: rounded nose, wide LED area and tapered neck.
// Shape coordinates are in the fixture's length/width plane; extrusion adds thickness.
function fixtureOutline(length: number, width: number, tapered: boolean) {
  const x = length / 2;
  const z = width / 2;
  const shape = new Shape();
  shape.moveTo(-x + .24, -z);
  shape.lineTo(x - .52, -z);
  shape.quadraticCurveTo(x - .23, -z, x - .10, -z * (tapered ? .56 : .78));
  shape.quadraticCurveTo(x, -z * .43, x, -z * .20);
  shape.lineTo(x, z * .20);
  shape.quadraticCurveTo(x, z * .43, x - .10, z * (tapered ? .56 : .78));
  shape.quadraticCurveTo(x - .23, z, x - .52, z);
  shape.lineTo(-x + .24, z);
  shape.quadraticCurveTo(-x, z, -x, z - .23);
  shape.lineTo(-x, -z + .23);
  shape.quadraticCurveTo(-x, -z, -x + .24, -z);
  shape.closePath();
  return shape;
}

function coolingFinOutline() {
  const shape = new Shape();
  shape.moveTo(-.48, 0);
  shape.quadraticCurveTo(-.47, .15, -.32, .22);
  shape.quadraticCurveTo(-.24, .26, -.12, .26);
  shape.lineTo(.12, .26);
  shape.quadraticCurveTo(.24, .26, .32, .22);
  shape.quadraticCurveTo(.47, .15, .48, 0);
  shape.closePath();
  return shape;
}

const housingShape = fixtureOutline(2.48, 1.04, true);
const bezelShape = fixtureOutline(2.35, .96, true);
const lensShape = fixtureOutline(2.02, .76, false);
const finShape = coolingFinOutline();
const housingExtrude = { depth: .24, bevelEnabled: true, bevelSize: .065, bevelThickness: .055, bevelSegments: 4, curveSegments: 16, steps: 1 };
const bezelExtrude = { depth: .065, bevelEnabled: true, bevelSize: .025, bevelThickness: .015, bevelSegments: 3, curveSegments: 16, steps: 1 };
const lensExtrude = { depth: .035, bevelEnabled: true, bevelSize: .025, bevelThickness: .012, bevelSegments: 3, curveSegments: 16, steps: 1 };
const finExtrude = { depth: .047, bevelEnabled: true, bevelSize: .012, bevelThickness: .012, bevelSegments: 2, curveSegments: 12, steps: 1 };

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
    <directionalLight position={[-4, 1, -3]} intensity={1.4} color="#e7eef8" />
    <group ref={group} rotation={[0.02, -0.39, -0.13]}>
      {/* Square powder-coated pole with rounded edges and a separate top cap. */}
      <RoundedBox args={[.30, 4.2, .34]} radius={.035} smoothness={4} position={[1.12, -1.35, .02]}>
        <meshStandardMaterial color="#34383d" roughness={.45} metalness={.56} />
      </RoundedBox>
      <RoundedBox args={[.305, .055, .345]} radius={.02} smoothness={3} position={[1.12, .75, .02]}>
        <meshStandardMaterial color="#474c53" roughness={.38} metalness={.64} />
      </RoundedBox>
      <group position={[.71, .55, .02]} rotation={[0, 0, -.18]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[.116, .116, .84, 32]} />
          <meshStandardMaterial color="#30343a" roughness={.39} metalness={.65} />
        </mesh>
      </group>
      <group position={[-.53, .69, .02]} rotation={[-.34, .01, -.23]}>
        <object3D ref={lensCenter} position={[-.10, -.22, 0]} />
        <primitive object={target} position={[0, -3.8, .7]} />
        <spotLight ref={spotlight} target={target} position={[-.10, -.24, 0]}
          intensity={0} distance={6} decay={2} angle={Math.PI / 3} penumbra={.9} color="#0B2E57" />

        {/* Aerodynamic, bevelled cast-aluminium shell rather than a rectangular box. */}
        <mesh position={[0, .15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <extrudeGeometry args={[housingShape, housingExtrude]} />
          <meshStandardMaterial color="#555b65" roughness={.36} metalness={.68} />
        </mesh>
        {/* Dark gasket/bezel and the recessed opal diffuser. */}
        <mesh position={[0, -.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <extrudeGeometry args={[bezelShape, bezelExtrude]} />
          <meshStandardMaterial color="#24272c" roughness={.49} metalness={.38} />
        </mesh>
        <mesh position={[-.10, -.194, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <extrudeGeometry args={[lensShape, lensExtrude]} />
          <meshStandardMaterial ref={diffuser} color="#b9c1cc" emissive="#0B2E57"
            emissiveIntensity={0} roughness={.32} metalness={.04} />
        </mesh>
        <RoundedBox args={[1.56, .023, .034]} radius={.009} smoothness={3} position={[-.14, -.244, 0]}>
          <meshStandardMaterial color="#181b20" roughness={.43} metalness={.35} />
        </RoundedBox>

        {/* Arched cooling ribs, shaped to taper into the rounded nose and neck. */}
        {Array.from({ length: 11 }, (_, i) => {
          const x = -1.03 + i * .188;
          const taper = i === 0 ? .82 : i > 8 ? 1 - (i - 8) * .14 : 1;
          return (
            <mesh key={i} position={[x, .17, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[taper, .72 + .28 * taper, 1]}>
              <extrudeGeometry args={[finShape, finExtrude]} />
              <meshStandardMaterial color="#363b43" roughness={.41} metalness={.62} />
            </mesh>
          );
        })}

        {/* Recessed fasteners around the diffuser rim. */}
        {[[-.83, -.43], [-.14, -.44], [.55, -.41], [-.83, .43], [-.14, .44], [.55, .41], [1.01, -.25], [1.01, .25]].map(([x, z]) => (
          <group key={`${x}:${z}`} position={[x, -.208, z]}>
            <mesh>
              <cylinderGeometry args={[.034, .034, .018, 24]} />
              <meshStandardMaterial color="#9c958a" roughness={.32} metalness={.8} />
            </mesh>
            <mesh position={[0, -.011, 0]}>
              <cylinderGeometry args={[.013, .013, .005, 6]} />
              <meshStandardMaterial color="#25272a" roughness={.48} metalness={.3} />
            </mesh>
          </group>
        ))}
        {/* Cylindrical mounting collar with visible hex bolts. */}
        <group position={[1.30, -.01, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[.19, .19, .29, 32]} />
            <meshStandardMaterial color="#373c43" roughness={.38} metalness={.64} />
          </mesh>
          {[-.07, .07].map(y => (
            <group key={y} position={[.025, y, .183]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[.042, .042, .022, 24]} />
                <meshStandardMaterial color="#a8a29b" roughness={.32} metalness={.78} />
              </mesh>
              <mesh position={[0, 0, .015]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[.019, .019, .009, 6]} />
                <meshStandardMaterial color="#292c31" roughness={.4} metalness={.4} />
              </mesh>
            </group>
          ))}
        </group>
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
