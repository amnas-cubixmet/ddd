import {
  BoxGeometry,
  CanvasTexture,
  DataTexture,
  RepeatWrapping,
  LinearMipmapLinearFilter,
  LinearFilter,
  SRGBColorSpace,
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Path,
  Shape,
  Box3,
  Vector3,
  type BufferGeometry,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  mergeGeometries,
  toCreasedNormals,
} from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Plan view in the casting's local plane. The shoulders narrow around the spigot.
function casting() {
  const s = new Shape();
  s.moveTo(-1.53, -0.32);
  s.bezierCurveTo(-1.53, -0.58, -1.39, -0.71, -1.07, -0.71);
  s.bezierCurveTo(-0.56, -0.72, 0.4, -0.69, 0.8, -0.62);
  s.bezierCurveTo(1.1, -0.57, 1.29, -0.32, 1.47, -0.22);
  s.quadraticCurveTo(1.53, -0.18, 1.53, 0);
  s.quadraticCurveTo(1.53, 0.18, 1.47, 0.22);
  s.bezierCurveTo(1.29, 0.32, 1.1, 0.57, 0.8, 0.62);
  s.bezierCurveTo(0.4, 0.69, -0.56, 0.72, -1.07, 0.71);
  s.bezierCurveTo(-1.39, 0.71, -1.53, 0.58, -1.53, 0.32);
  s.closePath();
  return s;
}

function windowOutline(length: number, width: number, radius: number) {
  const x = length / 2,
    y = width / 2,
    s = new Shape();
  s.moveTo(-x + radius, -y);
  s.lineTo(x - radius, -y);
  s.quadraticCurveTo(x, -y, x, -y + radius);
  s.lineTo(x, y - radius);
  s.quadraticCurveTo(x, y, x - radius, y);
  s.lineTo(-x + radius, y);
  s.quadraticCurveTo(-x, y, -x, y - radius);
  s.lineTo(-x, -y + radius);
  s.quadraticCurveTo(-x, -y, -x + radius, -y);
  return s;
}

function bevel(shape: Shape, depth: number, edge: number) {
  return toCreasedNormals(
    new ExtrudeGeometry(shape, {
      depth,
      bevelSize: edge,
      bevelThickness: edge,
      bevelSegments: 3,
      curveSegments: 10,
      steps: 1,
    }),
    Math.PI / 3,
  );
}

function metal(color: string, roughness: number) {
  return new MeshStandardMaterial({ color, roughness, metalness: 0.82 });
}

// Baked optical falloff and fine powder-coat grain are local, deterministic textures.
function opalTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(256, 128);
  const gradient = ctx.createRadialGradient(0.48, 0.48, 0.13, 0.5, 0.5, 0.6);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.68, "#f2f4f8");
  gradient.addColorStop(1, "#afb8c6");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1, 1);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function castGrain() {
  const pixels = new Uint8Array(128 * 128 * 4);
  let seed = 49;
  for (let i = 0; i < pixels.length; i += 4) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const shade = 150 + (seed >>> 25) * 0.8;
    pixels.set([shade, shade, shade, 255], i);
  }
  const texture = new DataTexture(pixels, 128, 128);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.generateMipmaps = true;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export function buildStreetlight() {
  const assembly = new Group();
  const head = new Group();
  assembly.add(head);
  head.position.set(-0.42, 0.78, 0);
  head.rotation.order = "ZYX";
  head.rotation.set(-0.49, 0.46, -0.31);
  const castingMetal = metal("#53545a", 0.34);
  const anodized = metal("#343537", 0.42);
  const graphite = metal("#27282b", 0.36);
  const silver = metal("#c7beb3", 0.26);
  const grain = castGrain();
  for (const finish of [castingMetal, anodized, graphite]) {
    finish.roughnessMap = grain;
    finish.bumpMap = grain;
    finish.bumpScale = 0.0014;
  }
  const opticalFalloff = opalTexture();
  const opal = new MeshPhysicalMaterial({
    color: "#14171c",
    map: opticalFalloff,
    emissive: "#ffffff",
    emissiveIntensity: 0,
    roughness: 0.42,
    metalness: 0,
    clearcoat: 0.34,
    clearcoatRoughness: 0.27,
  });
  function part(
    parent: Group,
    geometry: BufferGeometry,
    material: MeshStandardMaterial,
    x: number,
    y: number,
    z: number,
  ) {
    const mesh = new Mesh(geometry, material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }
  function face(
    geometry: BufferGeometry,
    material: MeshStandardMaterial,
    x: number,
    y: number,
  ) {
    const mesh = part(head, geometry, material, x, y, 0);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  }
  face(bevel(casting(), 0.145, 0.055), castingMetal, 0, 0.075);
  face(bevel(casting(), 0.027, 0.014), graphite, 0, -0.12);
  const rim = windowOutline(2.54, 1.32, 0.32);
  const aperture = windowOutline(2.31, 1.035, 0.24);
  rim.holes.push(new Path(aperture.getPoints(12).reverse()));
  face(bevel(rim, 0.038, 0.012), anodized, -0.2, -0.146);
  const diffuser = bevel(aperture, 0.02, 0.018);
  const uv = diffuser.getAttribute("uv");
  const position = diffuser.getAttribute("position");
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, position.getX(i) / 2.31 + 0.5, position.getY(i) / 1.035 + 0.5);
  }
  face(diffuser, opal, -0.2, -0.151);
  face(
    bevel(windowOutline(1.82, 0.025, 0.012), 0.006, 0.006),
    graphite,
    -0.2,
    -0.19,
  );

  // Each rib rises from the shell and rolls back into it at both shoulders.
  const rib = new Shape();
  rib.moveTo(-0.68, 0);
  rib.bezierCurveTo(-0.6, 0.04, -0.51, 0.27, -0.22, 0.29);
  rib.bezierCurveTo(0.11, 0.35, 0.48, 0.32, 0.68, 0);
  rib.closePath();
  for (let i = 0; i < 12; i++) {
    const x = -1.34 + i * 0.242;
    const fin = part(head, bevel(rib, 0.047, 0.015), graphite, x, 0.11, 0);
    fin.rotation.y = -Math.PI / 2;
    const taper = Math.min(1, 0.74 + i * 0.16, 1.3 - Math.max(0, x) * 0.53);
    fin.scale.set(taper, taper * 1.35, 1);
  }

  // Chamfered head with a real six-sided socket and a dark recessed floor.
  function bolt(parent: Group, x: number, y: number, z: number, side = false) {
    const boss = new Group();
    parent.add(boss);
    boss.position.set(x, y, z);
    boss.rotation.x = side ? 0 : Math.PI / 2;
    if (side) boss.scale.setScalar(1.6);
    const ring = new Shape();
    ring.absarc(0, 0, 0.036, 0, Math.PI * 2, false);
    const socket = new Path();
    for (let i = 0; i <= 6; i++) {
      const angle = (-i * Math.PI) / 3;
      const px = 0.016 * Math.cos(angle),
        py = 0.016 * Math.sin(angle);
      if (i === 0) socket.moveTo(px, py);
      else socket.lineTo(px, py);
    }
    ring.holes.push(socket);
    part(boss, bevel(ring, 0.008, 0.0025), silver, 0, 0, 0);
    part(boss, new BoxGeometry(0.036, 0.036, 0.002), graphite, 0, 0, -0.002);
  }
  for (const x of [-1.16, -0.22, 0.75]) {
    for (const z of [-0.59, 0.59]) bolt(head, x, -0.201, z);
  }
  bolt(head, 1.18, -0.153, 0.3);
  const collar = part(
    head,
    new CylinderGeometry(0.209, 0.23, 0.32, 48),
    anodized,
    1.53,
    -0.005,
    0,
  );
  collar.rotation.z = Math.PI / 2;
  for (const y of [-0.084, 0.084]) bolt(head, 1.59, y, 0.207, true);
  assembly.updateMatrixWorld(true);
  const headBounds = new Box3().setFromObject(head, true);
  const lensCenter = head.localToWorld(new Vector3(-0.2, -0.17, 0));
  const armExtension = 0.195;
  // Four times the previous 3.10-unit vertical pole; keep its top anchored.
  const poleExtension = (2.34 + 0.76) * 4 - 2.34;
  const arm = part(
    head,
    new CylinderGeometry(0.144, 0.144, 0.65 + armExtension, 40),
    graphite,
    1.94 + armExtension / 2,
    -0.005,
    0,
  );
  arm.rotation.z = Math.PI / 2;
  const armShift = new Vector3(armExtension, 0, 0).applyQuaternion(head.quaternion);
  const poleX = 1.48 + armShift.x,
    poleZ = -0.95 + armShift.z;
  part(
    assembly,
    new RoundedBoxGeometry(0.32, 2.34 + poleExtension, 0.38, 3, 0.026),
    anodized,
    poleX,
    -0.63 + armShift.y - poleExtension / 2,
    poleZ,
  ).rotation.y = 0.3;
  part(
    assembly,
    new RoundedBoxGeometry(0.329, 0.055, 0.389, 3, 0.018),
    castingMetal,
    poleX,
    0.55 + armShift.y,
    poleZ,
  ).rotation.y = 0.3;

  // Batch static hardware by finish so screws and fins cost no extra draws.
  assembly.updateMatrixWorld(true);
  const batches = new Map<MeshStandardMaterial, BufferGeometry[]>();
  assembly.traverse((mesh) => {
    if (!(mesh instanceof Mesh)) return;
    const original = mesh.geometry;
    const geometry = original.index ? original.toNonIndexed() : original;
    geometry.applyMatrix4(mesh.matrixWorld);
    if (geometry !== original) original.dispose();
    const batch = batches.get(mesh.material) ?? [];
    batch.push(geometry);
    batches.set(mesh.material, batch);
  });
  const model = new Group();
  for (const [material, parts] of batches) {
    const merged = mergeGeometries(parts)!;
    model.add(new Mesh(merged, material));
    parts.forEach((part) => part.dispose());
  }
  return {
    model,
    headBounds,
    lensCenter,
    opal,
    dispose() {
      opticalFalloff.dispose();
      grain.dispose();
      for (const child of model.children) (child as Mesh).geometry.dispose();
      for (const material of batches.keys()) material.dispose();
    },
  };
}
