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
let plane, waveMaterial;
let animationFrameId;
let light, directionalLight;

const init = () => {
  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x111827, 0.01);
  
  // Camera
  camera = new THREE.PerspectiveCamera(
    60,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 8, 30);
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    precision: 'highp',
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.value.appendChild(renderer.domElement);
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  
  light = new THREE.PointLight(0x3498db, 1, 50);
  light.position.set(0, 12, 0);
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  scene.add(light);
  
  directionalLight = new THREE.DirectionalLight(0xe74c3c, 0.8);
  directionalLight.position.set(-10, 15, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);
  
  // Add subtle hemisphere light for ambient gradient
  const hemisphereLight = new THREE.HemisphereLight(0x3498db, 0xe74c3c, 0.3);
  scene.add(hemisphereLight);
  
  // Wave Plane with higher resolution for detailed terrain
  const planeGeometry = new THREE.PlaneGeometry(100, 100, 256, 256);
  
  // Custom shader material for advanced waves
  waveMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#3498db') }, // Primary color
      uColorB: { value: new THREE.Color('#2c3e50') }, // Secondary color
      uColorC: { value: new THREE.Color('#e74c3c') }, // Accent color
      uNoiseScale: { value: new THREE.Vector2(0.3, 0.3) },
      uNoiseFrequency: { value: 1.5 },
      uNoiseSpeed: { value: 0.2 },
      uWavesFrequency: { value: new THREE.Vector2(8.0, 5.0) },
      uWaveAmplitude: { value: 0.5 },
      uWaveSpeed: { value: 0.3 },
      uLightPosition: { value: new THREE.Vector3(0, 12, 0) },
      uLightColor: { value: new THREE.Color('#ffffff') },
      uSpecularStrength: { value: 1.0 },
      uViewPosition: { value: camera.position }
    },
    vertexShader: `
      uniform float uTime;
      uniform vec2 uNoiseScale;
      uniform float uNoiseFrequency;
      uniform float uNoiseSpeed;
      uniform vec2 uWavesFrequency;
      uniform float uWaveAmplitude;
      uniform float uWaveSpeed;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      varying float vElevation;
      varying vec3 vPosition;
      varying vec3 vViewDirection;
      varying vec3 vSurfaceToLight;
      
      uniform vec3 uLightPosition;
      uniform vec3 uViewPosition;
      
      // Classic Perlin 3D Noise by Stefan Gustavson
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
      vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
      
      float cnoise(vec3 P){
        vec3 Pi0 = floor(P);
        vec3 Pi1 = Pi0 + vec3(1.0);
        Pi0 = mod(Pi0, 289.0);
        Pi1 = mod(Pi1, 289.0);
        vec3 Pf0 = fract(P);
        vec3 Pf1 = Pf0 - vec3(1.0);
        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
        vec4 iy = vec4(Pi0.yy, Pi1.yy);
        vec4 iz0 = Pi0.zzzz;
        vec4 iz1 = Pi1.zzzz;
        
        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);
        
        vec4 gx0 = ixy0 / 7.0;
        vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
        gx0 = fract(gx0);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);
        
        vec4 gx1 = ixy1 / 7.0;
        vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
        gx1 = fract(gx1);
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);
        
        vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
        vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
        vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
        vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
        vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
        vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
        vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
        vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
        
        vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
        g000 *= norm0.x;
        g010 *= norm0.y;
        g100 *= norm0.z;
        g110 *= norm0.w;
        vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
        g001 *= norm1.x;
        g011 *= norm1.y;
        g101 *= norm1.z;
        g111 *= norm1.w;
        
        float n000 = dot(g000, Pf0);
        float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
        float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
        float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
        float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
        float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
        float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
        float n111 = dot(g111, Pf1);
        
        vec3 fade_xyz = fade(Pf0);
        vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
        vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
        float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
        return 2.2 * n_xyz;
      }
      
      // FBM noise function for more natural terrain-like variations
      float fbm(vec3 p) {
        float amplitude = 1.0;
        float frequency = 1.0;
        float total = 0.0;
        float maxValue = 0.0;
        
        for(int i = 0; i < 4; i++) {
          total += amplitude * cnoise(p * frequency);
          maxValue += amplitude;
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        
        return total / maxValue;
      }
      
      void main() {
        vUv = uv;
        
        // Complex wave animation using multiple wave patterns + Perlin noise
        vec3 pos = position;
        
        // Base wave pattern (using sine)
        float waveX = sin(uv.x * uWavesFrequency.x + uTime * uWaveSpeed) * uWaveAmplitude;
        float waveY = sin(uv.y * uWavesFrequency.y + uTime * uWaveSpeed) * uWaveAmplitude;
        
        // Terrain-like noise
        vec3 noisePos = vec3(
          pos.x * uNoiseScale.x,
          pos.y * uNoiseScale.y,
          uTime * uNoiseSpeed
        );
        
        // Mix sine waves with FBM noise
        float noiseValue = fbm(noisePos * uNoiseFrequency);
        
        // Create detailed terrain by combining waves and noise
        pos.z += waveX + waveY + noiseValue * 2.0;
        
        // Store elevation for coloring
        vElevation = pos.z;
        
        // Calculate normals for lighting
        // We need to manually calculate normals since we're deforming the mesh
        vec3 bitangent = vec3(0.0, 1.0, (waveY + noiseValue) * 2.0);
        vec3 tangent = vec3(1.0, 0.0, (waveX + noiseValue) * 2.0);
        vNormal = normalize(cross(tangent, bitangent));
        
        // For lighting calculations
        vPosition = pos;
        vViewDirection = normalize(uViewPosition - pos);
        vSurfaceToLight = normalize(uLightPosition - pos);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uColorC;
      uniform vec3 uLightColor;
      uniform float uSpecularStrength;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      varying float vElevation;
      varying vec3 vPosition;
      varying vec3 vViewDirection;
      varying vec3 vSurfaceToLight;
      
      void main() {
        // Create a sophisticated gradient based on elevation and position
        vec3 colorMix1 = mix(uColorA, uColorB, vUv.x * 0.8 + vUv.y * 0.2);
        vec3 colorMix2 = mix(colorMix1, uColorC, (vElevation * 0.5 + 0.5) * 0.7);
        
        // Enhanced lighting calculations
        // Ambient lighting
        float ambientStrength = 0.15;
        vec3 ambient = ambientStrength * uLightColor;
        
        // Diffuse lighting
        float diffuseStrength = max(dot(vNormal, vSurfaceToLight), 0.0);
        vec3 diffuse = diffuseStrength * uLightColor;
        
        // Specular lighting (Blinn-Phong)
        vec3 halfwayDir = normalize(vSurfaceToLight + vViewDirection);
        float spec = pow(max(dot(vNormal, halfwayDir), 0.0), 64.0);
        vec3 specular = uSpecularStrength * spec * uLightColor;
        
        // Apply advanced lighting to the color mix
        vec3 finalColor = (ambient + diffuse) * colorMix2 + specular;
        
        // Add depth with atmospheric fog effect
        float depth = length(vPosition) / 100.0;
        float fog = 1.0 - exp(-depth * 0.5);
        vec3 fogColor = uColorB * 0.5;
        finalColor = mix(finalColor, fogColor, fog * 0.2);
        
        // Add subtle rim lighting for edge highlights
        float rimFactor = 1.0 - max(dot(vViewDirection, vNormal), 0.0);
        rimFactor = smoothstep(0.5, 1.0, rimFactor);
        finalColor += rimFactor * uColorA * 0.3;
        
        gl_FragColor = vec4(finalColor, 0.95);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  });
  
  plane = new THREE.Mesh(planeGeometry, waveMaterial);
  plane.rotation.x = -Math.PI / 2 + 0.3;
  plane.position.y = -8;
  plane.receiveShadow = true;
  scene.add(plane);
  
  // Add subtle environment
  const skyColors = [0x2c3e50, 0x3498db, 0x1a2530];
  scene.background = new THREE.Color(skyColors[0]);
  scene.background.lerp(new THREE.Color(skyColors[1]), 0.3);
  
  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.04;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.2;
  controls.minPolarAngle = Math.PI * 0.3;
  controls.maxPolarAngle = Math.PI * 0.5;
  
  // Advanced animation effects
  // Floating light
  const timeline = gsap.timeline({
    repeat: -1,
    yoyo: true
  });
  
  timeline.to(light.position, {
    y: 15,
    duration: 4,
    ease: "sine.inOut"
  });
  
  timeline.to(light.position, {
    x: 5,
    z: 3,
    duration: 5,
    ease: "sine.inOut"
  }, "-=2");
  
  // Intro animation
  gsap.from(plane.position, {
    y: -20,
    duration: 2.5,
    ease: "power2.out"
  });
  
  gsap.from(plane.rotation, {
    x: -Math.PI / 2 - 0.3,
    duration: 2.5,
    ease: "elastic.out(1, 0.5)"
  });
  
  // Animate camera
  gsap.from(camera.position, {
    z: 50,
    y: 20,
    duration: 3,
    ease: "power3.out"
  });
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
};

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);
  
  // Update wave material time
  waveMaterial.uniforms.uTime.value += 0.01;
  
  // Update view position uniform for lighting
  waveMaterial.uniforms.uViewPosition.value.copy(camera.position);
  
  // Update light position for shader
  waveMaterial.uniforms.uLightPosition.value.copy(light.position);
  
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
  if (plane) {
    plane.geometry.dispose();
    plane.material.dispose();
    scene.remove(plane);
  }
  
  if (renderer) {
    renderer.dispose();
    container.value?.removeChild(renderer.domElement);
  }
});
</script> 