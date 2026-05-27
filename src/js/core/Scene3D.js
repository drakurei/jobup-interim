/**
 * Scene3D.js — orchestrateur Three.js (light theme).
 *
 * Light theme : on garde uniquement le fond shader (gradient cream subtil).
 * Les particules wireframe bleues et les objets 3D flottants sont désactivés
 * car ils alourdissaient visuellement le rendu sur fond clair.
 *
 * Limite : ≤ 150 lignes.
 */

import * as THREE from 'three';
import { createShaderBackground } from '../components/ShaderBackground.js';

const MAX_DPR = 2;

/**
 * @param {{ canvas: HTMLCanvasElement, isHighEnd?: boolean }} options
 * @returns {{ dispose: () => void } | null}
 */
export function initScene3D({ canvas, isHighEnd = true } = {}) {
  if (!canvas || !window.WebGLRenderingContext) return null;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x06070D, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 6);

  const background = createShaderBackground();
  scene.add(background.mesh);

  const mouse = new THREE.Vector2(0, 0);
  const clock = new THREE.Clock();

  const onPointerMove = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    background.uniforms.uResolution.value.set(
      w * renderer.getPixelRatio(),
      h * renderer.getPixelRatio()
    );
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('resize', onResize);
  onResize();

  let rafId = 0;
  let running = true;

  const tick = () => {
    if (!running) return;
    const t = clock.getElapsedTime();
    background.uniforms.uTime.value = t;
    background.uniforms.uMouse.value.set(mouse.x, mouse.y);
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  };

  const onVisibility = () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(rafId);
    } else if (!running) {
      running = true;
      clock.start();
      tick();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  tick();

  const dispose = () => {
    running = false;
    cancelAnimationFrame(rafId);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    background.dispose();
    renderer.dispose();
  };

  return { dispose };
}
