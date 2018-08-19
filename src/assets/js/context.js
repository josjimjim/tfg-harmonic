import * as THREE from 'three';

export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 400;

export function initContext(canvas, camera, scene, renderer) {
  camera = new THREE.PerspectiveCamera(20, CANVAS_WIDTH/CANVAS_HEIGHT, 0.1, 1000);
  camera.position.set(0, 0, 100);
  camera.lookAt( new THREE.Vector3(0, 0, 0));

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas = document.getElementById("canvas");
  canvas.appendChild(renderer.domElement);

  scene = new THREE.Scene();
}
