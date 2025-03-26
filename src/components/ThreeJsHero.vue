<template>
  <div ref="container" class="absolute top-0 left-0 w-full h-full -z-10"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

const container = ref(null);
let scene, camera, renderer, controls;
let particles, particleSystem;
let animationFrameId;

const init = () => {
  // Scene
  scene = new THREE.Scene();
  
  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 30;
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.value.appendChild(renderer.domElement);
  
  // Particles
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 2000;
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  const colorPalette = [
    new THREE.Color('#3498db'), // primary
    new THREE.Color('#2c3e50'), // secondary
    new THREE.Color('#e74c3c')  // accent
  ];
  
  for (let i = 0; i < particleCount; i++) {
    // Positions - creating a sphere-like distribution
    const radius = 15 + (Math.random() * 10);
    const theta = Math.random() * Math.PI * 2; // random angle around y-axis
    const phi = Math.acos((Math.random() * 2) - 1); // random angle from top to bottom
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);     // x
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
    positions[i * 3 + 2] = radius * Math.cos(phi);                   // z
    
    // Colors
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });
  
  particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);
  
  // Controls (limited to rotation only)
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  
  // Initial animation
  gsap.from(particleSystem.scale, {
    x: 0.1,
    y: 0.1,
    z: 0.1,
    duration: 2,
    ease: "power2.out"
  });
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
};

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);
  
  // Rotate particle system slightly
  particleSystem.rotation.y += 0.001;
  
  // Update controls
  controls.update();
  
  // Render
  renderer.render(scene, camera);
};

const onWindowResize = () => {
  camera.aspect = container.value.clientWidth / container.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
};

onMounted(() => {
  init();
  animate();
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', onWindowResize);
  
  // Clean up Three.js objects
  if (particleSystem) {
    particleSystem.geometry.dispose();
    particleSystem.material.dispose();
    scene.remove(particleSystem);
  }
  
  if (renderer) {
    renderer.dispose();
    container.value?.removeChild(renderer.domElement);
  }
});
</script> 