/**
 * ShaderBackground.js — fond premium dark avec halos radiaux indigo/bleu.
 *
 * Aesthetic "app premium" (réf vidéo) : noir profond + 2 halos doux qui
 * dérivent lentement (un bleu, un indigo), grain très fin pour casser le
 * banding. Calme, spacieux — le contenu reste roi.
 */

import * as THREE from 'three';

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;
  uniform vec3  uColorBg;
  uniform vec3  uColorBlue;
  uniform vec3  uColorIndigo;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Halo radial doux centré sur c, rayon r
  float halo(vec2 uv, vec2 c, float r) {
    float d = length(uv - c);
    return smoothstep(r, 0.0, d);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
    p += uMouse * 0.05;

    float t = uTime * 0.08;

    // Deux halos qui dérivent lentement
    vec2 c1 = vec2(0.32 + sin(t) * 0.06, 0.66 + cos(t * 0.8) * 0.05) - 0.5;
    c1.x *= aspect;
    vec2 c2 = vec2(0.72 + cos(t * 0.7) * 0.05, 0.34 + sin(t * 0.9) * 0.06) - 0.5;
    c2.x *= aspect;

    vec3 col = uColorBg;
    col += uColorBlue   * halo(p, c1, 0.9) * 0.55;
    col += uColorIndigo * halo(p, c2, 0.8) * 0.45;

    // Léger vignettage pour garder la profondeur
    float vig = smoothstep(1.1, 0.2, length(p));
    col *= mix(0.7, 1.0, vig);

    // Grain fin
    float grain = (hash(vUv * uResolution + uTime) - 0.5) * 0.02;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/**
 * @returns {{ mesh: THREE.Mesh, uniforms: object, dispose: () => void }}
 */
export function createShaderBackground() {
  const uniforms = {
    uTime:        { value: 0 },
    uResolution:  { value: new THREE.Vector2(1, 1) },
    uMouse:       { value: new THREE.Vector2(0, 0) },
    uColorBg:     { value: new THREE.Color('#06070D') },
    uColorBlue:   { value: new THREE.Color('#1E3A8A') }, // bleu profond
    uColorIndigo: { value: new THREE.Color('#3B2F8F') }, // indigo profond
  };

  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    depthTest: false,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1;

  const dispose = () => {
    geometry.dispose();
    material.dispose();
  };

  return { mesh, uniforms, dispose };
}
