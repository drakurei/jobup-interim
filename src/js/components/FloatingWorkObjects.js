/**
 * FloatingWorkObjects.js — objets 3D thématiques métier qui flottent autour du Hero.
 *
 * Briefcase, laptop, ID badge, mug café, document — tous composés de primitives
 * (Box / Cylinder / Torus) pour rester légers et stylisés. Chaque objet a sa
 * propre orbite, sa rotation continue, et un offset parallaxe à la souris.
 *
 * Rendus en MeshStandardMaterial avec un éclairage simple → silhouettes lisibles.
 * Performance : 5 objets, ~1500 triangles total → 60fps facile en 4K.
 */

import * as THREE from 'three';

const COLOR_BRAND = 0x2196F3;
const COLOR_DEEP = 0x0D47A1;
const COLOR_AMBER = 0xFF9F1C;
const COLOR_CREAM = 0xFFF8E7;
const COLOR_INK = 0x14151C;

function makeBriefcase() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.0, 0.45),
    new THREE.MeshStandardMaterial({ color: COLOR_DEEP, roughness: 0.4, metalness: 0.3 })
  );
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.05, 12, 24, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0x222831, roughness: 0.6 })
  );
  handle.position.set(0, 0.55, 0);
  const buckle = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.08, 0.05),
    new THREE.MeshStandardMaterial({ color: COLOR_AMBER, metalness: 0.6, roughness: 0.3 })
  );
  buckle.position.set(0, 0, 0.23);
  g.add(body, handle, buckle);
  return g;
}

function makeLaptop() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x1B1F2A, roughness: 0.3, metalness: 0.7 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 1.0), mat);
  base.position.y = -0.04;
  const screen = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.06), mat);
  screen.position.set(0, 0.46, -0.48);
  screen.rotation.x = -0.25;
  const display = new THREE.Mesh(
    new THREE.PlaneGeometry(1.45, 0.88),
    new THREE.MeshBasicMaterial({ color: COLOR_BRAND })
  );
  display.position.set(0, 0.46, -0.45);
  display.rotation.x = -0.25;
  g.add(base, screen, display);
  return g;
}

function makeBadge() {
  const g = new THREE.Group();
  const card = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 1.0, 0.04),
    new THREE.MeshStandardMaterial({ color: COLOR_CREAM, roughness: 0.7 })
  );
  const stripe = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 0.22),
    new THREE.MeshBasicMaterial({ color: COLOR_BRAND })
  );
  stripe.position.set(0, 0.35, 0.021);
  const clip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.1, 12),
    new THREE.MeshStandardMaterial({ color: 0x666, metalness: 0.8 })
  );
  clip.position.set(0, 0.55, 0);
  g.add(card, stripe, clip);
  return g;
}

function makeMug() {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: COLOR_CREAM, roughness: 0.5 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.36, 0.75, 24), mat);
  const foam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.04, 24),
    new THREE.MeshStandardMaterial({ color: 0x6B4423, roughness: 0.8 })
  );
  foam.position.y = 0.4;
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.05, 12, 24, Math.PI),
    mat
  );
  handle.position.set(0.45, 0, 0);
  handle.rotation.z = Math.PI / 2;
  g.add(body, foam, handle);
  return g;
}

function makeDocument() {
  const g = new THREE.Group();
  const sheet = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.1, 0.03),
    new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.85 })
  );
  // Lignes (rectangles bleu pâle)
  for (let i = 0; i < 4; i++) {
    const line = new THREE.Mesh(
      new THREE.PlaneGeometry(0.55, 0.05),
      new THREE.MeshBasicMaterial({ color: 0xCFD8DC })
    );
    line.position.set(0, 0.32 - i * 0.18, 0.016);
    g.add(line);
  }
  const stamp = new THREE.Mesh(
    new THREE.CircleGeometry(0.12, 24),
    new THREE.MeshBasicMaterial({ color: COLOR_AMBER, transparent: true, opacity: 0.85 })
  );
  stamp.position.set(0.22, -0.4, 0.016);
  g.add(sheet, stamp);
  return g;
}

const CONFIGS = [
  { make: makeBriefcase, pos: [-5.5, 0.5, -1.5], scale: 0.9, speed: 0.32, phase: 0.0 },
  { make: makeLaptop,    pos: [ 5.8, 1.2, -1.0], scale: 1.0, speed: 0.28, phase: 1.7 },
  { make: makeBadge,     pos: [-4.2, -2.0, 0.5], scale: 0.85, speed: 0.45, phase: 3.1 },
  { make: makeMug,       pos: [ 4.8, -2.2, 0.2], scale: 0.95, speed: 0.38, phase: 2.2 },
  { make: makeDocument,  pos: [-6.0, -3.5, -2.0], scale: 0.7, speed: 0.5, phase: 4.4 },
];

/**
 * @param {{ isHighEnd?: boolean }} options
 * @returns {{ group: THREE.Group, update: (t: number, mouse: THREE.Vector2) => void, dispose: () => void }}
 */
export function createFloatingWorkObjects({ isHighEnd = true } = {}) {
  const group = new THREE.Group();
  const items = CONFIGS.map((cfg) => {
    const mesh = cfg.make();
    mesh.position.set(...cfg.pos);
    mesh.scale.setScalar(cfg.scale);
    group.add(mesh);
    return { mesh, ...cfg, basePos: new THREE.Vector3(...cfg.pos) };
  });

  // Éclairage minimal pour MeshStandardMaterial
  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(3, 5, 4);
  const fill = new THREE.DirectionalLight(0x64B5F6, 0.4);
  fill.position.set(-4, -2, 3);
  group.add(ambient, key, fill);

  const mouseSmooth = new THREE.Vector2();

  /** @param {number} t  @param {THREE.Vector2} mouse */
  const update = (t, mouse) => {
    mouseSmooth.lerp(mouse, 0.04);
    items.forEach((it) => {
      const a = t * it.speed + it.phase;
      it.mesh.position.x = it.basePos.x + Math.cos(a) * 0.4 + mouseSmooth.x * 0.7;
      it.mesh.position.y = it.basePos.y + Math.sin(a * 1.2) * 0.35 + mouseSmooth.y * 0.5;
      it.mesh.position.z = it.basePos.z + Math.sin(a * 0.6) * 0.3;
      it.mesh.rotation.x = a * 0.4;
      it.mesh.rotation.y = a * 0.6;
    });
  };

  const dispose = () => {
    group.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
  };

  return { group, update, dispose };
}
