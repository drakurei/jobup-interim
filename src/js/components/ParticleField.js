/**
 * ParticleField.js — formes géométriques 3D flottantes en InstancedMesh.
 *
 * Octaèdres wireframe-light disposés en volume devant la caméra. Chaque instance
 * a sa propre orbite + phase de respiration. La position cible suit doucement
 * la souris via un offset lissé (lag), créant une parallaxe organique.
 *
 * Performance : 1 seul draw call (InstancedMesh) → 60fps même à 4K avec 140 instances.
 */

import * as THREE from 'three';

const COUNT_DESKTOP = 140;
const COUNT_TABLET = 60;

/**
 * Crée le champ d'instances avec leurs paramètres d'animation pré-calculés.
 * @param {{ isHighEnd?: boolean }} options
 * @returns {{ mesh: THREE.InstancedMesh, update: (t: number, mouse: THREE.Vector2) => void, dispose: () => void }}
 */
export function createParticleField({ isHighEnd = true } = {}) {
  const count = isHighEnd ? COUNT_DESKTOP : COUNT_TABLET;

  const geometry = new THREE.OctahedronGeometry(0.18, 0);
  const material = new THREE.MeshBasicMaterial({
    color: 0x64B5F6,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });

  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  // Paramètres par instance : base position + orbit radius + phase + speed + size
  const instances = new Array(count);
  for (let i = 0; i < count; i++) {
    instances[i] = {
      baseX: (Math.random() - 0.5) * 18,
      baseY: (Math.random() - 0.5) * 10,
      baseZ: (Math.random() - 0.5) * 8 - 4,
      orbitRadius: 0.3 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      speed: 0.15 + Math.random() * 0.35,
      rotSpeedX: (Math.random() - 0.5) * 0.6,
      rotSpeedY: (Math.random() - 0.5) * 0.6,
      scale: 0.5 + Math.random() * 1.4,
    };
  }

  const dummy = new THREE.Object3D();
  const mouseTarget = new THREE.Vector2(0, 0);
  const mouseSmooth = new THREE.Vector2(0, 0);

  /**
   * Met à jour toutes les instances. Appelée à chaque frame.
   * @param {number} t      Temps écoulé en secondes
   * @param {THREE.Vector2} mouse  Position souris normalisée [-1, 1]
   */
  const update = (t, mouse) => {
    mouseTarget.copy(mouse);
    mouseSmooth.lerp(mouseTarget, 0.06);
    const mx = mouseSmooth.x * 1.5;
    const my = mouseSmooth.y * 1.0;

    for (let i = 0; i < count; i++) {
      const p = instances[i];
      const angle = t * p.speed + p.phase;

      dummy.position.set(
        p.baseX + Math.cos(angle) * p.orbitRadius + mx * (0.3 + p.orbitRadius * 0.2),
        p.baseY + Math.sin(angle) * p.orbitRadius + my * (0.3 + p.orbitRadius * 0.2),
        p.baseZ + Math.sin(angle * 0.7) * p.orbitRadius * 0.5
      );

      dummy.rotation.set(t * p.rotSpeedX, t * p.rotSpeedY, 0);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  };

  const dispose = () => {
    geometry.dispose();
    material.dispose();
  };

  return { mesh, update, dispose };
}
