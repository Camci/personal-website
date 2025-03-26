<template>
  <div class="model-customizer-container">
    <div class="flex flex-col md:flex-row w-full">
      <div class="md:w-3/4 relative">
        <!-- 3D Model Viewer -->
        <div ref="canvasContainer" class="w-full aspect-square bg-gray-900 rounded-lg">
          <!-- Viewpoint Controls -->
          <div class="absolute top-4 left-4 right-4 flex justify-center gap-4">
            <button @click="showFrontView" class="px-4 py-2 bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/40 transition">
              Front
            </button>
            <button @click="showSideView" class="px-4 py-2 bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/40 transition">
              Side
            </button>
            <button @click="showBackView" class="px-4 py-2 bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/40 transition">
              Back
            </button>
          </div>
          
          <!-- Camera Controls -->
          <div class="absolute bottom-4 left-4 right-4 flex justify-center gap-4 z-50">
            <button @click="resetCamera" class="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
            </button>
            <button @click="zoomIn" class="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
            </button>
            <button @click="zoomOut" class="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
            <!-- Debug Toggle Button -->
            <button @click="toggleDebugMode" class="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition text-white" :class="{ 'bg-yellow-500/30': showDebugInfo }">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Loading Overlay -->
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-lg">
          <div class="text-center">
            <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
            <p class="text-lg font-medium mb-4">Loading Model... {{ loadingProgress }}%</p>
            <div class="bg-white/10 backdrop-blur-sm p-4 rounded-lg max-w-md mx-auto">
              <p class="text-sm text-gray-200 italic">"{{ currentFact }}"</p>
              <p class="text-xs text-gray-400 mt-2">Did you know?</p>
            </div>
          </div>
        </div>
        
        <!-- Save Progress Overlay -->
        <div v-if="isSaving" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div class="text-center p-8 max-w-2xl">
            <div class="w-24 h-24 border-8 border-blue-600 border-t-transparent rounded-full animate-spin mb-8 mx-auto"></div>
            <h2 class="text-2xl font-bold text-white mb-4">Processing Your Model</h2>
            <div class="w-full bg-gray-700 rounded-full h-4 mb-8">
              <div class="bg-blue-600 h-4 rounded-full transition-all duration-500" :style="{ width: `${saveProgress}%` }"></div>
            </div>
            <p class="text-white text-lg mb-4">{{ saveProgress }}% Complete</p>
            <div class="bg-white/10 backdrop-blur-sm p-6 rounded-lg max-w-xl mx-auto">
              <p class="text-lg text-white italic mb-2">"{{ currentSavingFact }}"</p>
              <p class="text-sm text-gray-300">Did you know?</p>
            </div>
          </div>
        </div>
        
        <!-- Error Message -->
        <div v-if="loadingError && !model" class="absolute inset-0 flex items-center justify-center bg-red-900/60 rounded-lg">
          <div class="text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 3A9 9 0 0 0 3 12a9 9 0 0 0 18 0 9 9 0 0 0-9-9z" />
            </svg>
            <p class="text-lg font-medium mb-2">{{ loadingError }}</p>
            <button @click="loadModel" class="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700">Retry</button>
          </div>
        </div>
        
        <!-- Debug Info Panel -->
        <div v-if="showDebugInfo" class="absolute top-0 right-0 p-4 bg-black/80 text-xs text-white max-w-xs max-h-96 overflow-auto">
          <h4 class="font-bold mb-2">Debug Info</h4>
          <div>
            <p>Model: Character</p>
            <p>Parts: {{ parts.length }}</p>
            <ul class="list-disc pl-4 mb-2">
              <li v-for="(part, index) in parts" :key="index" 
                  :class="{'font-bold text-blue-400': part === selectedPart}"
                  @click="selectedPart = part" 
                  class="cursor-pointer hover:text-blue-300">
                {{ part }}
              </li>
            </ul>
            <p>Selected Part: {{ selectedPart }}</p>
            <p>Camera Position: {{ JSON.stringify(camera?.position.toArray().map(n => n.toFixed(2))) }}</p>
            <p>Camera Target: {{ JSON.stringify(controls?.target.toArray().map(n => n.toFixed(2))) }}</p>
            <p>Model Position: {{ model ? JSON.stringify(model.position.toArray().map(n => n.toFixed(2))) : 'No model' }}</p>
            <p>Model Rotation: {{ model ? `X=${model.rotation.x.toFixed(2)}, Y=${model.rotation.y.toFixed(2)}, Z=${model.rotation.z.toFixed(2)}` : 'No model' }}</p>
            
            <div class="mt-2">
              <button @click="fixModelVisibility" class="bg-blue-500 text-white px-2 py-1 rounded text-xs mb-1 w-full">
                Fix Model Visibility
              </button>
              <button @click="resetModelRotation" class="bg-blue-500 text-white px-2 py-1 rounded text-xs mb-1 w-full">
                Reset Rotation
              </button>
              <button @click="findModelCenter" class="bg-blue-500 text-white px-2 py-1 rounded text-xs w-full">
                Find Center
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="md:w-1/4 p-4">
        <h2 class="text-xl font-bold mb-4">Customize Your Model</h2>
        
        <!-- Color Options -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Colors</h3>
          <div class="grid grid-cols-5 gap-2">
            <div
              v-for="(color, index) in colorOptions"
              :key="index"
              :style="color === 'Keep Original' ? 
                { background: 'linear-gradient(135deg, #fff 0%, #ccc 100%)', border: '2px dashed #888' } : 
                { backgroundColor: color }"
              class="w-8 h-8 rounded-full cursor-pointer border-2 flex items-center justify-center"
              :class="{ 'border-blue-500': selectedColor === color, 'border-transparent': selectedColor !== color }"
              @click="changeColor(color)"
            >
              <span v-if="color === 'Keep Original'" class="text-xs font-bold text-gray-700">Orig</span>
            </div>
          </div>
        </div>
        
        <!-- Material Options -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Fabric</h3>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="(material, index) in materialOptions"
              :key="index"
              class="p-3 text-center bg-gray-800 rounded-md cursor-pointer flex flex-col items-center"
              :class="{ 'ring-2 ring-blue-500': selectedMaterial === material }"
              @click="changeMaterial(material)"
            >
              <span class="text-sm font-medium">{{ material }}</span>
              <span class="text-xs text-gray-400 mt-1">
                {{ getMaterialDescription(material) }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Part Selector -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Customize Part</h3>
          <select v-model="selectedPart" class="w-full p-2 bg-gray-800 rounded-md">
            <option v-for="part in parts" :key="part" :value="part">{{ part }}</option>
          </select>
        </div>
        
        <button @click="saveConfiguration" class="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mb-6">
          Save & Download Model
        </button>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import sherlockHolmesUrl from '../assets/models/sherlock_holmes.glb?url';

// Component refs
const canvasContainer = ref(null);

// 3D objects and scene
let scene, camera, renderer, controls, model;
let mixer, clock;

// Model parts and materials map
const partMaterials = ref({});
const partsMap = ref({});

// UI State
const selectedColor = ref('#333333');
const selectedMaterial = ref('Cotton');
const selectedPart = ref('');
const parts = ref([]);
const isLoading = ref(true);
const loadingProgress = ref(0);
const loadingError = ref(null);
const showDebugInfo = ref(false); // Debug mode toggle

// Customization options
const colorOptions = ref([
  'Keep Original', // Added Keep Original option
  // Classic suit colors
  '#000000', // Black
  '#222222', // Dark Gray
  '#333333', // Charcoal
  '#444444', // Gray
  '#0A2136', // Navy Blue
  '#1A1110', // Dark Brown
  '#4B3619', // Brown
  '#191C14', // Forest Green
  '#361F1E', // Burgundy
  '#FFFFFF', // White
  // Accent colors
  '#9C0D0F', // Red
  '#122E94', // Royal Blue
  '#114321', // Dark Green
  '#6D3615', // Rust
  '#4C4A48'  // Taupe
]);
const materialOptions = ref(['Cotton', 'Wool', 'Linen', 'Silk', 'Velvet', 'Leather']);

// Update model selections to only include the Sherlock Holmes model
const availableModels = ref([
  { id: 'sherlock', name: 'Sherlock Holmes', url: sherlockHolmesUrl, type: 'glb' }
]);
const selectedModel = ref('sherlock');

// Add new refs for engraving
const engravingText = ref('');
const engravingStyle = ref('none');
const engravingColor = ref('#000000');
const isSaving = ref(false);
const saveProgress = ref(0);

// Add facts array
const facts = [
  "Sherlock Holmes' iconic deerstalker hat was never actually mentioned in the original stories!",
  "The first Sherlock Holmes story was published in 1887 in 'Beeton's Christmas Annual'.",
  "Sir Arthur Conan Doyle was inspired by Dr. Joseph Bell, his medical school professor, for Holmes' character.",
  "The famous phrase 'Elementary, my dear Watson' never appears in any of the original stories.",
  "Sherlock Holmes' address, 221B Baker Street, was a fictional address until 1990.",
  "The first Sherlock Holmes film was made in 1900, just 13 years after the first story was published.",
  "Sherlock Holmes is the most portrayed literary human character in film and TV history.",
  "The character of Sherlock Holmes has appeared in over 250 films and TV shows.",
  "The original stories were published in The Strand Magazine, which saw its circulation increase by 30,000 copies.",
  "Sherlock Holmes' pipe was originally described as a 'black clay pipe' in the stories."
];

const currentFact = ref(facts[0]);

// Function to update fact
const updateFact = () => {
  const currentIndex = facts.indexOf(currentFact.value);
  const nextIndex = (currentIndex + 1) % facts.length;
  currentFact.value = facts[nextIndex];
};

// Start fact rotation
let factInterval;
onMounted(() => {
  initScene();
  factInterval = setInterval(updateFact, 5000);
});

onBeforeUnmount(() => {
  // Clean up resources
  window.removeEventListener('resize', onResize);
  
  if (renderer) {
    renderer.dispose();
    canvasContainer.value?.removeChild(renderer.domElement);
  }
  
  // Dispose of materials and geometries
  if (model) {
    model.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
        if (child.material.dispose) {
          child.material.dispose();
        }
      }
    });
  }
  
  // Clear references
  scene = null;
  camera = null;
  renderer = null;
  controls = null;
  model = null;
  mixer = null;
  clock = null;
  
  if (factInterval) clearInterval(factInterval);
});

// Initialize ThreeJS scene
const initScene = () => {
  if (!canvasContainer.value) return;
  
  // Create scene, camera, renderer
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Add point lights for better highlights
  const pointLight1 = new THREE.PointLight(0xffffff, 1);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(0xffffff, 0.8);
  pointLight2.position.set(-10, -10, -10);
  scene.add(pointLight2);
  
  // Setup camera
  const container = canvasContainer.value;
  const aspect = container.clientWidth / container.clientHeight;
  camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
  camera.position.set(-.12, 0, -2.64);
  
  // Setup renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);
  
  // Setup controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // Initialize clock for animations
  clock = new THREE.Clock();
  
  // Load 3D model
  loadModel();

  // Handle window resize
  window.addEventListener('resize', onResize);
  
  // Start animation loop
  animate();
};

// Load the 3D model
const loadModel = () => {
  isLoading.value = true;
  loadingError.value = null;
  
  // Get the selected model URL and type
  const selectedModelData = availableModels.value.find(m => m.id === selectedModel.value);
  if (!selectedModelData) {
    loadingError.value = 'Invalid model selection';
    isLoading.value = false;
    return;
  }
  
  const modelToLoad = selectedModelData.url;
  const modelType = selectedModelData.type;
  
  // Add loading manager for tracking progress
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    loadingProgress.value = Math.floor((itemsLoaded / itemsTotal) * 100);
    console.log(`Loading: ${loadingProgress.value}%`);
  };
  
  loadingManager.onError = (url) => {
    console.error('Error loading resource:', url);
    loadingError.value = `Failed to load resource: ${url}`;
    isLoading.value = false;
    createPlaceholderModel();
  };
  
  if (modelType === 'fbx') {
    // Use FBX loader
    const loader = new FBXLoader(loadingManager);
    
    loader.load(modelToLoad, 
      // onLoad callback
      (fbx) => {
        console.log('FBX Model loaded successfully:', fbx);
        model = fbx;
        
        // Process the loaded model
        processLoadedModel(model);
      },
      // onProgress callback
      (xhr) => {
        if (xhr.lengthComputable) {
          const progress = Math.floor((xhr.loaded / xhr.total) * 100);
          loadingProgress.value = progress;
          console.log(`Loading FBX: ${progress}%`);
        }
      },
      // onError callback
      (error) => {
        console.error('Error loading FBX model:', error);
        loadingError.value = 'Failed to load the FBX model. Using placeholder instead.';
        isLoading.value = false;
        createPlaceholderModel();
      }
    );
  } else {
    // Use GLTF loader for GLB files (default)
    const loader = new GLTFLoader(loadingManager);
    
    loader.load(modelToLoad, 
      // onLoad callback
      (gltf) => {
        console.log('GLB Model loaded successfully:', gltf);
        model = gltf.scene;
        
        // Process the loaded model
        processLoadedModel(model);
      },
      // onProgress callback
      (xhr) => {
        if (xhr.lengthComputable) {
          const progress = Math.floor((xhr.loaded / xhr.total) * 100);
          loadingProgress.value = progress;
          console.log(`Loading GLB: ${progress}%`);
        }
      },
      // onError callback
      (error) => {
        console.error('Error loading GLB model:', error);
        loadingError.value = 'Failed to load the 3D model. Using placeholder instead.';
        isLoading.value = false;
        createPlaceholderModel();
      }
    );
  }
};

// Process the loaded model
const processLoadedModel = (model) => {
  // Ensure all materials are visible and correctly set up
  model.traverse((child) => {
    if (child.isMesh) {
      // Print the mesh name for debugging
      console.log('Processing mesh:', child.name);
      
      // Clone materials to ensure they're unique
      if (child.material) {
        child.material = child.material.clone();
        
        // Make sure material is visible and not transparent
        child.material.transparent = false;
        child.material.opacity = 1.0;
        child.material.alphaTest = 0;
        child.material.side = THREE.DoubleSide; // Render both sides of faces
      }
      
      // Make sure mesh is visible
      child.visible = true;
      child.frustumCulled = false; // Prevent culling even if outside camera view
    }
  });
  
  // Center and scale the model
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  
  console.log('Model dimensions:', size);
  console.log('Model center:', center);
  
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 1.5 / maxDim;
  model.scale.set(scale, scale, scale);
  
  // Adjust model position
  model.position.x = -center.x * scale;
  model.position.y = -center.y * scale;
  model.position.z = -center.z * scale;
  
  // Apply rotation for the Sherlock Holmes model if needed
  model.rotation.y = Math.PI; // Face the model towards the camera
  
  scene.add(model);
  
  // Extract customizable parts
  extractParts();
  
  // Reset view to get a good initial perspective
  resetModelView();
  
  // Add additional lights to help see all parts
  const frontLight = new THREE.DirectionalLight(0xffffff, 1);
  frontLight.position.set(0, 0, 5);
  scene.add(frontLight);
  
  const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
  backLight.position.set(0, 0, -5);
  scene.add(backLight);
  
  isLoading.value = false;
};

// Create a placeholder model if the real model fails to load
const createPlaceholderModel = () => {
  // Create a group to hold our placeholder model
  model = new THREE.Group();
  
  // Create a simple suit placeholder with basic shapes
  // Body/Jacket
  const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.3, 1.5, 8);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.name = "Jacket";
  body.position.y = 0;
  model.add(body);
  
  // Shoulders
  const shoulderGeometry = new THREE.SphereGeometry(0.25, 16, 16);
  const shoulderMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  
  const leftShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
  leftShoulder.name = "Left Shoulder";
  leftShoulder.position.set(-0.4, 0.5, 0);
  model.add(leftShoulder);
  
  const rightShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
  rightShoulder.name = "Right Shoulder";
  rightShoulder.position.set(0.4, 0.5, 0);
  model.add(rightShoulder);
  
  // Arms
  const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
  const armMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  leftArm.name = "Left Sleeve";
  leftArm.position.set(-0.6, 0.1, 0);
  leftArm.rotation.z = Math.PI / 6;
  model.add(leftArm);
  
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  rightArm.name = "Right Sleeve";
  rightArm.position.set(0.6, 0.1, 0);
  rightArm.rotation.z = -Math.PI / 6;
  model.add(rightArm);
  
  // Legs/Pants
  const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 8);
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  
  const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
  leftLeg.name = "Left Pant";
  leftLeg.position.set(-0.2, -1, 0);
  model.add(leftLeg);
  
  const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
  rightLeg.name = "Right Pant";
  rightLeg.position.set(0.2, -1, 0);
  model.add(rightLeg);
  
  // Hat
  const hatGeometry = new THREE.CylinderGeometry(0.25, 0.3, 0.2, 16);
  const hatMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const hat = new THREE.Mesh(hatGeometry, hatMaterial);
  hat.name = "Hat";
  hat.position.y = 1.1;
  model.add(hat);
  
  // Head
  const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0xE0C8A0 });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.name = "Head";
  head.position.y = 0.9;
  model.add(head);
  
  // Position and add to scene
  model.position.y = 0;
  scene.add(model);
  
  // Extract customizable parts
  extractParts();
};

// Extract model parts for customization
const extractParts = () => {
  if (!model) return;
  
  // Clear previous parts map
  Object.keys(partsMap.value).forEach(key => delete partsMap.value[key]);
  
  // Debug: log the model structure to see part names
  console.log('Model structure:', model);
  
  // Map of object numbers to friendly names
  const partNameMap = {
    'Object_4': 'Cloak',
    'Object_5': 'Stain on the cloak',
    'Object_7': 'Hat',
    'Object_9': 'Vest',
    'Object_13': 'Inside Sweater',
    'Object_15': 'Shirt (under the sweater)',
    'Object_19': 'Pant',
    'Object_21': 'Buttoned Vest',
    'Object_23': 'Vest Buttons'
  };
  
  model.traverse((child) => {
    if (child.isMesh) {
      const originalName = child.name;
      const friendlyName = partNameMap[originalName] || originalName;
      
      // Skip objects 11 and 17 as they don't change anything
      if (originalName === 'Object_11' || originalName === 'Object_17') {
        return;
      }
      
      // Store the mesh with its friendly name as the key
      partsMap.value[friendlyName] = child;
      
      // Log the mapping for debugging
      console.log(`Mapped ${originalName} to ${friendlyName}`);
      
      // Store original material for reference
      if (child.material) {
        child.material = child.material.clone();
        partMaterials.value[friendlyName] = child.material.clone();
      }
    }
  });
  
  // Update parts list
  parts.value = Object.keys(partsMap.value);
  
  // Log the extracted parts
  console.log('Extracted parts:', parts.value);
  
  if (parts.value.length > 0) {
    selectedPart.value = parts.value[0];
  }
};

// Helper function to create a shader-based regional material
const createRegionalMaterial = (mesh, region, newMaterial) => {
  if (!mesh || !mesh.geometry) return;
  
  // This is a simplified approach - in a production app, you would use
  // a more sophisticated shader-based approach or mesh segmentation
  
  // For FBX/GLB models that don't have sub-meshes, we'll fake it by creating
  // a special material that applies colors differently based on vertex position
  
  // Get the bounding box to determine height regions
  const bbox = new THREE.Box3().setFromObject(mesh);
  const size = bbox.getSize(new THREE.Vector3());
  const center = bbox.getCenter(new THREE.Vector3());
  
  // Clone the vertices to avoid affecting other instances
  const positions = mesh.geometry.attributes.position.array;
  
  // Find min/max Y to divide into regions
  const minY = bbox.min.y;
  const maxY = bbox.max.y;
  const range = maxY - minY;
  
  // Define region boundaries
  const upperThreshold = minY + (range * 2/3);
  const lowerThreshold = minY + (range * 1/3);
  
  // We'll use vertex colors to "mask" the regions
  if (!mesh.geometry.attributes.color) {
    // If no color attribute exists, create one
    const colors = new Float32Array(positions.length);
    mesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }
  
  const colors = mesh.geometry.attributes.color.array;
  
  // Set vertex colors based on region
  // Red for upper, green for middle, blue for lower
  for (let i = 0; i < positions.length; i += 3) {
    const y = positions[i + 1]; // Y coordinate
    
    if (region === 'upper' && y > upperThreshold) {
      // Apply new color to upper region
      colors[i] = newMaterial.color.r;
      colors[i + 1] = newMaterial.color.g;
      colors[i + 2] = newMaterial.color.b;
    } else if (region === 'middle' && y <= upperThreshold && y >= lowerThreshold) {
      // Apply new color to middle region
      colors[i] = newMaterial.color.r;
      colors[i + 1] = newMaterial.color.g;
      colors[i + 2] = newMaterial.color.b;
    } else if (region === 'lower' && y < lowerThreshold) {
      // Apply new color to lower region
      colors[i] = newMaterial.color.r;
      colors[i + 1] = newMaterial.color.g;
      colors[i + 2] = newMaterial.color.b;
    }
  }
  
  // Mark that we need to update this
  mesh.geometry.attributes.color.needsUpdate = true;
  
  // Make sure the material uses vertex colors
  if (!mesh.material.vertexColors) {
    // Create a new material that uses vertex colors
    const vertexColorMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: newMaterial.roughness,
      metalness: newMaterial.metalness
    });
    mesh.material = vertexColorMaterial;
  }
};

// Animation loop
const animate = () => {
  if (!scene || !camera || !renderer) return;
  
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  
  controls.update();
  renderer.render(scene, camera);
  
  requestAnimationFrame(animate);
};

// Handle window resize
const onResize = () => {
  if (!camera || !renderer || !canvasContainer.value) return;
  
  const container = canvasContainer.value;
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
};

// Control functions
const resetCamera = () => {
  if (!controls) return;
  controls.reset();
};

const zoomIn = () => {
  if (!camera) return;
  camera.position.multiplyScalar(0.9);
};

const zoomOut = () => {
  if (!camera) return;
  camera.position.multiplyScalar(1.1);
};

// View animation functions
const animateCameraTo = (targetPosition, targetLookat, duration = 1000) => {
  if (!camera || !controls) return;
  
  const startPosition = camera.position.clone();
  const startTime = Date.now();
  
  const animate = () => {
    const now = Date.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-in-out function
    const easeProgress = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    // Interpolate camera position
    camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
    
    // Update controls target
    if (targetLookat) {
      controls.target.lerp(targetLookat, easeProgress);
    }
    
    controls.update();
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  animate();
};

const showBackView = () => {
  if (!model) return;
  animateCameraTo(new THREE.Vector3(0, 0, 2), new THREE.Vector3(0, 0, 0));
};

const showSideView = () => {
  if (!model) return;
  animateCameraTo(new THREE.Vector3(2, 0, 0), new THREE.Vector3(0, 0, 0));
};

const showFrontView = () => {
  if (!model) return;
  animateCameraTo(new THREE.Vector3(0, 0, -2), new THREE.Vector3(0, 0, 0));
};

// Customization functions
const changeColor = (color) => {
  selectedColor.value = color;
  
  if (color === 'Keep Original') {
    // Restore the original material for the selected part
    if (selectedPart.value && partMaterials.value[selectedPart.value]) {
      const selectedMesh = partsMap.value[selectedPart.value];
      if (selectedMesh) {
        selectedMesh.material = partMaterials.value[selectedPart.value].clone();
        console.log('Restored original material for:', selectedPart.value);
      }
    }
  } else {
    updateSelectedPartMaterial();
  }
};

const changeMaterial = (material) => {
  selectedMaterial.value = material;
  updateSelectedPartMaterial();
};

// Update material based on selected options
const updateSelectedPartMaterial = () => {
  if (!model || !selectedPart.value) return;
  
  console.log('Updating material for:', selectedPart.value);
  
  const color = new THREE.Color(selectedColor.value);
  
  // Get the mesh object for the selected part using the friendly name
  const selectedMesh = partsMap.value[selectedPart.value];
  
  if (!selectedMesh) {
    console.error('Could not find mesh for selected part:', selectedPart.value);
    console.log('Available parts:', Object.keys(partsMap.value));
    return;
  }
  
  console.log('Found mesh for selected part:', selectedMesh.name);
  
  // Create a new material based on the selected type
  let newMaterial;
  
  switch (selectedMaterial.value) {
    case 'Wool':
      newMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0.0,
        bumpScale: 0.02
      });
      break;
    case 'Linen':
      newMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.6,
        metalness: 0.0,
        bumpScale: 0.01
      });
      break;
    case 'Silk':
      newMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.1
      });
      break;
    case 'Velvet':
      newMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
        metalness: 0.0
      });
      break;
    case 'Leather':
      newMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5,
        metalness: 0.1,
        bumpScale: 0.05
      });
      break;
    case 'Cotton':
    default:
      newMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5,
        metalness: 0.0
      });
      break;
  }
  
  // Apply the new material directly to the selected mesh
  selectedMesh.material = newMaterial;
  
  // Log the material change
  console.log('Applied material to part:', selectedPart.value, color.getHexString(), selectedMaterial.value);
};

// Get material description
const getMaterialDescription = (material) => {
  switch(material) {
    case 'Cotton':
      return 'Casual, durable';
    case 'Wool':
      return 'Warm, textured';
    case 'Linen':
      return 'Light, breathable';
    case 'Silk':
      return 'Smooth, elegant';
    case 'Velvet':
      return 'Rich, luxurious';
    case 'Leather':
      return 'Tough, classic';
    default:
      return '';
  }
};

// Add initial camera positioning after model load
const resetModelView = () => {
  if (!camera || !controls) return;
  
  // Position camera for the Sherlock Holmes model
  camera.position.set(-.12, 0, -2.64);
  controls.target.set(0, 0, 0);
  
  controls.update();
};

// Debug helpers
const toggleDebugMode = () => {
  showDebugInfo.value = !showDebugInfo.value;
  
  if (showDebugInfo.value) {
    // Add debug visualization
    addDebugHelpers();
  } else {
    // Remove debug visualization
    removeDebugHelpers();
  }
};

let debugHelpers = [];

const addDebugHelpers = () => {
  if (!scene || !model) return;
  
  // Remove existing helpers first
  removeDebugHelpers();
  
  // Add axes helper
  const axesHelper = new THREE.AxesHelper(2);
  scene.add(axesHelper);
  debugHelpers.push(axesHelper);
  
  // Add a grid helper
  const gridHelper = new THREE.GridHelper(10, 10);
  scene.add(gridHelper);
  debugHelpers.push(gridHelper);
  
  // Add bounding box for the model
  model.traverse((child) => {
    if (child.isMesh) {
      const boxHelper = new THREE.BoxHelper(child, 0xffff00);
      scene.add(boxHelper);
      debugHelpers.push(boxHelper);
    }
  });
  
  // Log model details
  console.log('Model hierarchy:', model);
};

const removeDebugHelpers = () => {
  if (!scene) return;
  
  debugHelpers.forEach(helper => {
    scene.remove(helper);
  });
  
  debugHelpers = [];
};

// Add a rotation function
const rotateModel = (axis, angle) => {
  if (!model) return;
  
  switch(axis) {
    case 'x':
      model.rotation.x += angle;
      break;
    case 'y':
      model.rotation.y += angle;
      break;
    case 'z':
      model.rotation.z += angle;
      break;
  }
  
  // Log the new rotation for debugging
  console.log(`Model rotation: X=${model.rotation.x.toFixed(2)}, Y=${model.rotation.y.toFixed(2)}, Z=${model.rotation.z.toFixed(2)}`);
};

// Add additional debug functions
const fixModelVisibility = () => {
  if (!model) return;
  
  model.traverse((child) => {
    if (child.isMesh) {
      // Make sure mesh is visible
      child.visible = true;
      child.frustumCulled = false;
      
      // Fix material if it exists
      if (child.material) {
        child.material.transparent = false;
        child.material.opacity = 1.0;
        child.material.alphaTest = 0;
        child.material.side = THREE.DoubleSide;
        child.material.needsUpdate = true;
      }
      
      console.log(`Made visible: ${child.name}`);
    }
  });
};

const resetModelRotation = () => {
  if (!model) return;
  
  model.rotation.set(0, 0, 0);
  console.log('Reset model rotation');
};

const findModelCenter = () => {
  if (!model) return;
  
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  
  console.log('Model center:', center);
  console.log('Model size:', size);
  
  // Create a visual marker at the center
  const sphereGeometry = new THREE.SphereGeometry(0.05, 16, 16);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const centerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  centerSphere.position.copy(center);
  scene.add(centerSphere);
  debugHelpers.push(centerSphere);
};

// Add new facts array for saving process
const savingFacts = [
  "The first 3D model of Sherlock Holmes was created in 1992 for the video game 'Sherlock Holmes: Consulting Detective'.",
  "3D modeling technology has evolved from wireframe models in the 1960s to today's photorealistic digital sculptures.",
  "The process of creating a 3D model can involve up to 100,000 polygons for detailed characters like Sherlock Holmes.",
  "The first computer-generated 3D character in a feature film was the stained glass knight in 'Young Sherlock Holmes' (1985).",
  "Modern 3D modeling software can process over 1 million polygons in real-time, allowing for incredibly detailed models.",
  "The process of 'UV mapping' (texturing) a 3D model is similar to how a tailor creates patterns for clothing.",
  "3D models like our Sherlock Holmes character can be exported in multiple formats, each optimized for different uses.",
  "The first 3D printing of a Sherlock Holmes bust was created in 2014, marking a new era in physical model creation.",
  "Real-time 3D rendering technology allows us to see changes to the model instantly, just like a digital sculptor.",
  "The process of 'rigging' a 3D model (adding a skeleton) is similar to how puppeteers control their marionettes."
];

// Add new ref for saving fact
const currentSavingFact = ref(savingFacts[0]);

// Function to update saving fact
const updateSavingFact = () => {
  const currentIndex = savingFacts.indexOf(currentSavingFact.value);
  const nextIndex = (currentIndex + 1) % savingFacts.length;
  currentSavingFact.value = savingFacts[nextIndex];
};

// Update the saveConfiguration function
const saveConfiguration = () => {
  if (!model) return;
  
  // Show loading state immediately
  isSaving.value = true;
  saveProgress.value = 0;
  
  // Start rotating facts
  const factInterval = setInterval(updateSavingFact, 5000);
  
  // Add a delay before starting the export process
  setTimeout(() => {
    // Create a new scene for export
    const exportScene = new THREE.Scene();
    exportScene.add(model.clone());
    
    // Create exporter
    const exporter = new GLTFExporter();
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      if (saveProgress.value < 90) {
        saveProgress.value += 10;
      }
    }, 500);
    
    // Export the model
    exporter.parse(exportScene, (gltf) => {
      clearInterval(progressInterval);
      clearInterval(factInterval);
      saveProgress.value = 100;
      
      // Convert to JSON string
      const jsonString = JSON.stringify(gltf);
      
      // Create a blob and download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = 'customized_sherlock_holmes.gltf';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Reset saving state after a delay
      setTimeout(() => {
        isSaving.value = false;
        saveProgress.value = 0;
        alert('Your customized model has been saved! You can find it in your downloads folder.');
      }, 1000);
    }, (error) => {
      clearInterval(progressInterval);
      clearInterval(factInterval);
      isSaving.value = false;
      saveProgress.value = 0;
      console.error('Error exporting model:', error);
      alert('There was an error saving your model. Please try again.');
    });
  }, 500); // 500ms delay before starting the export process
};

// Watch for part changes to handle engraving
watch(selectedPart, (newPart, oldPart) => {
  console.log(`Selected part changed from "${oldPart}" to "${newPart}"`);
  
  // Update the material for the newly selected part
  updateSelectedPartMaterial();
});
</script>

<style scoped>
.model-customizer-container {
  margin: 0 auto;
  max-width: 1200px;
}
</style> 