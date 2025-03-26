<template>
  <div ref="container" class="absolute top-0 left-0 w-full h-full -z-10"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';

const container = ref(null);
let scene, camera, renderer, controls, globe, atmosphere, clouds;
let isInitialized = false;
let raycaster, mouse, markers = [];

// Touch handling variables
let touchStartPosition = new THREE.Vector2();
let touchMovePosition = new THREE.Vector2();
let isTouching = false;
let touchStartTime = 0;

const init = () => {
  if (isInitialized) return;
  isInitialized = true;

  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111827);
  scene.fog = new THREE.FogExp2(0x111827, 0.002);

  // Create camera
  camera = new THREE.PerspectiveCamera(50, container.value.clientWidth / container.value.clientHeight, 0.1, 1000);
  camera.position.set(10, 5, 10); // Position camera directly in front of globe

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.value.appendChild(renderer.domElement);

  // Add lights
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 3, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  // Create Earth globe
  const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
  
  // Earth texture loader
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load(import.meta.env.BASE_URL + 'earth_texture.jpg', () => {
    animate(); // Start animation once texture is loaded
  });
  
  const bumpMap = textureLoader.load(import.meta.env.BASE_URL + 'earth_bump.jpg');
  const specularMap = textureLoader.load(import.meta.env.BASE_URL + 'earth_specular.jpg');
  
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    bumpMap: bumpMap,
    bumpScale: 0.1,
    specularMap: specularMap,
    specular: new THREE.Color(0x333333),
    shininess: 15
  });
  
  globe = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(globe);
  
  // Add a reference marker that will definitely rotate with the globe
  // This is a bright red dot at 0° latitude, 0° longitude (Prime Meridian at Equator)
  const refMarkerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const refMarkerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const refMarker = new THREE.Mesh(refMarkerGeometry, refMarkerMaterial);
  refMarker.position.set(5, 0, 0); // 5 is the radius of the globe
  globe.add(refMarker);
  
  // Add another reference marker at North Pole
  const northPoleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const northPoleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const northPole = new THREE.Mesh(northPoleGeometry, northPoleMaterial);
  northPole.position.set(0, 5, 0); // North pole
  globe.add(northPole);
  
  // Add cloud layer
  const cloudsTexture = textureLoader.load(import.meta.env.BASE_URL + 'clouds.png');
  const cloudsGeometry = new THREE.SphereGeometry(5.1, 64, 64);
  const cloudsMaterial = new THREE.MeshPhongMaterial({
    map: cloudsTexture,
    transparent: true,
    opacity: 0.4,
    depthWrite: false
  });
  
  clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
  scene.add(clouds);
  
  // Add glow effect (atmosphere)
  const atmosphereGeometry = new THREE.SphereGeometry(5.2, 64, 64);
  const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true
  });
  
  atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  scene.add(atmosphere);
  
  // Add stars
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
  });
  
  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
  }
  
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // Add OrbitControls for interaction
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 7;
  controls.maxDistance = 25;
  controls.enablePan = false;
  controls.autoRotate = false;
  controls.target.set(0, 0, 0); // Target the center of the globe
  
  // Enhance trackpad interaction
  controls.enableZoom = true;
  controls.zoomSpeed = 1.0;
  controls.rotateSpeed = 0.5; // Reduce rotation speed for better control
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  };
  
  // Set key bindings for keyboards too
  controls.keys = {
    LEFT: 'ArrowLeft',
    UP: 'ArrowUp', 
    RIGHT: 'ArrowRight',
    BOTTOM: 'ArrowDown'
  };
  
  // Improve inertia for smoother experience
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  // Setup raycaster for mouse interaction
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Add location markers
  addLocationMarkers();
  
  // Create connections between markers
  setTimeout(() => {
    createConnectionArcs();
  }, 1000); // Delay to ensure markers are created first

  // Initial animation
  gsap.from(camera.position, {
    x: 10,
    y: 5,
    z: 10, // Start from further away
    duration: 2.0,
    ease: "power3.out"
  });

  // Add mouse and touch event listeners
  container.value.addEventListener('mousemove', onMouseMove);
  container.value.addEventListener('click', onMouseClick);
  container.value.addEventListener('wheel', onWheel, { passive: false });
  container.value.addEventListener('touchstart', onTouchStart, { passive: false });
  container.value.addEventListener('touchmove', onTouchMove, { passive: false });
  container.value.addEventListener('touchend', onTouchEnd);

  // Handle window resize
  window.addEventListener('resize', onWindowResize);
};

// Add location markers to globe
const addLocationMarkers = () => {
  // Clear any existing markers
  markers = [];
  
  // Location data: [latitude, longitude, label]
  const locations = [
    [34.0522, -118.2437, "Los Angeles"],
    [40.7128, -74.0060, "New York"],
    [51.5074, -0.1278, "London"],
    [48.8566, 2.3522, "Paris"],
    [35.6762, 139.6503, "Tokyo"],
    [25.2769, 51.5200, "Doha"],
    [-33.8688, 151.2093, "Sydney"],
    [37.7749, -122.4194, "San Francisco"],
    [41.0082, 28.9784, "Istanbul"],
    [55.7558, 37.6173, "Moscow"],
    [-22.9068, -43.1729, "Rio de Janeiro"],
    [39.9526, -75.1652, "Philadelphia"],
    [52.0116, 4.3571, "Delft"]
  ];

  // Store markers for Philadelphia and Delft to create a special connection
  let phillyMarker, delftMarker;

  locations.forEach(loc => {
    const [lat, lon, label] = loc;
    
    // Convert lat/lon to 3D coordinates on sphere
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const radius = 5.05; // Just above globe surface
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    // Create marker group
    const markerGroup = new THREE.Group();
    markerGroup.position.set(x, y, z);
    markerGroup.lookAt(0, 0, 0); // Orient toward globe center
    
    // Determine if this is a special location
    const isSpecialLocation = label === "Philadelphia" || label === "Delft";
    
    // Create main dot - larger and different color for special locations
    const dotGeometry = new THREE.SphereGeometry(
      isSpecialLocation ? 0.06 : 0.04, 
      16, 
      16
    );
    
    const dotMaterial = new THREE.MeshBasicMaterial({ 
      color: isSpecialLocation ? 0xf39c12 : 0xe74c3c
    });
    
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    markerGroup.add(dot);
    
    // Create pulsing ring - larger for special locations
    const ringGeometry = new THREE.RingGeometry(
      isSpecialLocation ? 0.07 : 0.05, 
      isSpecialLocation ? 0.14 : 0.1, 
      32
    );
    
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: isSpecialLocation ? 0xf39c12 : 0xe74c3c,
      transparent: true,
      opacity: isSpecialLocation ? 0.8 : 0.6,
      side: THREE.DoubleSide
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2; // Orient the ring properly
    markerGroup.add(ring);
    
    // Add the marker to the globe
    globe.add(markerGroup);
    
    // Animate the ring - faster pulse for special locations
    const timeline = gsap.timeline({
      repeat: -1
    });
    
    timeline.to(ring.scale, {
      x: isSpecialLocation ? 3 : 2.5,
      y: isSpecialLocation ? 3 : 2.5,
      z: isSpecialLocation ? 3 : 2.5,
      duration: isSpecialLocation ? 1.2 : 1.5,
      ease: "power1.out"
    });
    
    timeline.to(ringMaterial, {
      opacity: 0,
      duration: isSpecialLocation ? 1.2 : 1.5,
      ease: "power1.out"
    }, 0);
    
    // Add special outer ring for special locations
    if (isSpecialLocation) {
      const outerRingGeometry = new THREE.RingGeometry(0.16, 0.2, 32);
      const outerRingMaterial = new THREE.MeshBasicMaterial({
        color: 0xf39c12,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      });
      
      const outerRing = new THREE.Mesh(outerRingGeometry, outerRingMaterial);
      outerRing.rotation.x = Math.PI / 2;
      markerGroup.add(outerRing);
      
      // Animate the outer ring with offset timing
      const outerTimeline = gsap.timeline({
        repeat: -1,
        delay: 0.6 // Offset from inner ring
      });
      
      outerTimeline.to(outerRing.scale, {
        x: 3.5,
        y: 3.5,
        z: 3.5,
        duration: 1.5,
        ease: "power1.out"
      });
      
      outerTimeline.to(outerRingMaterial, {
        opacity: 0,
        duration: 1.5,
        ease: "power1.out"
      }, 0);
    }
    
    // Create text label
    // Canvas for text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = isSpecialLocation ? 256 : 128;
    canvas.height = isSpecialLocation ? 80 : 32;
    
    // Style the text
    context.fillStyle = isSpecialLocation 
      ? 'rgba(243, 156, 18, 0.85)'  // Amber background for special
      : 'rgba(44, 62, 80, 0.6)';    // Dark blue for regular
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border
    context.strokeStyle = isSpecialLocation ? '#ff9500' : '#3498db';
    context.lineWidth = isSpecialLocation ? 6 : 2;
    context.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Draw text
    context.fillStyle = '#ffffff';
    context.font = `bold ${isSpecialLocation ? 30 : 16}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    if (isSpecialLocation) {
      context.fillText(label, canvas.width / 2, canvas.height / 3);
      context.font = '16px Arial';
      
      const subtitle = label === "Philadelphia" 
        ? "Current Location" 
        : "Target Destination";
      context.fillText(subtitle, canvas.width / 2, canvas.height * 2/3);
    } else {
      context.fillText(label, canvas.width / 2, canvas.height / 2);
    }
    
    // Create texture and sprite
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: isSpecialLocation ? 1 : 0.8
    });
    
    const sprite = new THREE.Sprite(material);
    
    // Position slightly above the marker
    const direction = new THREE.Vector3(x, y, z).normalize();
    const labelDistance = isSpecialLocation ? 6.0 : 5.7;
    sprite.position.copy(direction.multiplyScalar(labelDistance));
    
    // Scale the sprite
    const scaleX = isSpecialLocation ? 2.5 : 0.8;
    const scaleY = isSpecialLocation ? 0.7 : 0.2;
    sprite.scale.set(scaleX, scaleY, 1);
    
    // Add to globe
    globe.add(sprite);
    
    // Store marker reference for special locations
    if (label === "Philadelphia") phillyMarker = markerGroup;
    if (label === "Delft") delftMarker = markerGroup;
    
    // Push to markers array for raycasting
    markerGroup.userData = {
      label,
      latitude: lat,
      longitude: lon,
      isSpecialLocation
    };
    markers.push(markerGroup);
  });
  
  // Create connection between Philadelphia and Delft
  if (phillyMarker && delftMarker) {
    setTimeout(() => {
      // Get positions
      const point1 = phillyMarker.position.clone();
      const point2 = delftMarker.position.clone();
      
      // Calculate midpoint
      const midPoint = new THREE.Vector3().addVectors(point1, point2).multiplyScalar(0.5);
      
      // Pull midpoint out for arc
      const direction = midPoint.clone().normalize();
      const dist = point1.distanceTo(point2) * 0.25;
      const arcHeight = dist + 0.8;
      midPoint.add(direction.multiplyScalar(arcHeight));
      
      // Create curve
      const curve = new THREE.QuadraticBezierCurve3(
        point1,
        midPoint,
        point2
      );
      
      // Create tube
      const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.04, 12, false);
      const tubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xf39c12,
        transparent: true,
        opacity: 0.8
      });
      
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      globe.add(tube);
      
      // Add pulsing effect
      gsap.to(tubeMaterial, {
        opacity: 0.4,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      // Add traveling points
      for (let i = 0; i < 3; i++) {
        const pointGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const pointMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.9
        });
        
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        globe.add(point);
        
        // Initial position based on offset
        const startOffset = i * 0.3;
        const initialPos = curve.getPoint(startOffset);
        point.position.copy(initialPos);
        
        // Create animation
        const tl = gsap.timeline({
          repeat: -1,
          onUpdate: function() {
            let progress = (this.progress() + startOffset) % 1;
            const pos = curve.getPoint(progress);
            point.position.copy(pos);
          }
        });
        
        tl.to({}, {
          duration: 4
        });
        
        // Add pulsing effect
        gsap.to(point.scale, {
          x: 1.5,
          y: 1.5,
          z: 1.5,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    }, 1500);
  }
};

// Create animated connection arcs between markers
const createConnectionArcs = () => {
  // Removed random connections - we'll only show the Philadelphia-Delft connection
  // which is created separately in the addLocationMarkers function
};

const animate = () => {
  requestAnimationFrame(animate);
  
  // Rotate the globe like a spinning basketball
  if (globe) {
    // Rotate the globe around its Y-axis (like Earth's rotation)
    globe.rotation.y += 0.005;
    
    // Rotate the atmosphere and clouds with the globe
    if (atmosphere) {
      atmosphere.rotation.y = globe.rotation.y;
    }
    if (clouds) {
      // Make clouds rotate slightly faster than the globe
      clouds.rotation.y = globe.rotation.y * 1.1;
    }
  }
  
  controls.update();
  renderer.render(scene, camera);
};

const onWindowResize = () => {
  camera.aspect = container.value.clientWidth / container.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
};

// Handle mouse move for hover effects
const onMouseMove = (event) => {
  event.preventDefault();
  
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
  checkIntersections();
};

// Check for intersections with markers
const checkIntersections = () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(markers, true);
  
  // Reset all markers to default appearance
  markers.forEach(marker => {
    const dot = marker.children[0];
    const { isSpecialLocation } = marker.userData;
    
    // Special locations have different default size and color
    dot.scale.set(
      isSpecialLocation ? 1.2 : 1, 
      isSpecialLocation ? 1.2 : 1, 
      isSpecialLocation ? 1.2 : 1
    );
    dot.material.color.set(isSpecialLocation ? 0xf39c12 : 0xe74c3c);
  });
  
  if (intersects.length > 0) {
    // Find the marker group that was hovered
    let markerGroup = intersects[0].object;
    while (markerGroup.parent && !markers.includes(markerGroup)) {
      markerGroup = markerGroup.parent;
    }
    
    // Make sure we found a valid marker
    if (markers.includes(markerGroup)) {
      // Highlight the marker
      const dot = markerGroup.children[0];
      const { isSpecialLocation } = markerGroup.userData;
      
      // Special locations get a larger highlight effect
      dot.scale.set(
        isSpecialLocation ? 1.8 : 1.4, 
        isSpecialLocation ? 1.8 : 1.4, 
        isSpecialLocation ? 1.8 : 1.4
      );
      
      // Special glow color for Philadelphia and Delft when hovered
      dot.material.color.set(isSpecialLocation ? 0xff9500 : 0xf39c12);
      
      // Change cursor
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
    }
  } else {
    document.body.style.cursor = 'auto';
  }
};

// Handle click events on markers
const onMouseClick = (event) => {
  event.preventDefault();
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(markers, true);
  
  if (intersects.length > 0) {
    // Find the marker group that was clicked
    let markerGroup = intersects[0].object;
    while (markerGroup.parent && !markers.includes(markerGroup)) {
      markerGroup = markerGroup.parent;
    }
    
    // Make sure we found a valid marker
    if (markers.includes(markerGroup)) {
      const { label, isSpecialLocation } = markerGroup.userData;
      
      // Animate to the clicked location
      gsap.to(controls.target, {
        x: markerGroup.position.x * 0.8,
        y: markerGroup.position.y * 0.8,
        z: markerGroup.position.z * 0.8,
        duration: isSpecialLocation ? 1.5 : 1,
        ease: isSpecialLocation ? "elastic.out(1, 0.8)" : "power2.out",
        onUpdate: () => {
          controls.update();
        }
      });
      
      // For special locations, also zoom in a bit closer
      if (isSpecialLocation) {
        gsap.to(camera.position, {
          x: camera.position.x * 0.8,
          y: camera.position.y * 0.8,
          z: camera.position.z * 0.8,
          duration: 1.5,
          ease: "elastic.out(1, 0.8)",
          onUpdate: () => {
            camera.lookAt(controls.target);
          }
        });
      }
    }
  }
};

// Handle wheel events for smoother trackpad zooming
const onWheel = (event) => {
  // Prevent the default behavior to avoid page scrolling
  event.preventDefault();
  
  // Get normalized wheel delta (for cross-browser/device consistency)
  const delta = -Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY) / 100, 0.5);
  
  // Check if it's likely a trackpad pinch gesture (usually has ctrlKey set)
  const isTrackpadPinch = event.ctrlKey || Math.abs(event.deltaY) < 40;
  
  if (isTrackpadPinch) {
    // For trackpad pinch, use a smoother zoom factor
    const zoomFactor = 1 + delta * 0.1;
    
    // Apply zoom by moving camera closer or further
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    
    gsap.to(camera.position, {
      x: camera.position.x - cameraDirection.x * delta * 0.5,
      y: camera.position.y - cameraDirection.y * delta * 0.5,
      z: camera.position.z - cameraDirection.z * delta * 0.5,
      duration: 0.2,
      ease: "power1.out",
      onUpdate: () => {
        // Ensure we don't go beyond limits
        const distance = camera.position.length();
        if (distance < controls.minDistance || distance > controls.maxDistance) {
          const direction = camera.position.clone().normalize();
          const clampedDistance = THREE.MathUtils.clamp(
            distance, 
            controls.minDistance, 
            controls.maxDistance
          );
          camera.position.copy(direction.multiplyScalar(clampedDistance));
        }
      }
    });
  }
  
  // Let OrbitControls also handle the event
  // (it has internal handling for wheel events)
};

// Handle touch start events
const onTouchStart = (event) => {
  // Prevent default to avoid scrolling the page
  event.preventDefault();
  
  touchStartTime = Date.now();
  isTouching = true;
  
  // Store touch position for later use
  if (event.touches.length === 1) {
    touchStartPosition.x = event.touches[0].clientX;
    touchStartPosition.y = event.touches[0].clientY;
    
    // Convert touch position to normalized device coordinates
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((touchStartPosition.x - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((touchStartPosition.y - rect.top) / rect.height) * 2 + 1;
    
    // Check for marker intersections
    checkIntersections();
  }
};

// Handle touch move events 
const onTouchMove = (event) => {
  // Prevent default to avoid scrolling the page
  event.preventDefault();
  
  if (!isTouching) return;
  
  // Store current touch position
  if (event.touches.length === 1) {
    touchMovePosition.x = event.touches[0].clientX;
    touchMovePosition.y = event.touches[0].clientY;
    
    // Convert touch position to normalized device coordinates
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((touchMovePosition.x - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((touchMovePosition.y - rect.top) / rect.height) * 2 + 1;
    
    // Update marker hover effects
    checkIntersections();
  }
};

// Handle touch end events
const onTouchEnd = (event) => {
  // Check if this was a tap (short touch)
  const touchDuration = Date.now() - touchStartTime;
  
  // If it was a short tap and not a drag/pan action
  if (touchDuration < 300 && 
      Math.abs(touchMovePosition.x - touchStartPosition.x) < 10 &&
      Math.abs(touchMovePosition.y - touchStartPosition.y) < 10) {
    
    // Simulate a click at the touch position
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(markers, true);
    
    if (intersects.length > 0) {
      // Process the tap as a click
      let markerGroup = intersects[0].object;
      while (markerGroup.parent && !markers.includes(markerGroup)) {
        markerGroup = markerGroup.parent;
      }
      
      if (markers.includes(markerGroup)) {
        const { label, latitude, longitude, isSpecialLocation } = markerGroup.userData;
        
        // Animate to the tapped location
        gsap.to(controls.target, {
          x: markerGroup.position.x * 0.8,
          y: markerGroup.position.y * 0.8,
          z: markerGroup.position.z * 0.8,
          duration: isSpecialLocation ? 1.5 : 1,
          ease: isSpecialLocation ? "elastic.out(1, 0.8)" : "power2.out",
          onUpdate: () => {
            controls.update();
          }
        });
        
        // For special locations, also zoom in a bit closer
        if (isSpecialLocation) {
          gsap.to(camera.position, {
            x: camera.position.x * 0.8,
            y: camera.position.y * 0.8,
            z: camera.position.z * 0.8,
            duration: 1.5,
            ease: "elastic.out(1, 0.8)",
            onUpdate: () => {
              camera.lookAt(controls.target);
            }
          });
        }
        
        // Temporarily disable auto-rotation
        const wasAutoRotating = controls.autoRotate;
        controls.autoRotate = false;
        
        // Resume auto-rotation after delay
        setTimeout(() => {
          controls.autoRotate = wasAutoRotating;
          
          // For special locations, smoothly return to normal zoom level
          if (isSpecialLocation) {
            gsap.to(camera.position, {
              x: camera.position.x / 0.8,
              y: camera.position.y / 0.8,
              z: camera.position.z / 0.8,
              duration: 2,
              ease: "power2.inOut",
              onUpdate: () => {
                camera.lookAt(controls.target);
              }
            });
          }
        }, isSpecialLocation ? 6000 : 4000);
      }
    }
  }
  
  isTouching = false;
};

const cleanUp = () => {
  if (!isInitialized) return;
  
  window.removeEventListener('resize', onWindowResize);
  container.value.removeEventListener('mousemove', onMouseMove);
  container.value.removeEventListener('click', onMouseClick);
  container.value.removeEventListener('wheel', onWheel, { passive: false });
  container.value.removeEventListener('touchstart', onTouchStart, { passive: false });
  container.value.removeEventListener('touchmove', onTouchMove, { passive: false });
  container.value.removeEventListener('touchend', onTouchEnd);
  
  // Clear all intervals and animations
  const highestTimeoutId = setTimeout(";");
  for (let i = 0; i < highestTimeoutId; i++) {
    clearTimeout(i);
  }
  
  // Dispose of resources
  if (renderer) {
    if (container.value) {
      container.value.removeChild(renderer.domElement);
    }
    renderer.dispose();
  }
  
  if (controls) {
    controls.dispose();
  }
  
  // Dispose of all scene objects
  if (scene) {
    scene.traverse(object => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  }
  
  // Clear all references
  scene = null;
  camera = null;
  renderer = null;
  controls = null;
  globe = null;
  atmosphere = null;
  clouds = null;
  raycaster = null;
  mouse = null;
  markers = [];
  isInitialized = false;
};

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  cleanUp();
});
</script>

<style scoped>
.relative {
  position: relative;
}
.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}
</style> 