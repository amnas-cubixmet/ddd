"use client";

import { Html, OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  Spherical,
  Vector3,
  type Group,
  type ShaderMaterial,
} from "three";
import type { OrbitControls as Orbit } from "three-stdlib";
import { countries, origin, type Country } from "@/lib/global-presence";
import styles from "./presence.module.css";
import { compactSceneQuery, useMediaQuery } from "../use-media-query";

const start = { latitude: 14, longitude: 65 };
const initialCamera = pointOnGlobe(start, 4.4).toArray();
const highlighted = "#79C6FF";
const neutral = "#A7BFD5";

function pointOnGlobe(
  point: Pick<Country, "latitude" | "longitude">,
  radius = 1,
) {
  const lat = MathUtils.degToRad(point.latitude);
  const lon = MathUtils.degToRad(point.longitude);
  return new Vector3(
    Math.cos(lat) * Math.cos(lon),
    Math.sin(lat),
    -Math.cos(lat) * Math.sin(lon),
  ).multiplyScalar(radius);
}

const earthVertex = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vEye;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vEye = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const earthFragment = `
  uniform sampler2D geography;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vEye;
  void main() {
    vec2 mask = texture2D(geography, vUv).rg;
    vec3 n = normalize(vNormal);
    float limb = max(dot(n, normalize(vEye)), 0.);
    vec2 terrain = vUv * vec2(210., 105.);
    float dots = 1. - smoothstep(.14, .38, length(fract(terrain) - .5));
    float land = smoothstep(.13, .75, mask.r);
    vec3 navy = vec3(20., 32., 46.) / 255.;
    vec3 blue = vec3(31., 115., 189.) / 255.;
    vec3 sky = vec3(155., 187., 216.) / 255.;
    vec3 base = mix(navy, blue, .13 * pow(1. - limb, 2.));
    vec3 led = mix(sky, vec3(1.), mask.g);
    float visibility = mix(.48, .98, max(limb, mask.g));
    gl_FragColor = vec4(mix(base, led, dots * land * visibility), 1.);
  }
`;

function Earth({ onReady }: { onReady: () => void }) {
  const texture = useTexture("/maps/earth-mask.png");
  const uniforms = useMemo(
    () => ({ geography: { value: texture } }),
    [texture],
  );
  useEffect(onReady, [onReady]);
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 48]} />
      <shaderMaterial
        vertexShader={earthVertex}
        fragmentShader={earthFragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function makeRoute(country: Country) {
  const a = pointOnGlobe(origin),
    b = pointOnGlobe(country);
  const angle = Math.acos(MathUtils.clamp(a.dot(b), -1, 1));
  const path = new Float32Array(65 * 3),
    steps = new Float32Array(65);
  for (let i = 0; i <= 64; i++) {
    const t = i / 64;
    const sample = a
      .clone()
      .multiplyScalar(Math.sin((1 - t) * angle) / Math.sin(angle))
      .addScaledVector(b, Math.sin(t * angle) / Math.sin(angle));
    sample.multiplyScalar(
      1.018 + Math.sin(Math.PI * t) * (0.09 + angle * 0.14),
    );
    sample.toArray(path, i * 3);
    steps[i] = t;
  }
  const segments = Array.from({ length: 64 }, (_, index) => [
    index,
    index + 1,
  ]).flat();
  return new BufferGeometry()
    .setIndex(segments)
    .setAttribute("position", new Float32BufferAttribute(path, 3))
    .setAttribute("progress", new Float32BufferAttribute(steps, 1));
}

function Route({
  country,
  selected,
  reduced,
}: {
  country: Country;
  selected: boolean;
  reduced: boolean;
}) {
  const geometry = useMemo(() => makeRoute(country), [country]);
  const material = useRef<ShaderMaterial>(null);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      tint: { value: new Color(selected ? highlighted : neutral) },
      selectedRoute: { value: selected ? 1 : 0 },
      motion: { value: reduced ? 0 : 1 },
    }),
    [selected, reduced],
  );
  useFrame((_, delta) => {
    if (material.current && !reduced)
      material.current.uniforms.time.value += Math.min(delta, 0.05);
  });
  return (
    <lineSegments geometry={geometry}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={`
        attribute float progress;
        varying float along;
        void main(){ along = progress; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }
      `}
        fragmentShader={`
        uniform vec3 tint;
        uniform float time, selectedRoute, motion;
        varying float along;
        void main(){
          float front = fract(time * (.29 + selectedRoute * .27));
          float glow = (1. - smoothstep(0., .18, abs(along - front))) * motion;
          float entrance = mix(1., smoothstep(along - .06, along + .01, time * 1.15 - .25), motion);
          gl_FragColor = vec4(tint * (1.4 + glow), entrance * mix(.42, 1., selectedRoute) * (.78 + .22 * glow));
        }
      `}
      />
    </lineSegments>
  );
}

function AnimatedConnections({
  selected,
  reduced,
}: {
  selected: Country;
  reduced: boolean;
}) {
  return countries
    .slice(1)
    .map((country) => (
      <Route
        key={country.code}
        country={country}
        selected={country.code === selected.code}
        reduced={reduced}
      />
    ));
}

function CountryMarker({
  country,
  selected,
  onSelect,
  reduced,
  index,
}: {
  country: Country;
  selected: boolean;
  onSelect: (country: Country) => void;
  reduced: boolean;
  index: number;
}) {
  const position = useMemo(() => pointOnGlobe(country, 1.019), [country]);
  const group = useRef<Group>(null);
  const ring = useRef<Group>(null);
  const shown = useRef(false);
  const elapsedRef = useRef(0);
  const [front, setFront] = useState(false);
  const [hover, setHover] = useState(false);
  useFrame(({ camera }, delta) => {
    if (!group.current || !ring.current) return;
    elapsedRef.current += Math.min(delta, 0.05);
    const visible = camera.position.dot(position) > 1.08;
    if (visible !== shown.current) {
      shown.current = visible;
      setFront(visible);
      if (!visible) setHover(false);
    }
    const elapsed = elapsedRef.current;
    const reveal = reduced
      ? 1
      : MathUtils.smoothstep(
          elapsed,
          0.17 + index * 0.055,
          0.57 + index * 0.055,
        );
    group.current.scale.setScalar(reveal);
    group.current.visible = visible;
    ring.current.scale.setScalar(
      reduced ? 1 : 1 + Math.sin(elapsed * 3.3 - index * 0.5) * 0.2,
    );
    group.current.quaternion.copy(camera.quaternion);
  });

  const color = selected ? highlighted : neutral;
  return (
    <group ref={group} position={position}>
      <group ref={ring}>
        <mesh>
          <ringGeometry
            args={selected ? [0.025, 0.031, 24] : [0.017, 0.021, 20]}
          />
          <meshBasicMaterial
            color={color}
            toneMapped={false}
            transparent
            opacity={selected ? 0.94 : 0.65}
            depthWrite={false}
          />
        </mesh>
      </group>
      <mesh
        onPointerOver={(event) => {
          event.stopPropagation();
          if (shown.current) setHover(true);
        }}
        onPointerOut={() => setHover(false)}
        onClick={(event) => {
          event.stopPropagation();
          if (shown.current && event.delta < 5) onSelect(country);
        }}
      >
        <circleGeometry args={[0.032, 20]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[selected ? 0.013 : 0.0085, 18]} />
        <meshBasicMaterial
          color={selected ? highlighted : neutral}
          toneMapped={false}
        />
      </mesh>
      {front && (hover || selected) && (
        <Html
          position={[0, 0.045, 0]}
          center
          zIndexRange={[2, 0]}
          style={{ pointerEvents: "none" }}
        >
          <span className={styles.markerLabel}>{country.name}</span>
        </Html>
      )}
    </group>
  );
}

function GlobeScene({
  country,
  focusRequest,
  onSelect,
  onReady,
  onFailure,
  reduced,
}: GlobeProps) {
  const controls = useRef<Orbit>(null);
  const pose = useRef<gsap.core.Tween | null>(null);
  const { camera, invalidate, gl } = useThree();

  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);

  useEffect(() => {
    const orbit = controls.current;
    if (!orbit) return;
    if (reduced && !focusRequest) {
      camera.position.copy(pointOnGlobe(start, 3.22));
      orbit.update();
      invalidate();
      return;
    }

    const from = new Spherical().setFromVector3(camera.position);
    const destination = new Spherical().setFromVector3(
      pointOnGlobe(focusRequest ? country : start, focusRequest ? 2.93 : 3.22),
    );
    const shortest = Math.atan2(
      Math.sin(destination.theta - from.theta),
      Math.cos(destination.theta - from.theta),
    );
    const update = () => {
      camera.position.setFromSpherical(from);
      orbit.update();
      invalidate();
    };
    if (reduced) {
      from.set(destination.radius, destination.phi, destination.theta);
      update();
      return;
    }
    pose.current = gsap.to(from, {
      radius: destination.radius,
      phi: destination.phi,
      theta: from.theta + shortest,
      duration: 1.15,
      ease: "power3.inOut",
      onUpdate: update,
    });
    return () => {
      pose.current?.kill();
    };
  }, [camera, country, focusRequest, invalidate, reduced]);

  return (
    <>
      <Suspense fallback={null}>
        <Earth onReady={onReady} />
      </Suspense>
      <AnimatedConnections selected={country} reduced={reduced} />
      {countries.map((marker, index) => (
        <CountryMarker
          key={marker.code}
          country={marker}
          selected={marker.code === country.code}
          onSelect={onSelect}
          reduced={reduced}
          index={index}
        />
      ))}
      <OrbitControls
        ref={controls}
        enablePan={false}
        enableZoom={false}
        enableDamping={!reduced}
        autoRotate={!reduced && focusRequest === 0}
        autoRotateSpeed={0.23}
        rotateSpeed={0.49}
        minPolarAngle={0.27}
        maxPolarAngle={Math.PI - 0.27}
        onStart={() => pose.current?.kill()}
      />
    </>
  );
}

type GlobeProps = {
  country: Country;
  focusRequest: number;
  reduced: boolean;
  onSelect: (country: Country) => void;
  onReady: () => void;
  onFailure: () => void;
};

export default function InteractiveGlobe(props: GlobeProps) {
  const { reduced } = props;
  const compact = useMediaQuery(compactSceneQuery);
  const [visible, setVisible] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = wrapper.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className={styles.canvas}
      ref={wrapper}
      aria-hidden="true"
      data-testid="presence-canvas"
    >
      <Canvas
        frameloop={visible && !reduced ? "always" : "demand"}
        camera={{ position: initialCamera, fov: compact ? 43 : 51 }}
        dpr={[1, compact ? 1.2 : 1.4]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <GlobeScene {...props} />
      </Canvas>
    </div>
  );
}
