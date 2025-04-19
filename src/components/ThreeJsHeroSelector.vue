<template>
  <div>
    <!-- Selected ThreeJs Hero component will be rendered -->
    <component :is="selectedHero" />

    <!-- Controls to switch between hero types (fixed at the bottom right) -->
    <div class="fixed bottom-4 right-4 z-50 bg-white/30 backdrop-blur-md p-2 rounded-lg shadow-lg">
      <div class="flex space-x-2">
        <button
          v-for="(hero, index) in displayedHeroes"
          :key="hero.name"
          @click="selectHero(hero.originalIndex)"
          class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          :class="selectedIndex === hero.originalIndex ? 'bg-primary text-white' : 'bg-white/50 text-secondary hover:bg-white/80'"
          :title="hero.name"
        >
          <i :class="hero.icon"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import ThreeJsHero from './ThreeJsHero.vue';
import ThreeJsWavesHero from './ThreeJsWavesHero.vue';
import ThreeJsGlobeHero from './ThreeJsGlobeHero.vue';
import { useRoute } from 'vue-router';

// Define emits
const emit = defineEmits(['hero-changed']);

// Get the current route
const route = useRoute();

// We always start with ThreeJsHero now, regardless of entry path

// Define available heroes with original order (desktop)
const heroes = [
  {
    component: ThreeJsGlobeHero,
    name: 'Globe',
    icon: 'fas fa-globe',
    originalIndex: 0
  },
  {
    component: ThreeJsHero,
    name: 'Particles',
    icon: 'fas fa-star',
    originalIndex: 1
  },
  {
    component: ThreeJsWavesHero,
    name: 'Waves',
    icon: 'fas fa-water',
    originalIndex: 2
  },
];

// Track if we're on mobile
const isMobile = ref(window.innerWidth < 768);

// Track previous device type to detect changes
const wasMobile = ref(false);

// Update isMobile when window size changes
const updateDeviceType = () => {
  wasMobile.value = isMobile.value;
  isMobile.value = window.innerWidth < 768;

  // We no longer automatically switch heroes based on device type
  // Users can still manually select their preferred hero
};

// Computed property for heroes in the correct order based on device
const displayedHeroes = computed(() => {
  if (isMobile.value) {
    // Mobile order: Particles, Globe, Waves
    return [
      { ...heroes[1], originalIndex: 1 }, // Particles
      { ...heroes[0], originalIndex: 0 }, // Globe
      { ...heroes[2], originalIndex: 2 }, // Waves
    ];
  } else {
    // Desktop order: Keep original
    return heroes;
  }
});

// Currently selected hero
const selectedIndex = ref(0);
const selectedHero = ref(null); // Initialize as null and set properly in onMounted

// Function to switch hero
const selectHero = (index) => {
  selectedIndex.value = index;
  selectedHero.value = heroes[index].component;
  emit('hero-changed', heroes[index].name);
};

// Set up resize listener and initial check
onMounted(() => {
  // No longer need to track previous route

  window.addEventListener('resize', updateDeviceType);
  updateDeviceType(); // Initial check

  // Always start with ThreeJsHero (Particles)
  selectedIndex.value = 1; // Particles

  // Set the selected hero component
  selectedHero.value = heroes[selectedIndex.value].component;

  // Emit the initial hero type
  emit('hero-changed', heroes[selectedIndex.value].name);
});

// Clean up event listener
onUnmounted(() => {
  window.removeEventListener('resize', updateDeviceType);
});
</script>