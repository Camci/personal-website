<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" @click="$emit('update:modelValue', false)">
        <div class="modal-content bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto" @click.stop>
          <div class="relative">
            <!-- Video container with tabs for desktop/mobile when both are available -->
            <div class="w-full" v-if="hasVideo && !project.noMedia">
              <!-- Video tabs when mobile video is available -->
              <div v-if="hasMobileVideo" class="flex border-b">
                <button 
                  @click="activeVideoTab = 'desktop'" 
                  class="py-3 px-5 font-medium transition-colors"
                  :class="activeVideoTab === 'desktop' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'"
                >
                  Desktop
                </button>
                <button 
                  @click="activeVideoTab = 'mobile'" 
                  class="py-3 px-5 font-medium transition-colors"
                  :class="activeVideoTab === 'mobile' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'"
                >
                  Mobile
                </button>
              </div>
              
              <!-- Video display -->
              <div class="aspect-video bg-black overflow-hidden">
                <!-- Desktop video (YouTube) -->
                <iframe 
                  v-if="isYoutubeVideo && activeVideoTab === 'desktop'"
                  class="w-full h-full" 
                  :src="getYoutubeEmbedUrl(project.video)"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
                
                <!-- Mobile video (YouTube) -->
                <iframe 
                  v-if="isYoutubeVideo && activeVideoTab === 'mobile'"
                  class="w-full h-full" 
                  :src="getYoutubeEmbedUrl(project.mobileVideo)"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
                
                <!-- Desktop video (Regular) -->
                <video 
                  v-if="!isYoutubeVideo && activeVideoTab === 'desktop'"
                  ref="videoRef"
                  class="w-full h-full object-cover" 
                  loop
                  autoplay
                  muted
                  :src="project.video"
                  @click="togglePlay"
                ></video>
                
                <!-- Mobile video (Regular) -->
                <video 
                  v-if="!isYoutubeVideo && activeVideoTab === 'mobile'"
                  ref="mobileVideoRef"
                  class="w-full h-full object-cover" 
                  loop
                  autoplay
                  muted
                  :src="project.mobileVideo"
                  @click="togglePlay"
                ></video>
                
                <!-- Video controls overlay (only for regular videos) -->
                <div v-if="!isYoutubeVideo" class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-between">
                  <button class="text-white p-2 rounded-full hover:bg-white/20" @click.stop="togglePlay">
                    <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  
                  <button class="text-white p-2 rounded-full hover:bg-white/20" @click.stop="toggleFullscreen">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Multiple images carousel for projects with multiple images -->
            <div v-else-if="hasMultipleImages" class="w-full aspect-video relative bg-gray-100">
              <img 
                :src="currentImage" 
                :alt="project.title" 
                class="w-full h-full object-contain p-4" 
              />
              <!-- Navigation dots for multiple images -->
              <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <div 
                  v-for="(image, index) in project.images" 
                  :key="index"
                  class="w-3 h-3 rounded-full transition-colors duration-200 cursor-pointer"
                  :class="currentImageIndex === index ? 'bg-primary' : 'bg-gray-400 hover:bg-gray-600'"
                  @click.stop="currentImageIndex = index"
                ></div>
              </div>
              <!-- Navigation arrows -->
              <div v-if="project.images.length > 1" class="absolute inset-0 flex items-center justify-between p-4">
                <button 
                  @click.stop="previousImage"
                  class="w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  @click.stop="nextImage"
                  class="w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Single image display for projects without video but with image -->
            <div 
              v-else-if="!hasVideo && !project.noMedia" 
              class="w-full aspect-video flex items-center justify-center overflow-hidden"
              :class="project.imageBg || 'bg-white'"
            >
              <img 
                :src="project.image" 
                :alt="project.title" 
                class="max-w-full max-h-full object-contain p-4"
              />
            </div>
            
            <!-- Close button -->
            <button 
              class="absolute top-3 right-3 bg-white/80 rounded-full p-1 text-gray-800 hover:bg-white transition-colors z-10"
              @click="$emit('update:modelValue', false)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Project details -->
          <div class="p-6">
            <h2 class="text-2xl font-bold text-secondary mb-3">{{ project.title }}</h2>
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="tag in project.tags" :key="tag" class="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md">
                {{ tag }}
              </span>
            </div>
            
            <!-- Description Section with Features -->
            <div class="mb-6">
              <p class="text-gray-600 mb-4">{{ projectIntroduction }}</p>
              
              <!-- Feature List (two-column layout) -->
              <div v-if="projectFeatures.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 rounded-lg">
                <div v-for="(feature, index) in projectFeatures" :key="index" class="flex items-start">
                  <div class="text-primary mr-2 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p class="text-gray-700">{{ feature }}</p>
                </div>
              </div>
            </div>
            
            <a v-if="project.link !== '#'" :href="project.link" target="_blank" rel="noopener noreferrer" 
              class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
              {{ project.link.includes('github.com') ? 'View Code Repository' : 'View Project' }}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  project: {
    type: Object,
    required: true
  }
});

defineEmits(['update:modelValue']);

const videoRef = ref(null);
const mobileVideoRef = ref(null);
const isPlaying = ref(true);
const activeVideoTab = ref('desktop');
const currentImageIndex = ref(0);

// Multiple images functionality
const hasMultipleImages = computed(() => {
  return props.project?.images && props.project.images.length > 0;
});

const currentImage = computed(() => {
  if (hasMultipleImages.value) {
    return props.project.images[currentImageIndex.value];
  }
  return props.project.image;
});

const nextImage = () => {
  if (hasMultipleImages.value) {
    currentImageIndex.value = (currentImageIndex.value + 1) % props.project.images.length;
  }
};

const previousImage = () => {
  if (hasMultipleImages.value) {
    currentImageIndex.value = currentImageIndex.value === 0 
      ? props.project.images.length - 1 
      : currentImageIndex.value - 1;
  }
};

// Reset image index when modal opens
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    currentImageIndex.value = 0;
  }
});

// Check if the project has any video
const hasVideo = computed(() => {
  return props.project?.video ? true : false;
});

// Check if mobile video is available
const hasMobileVideo = computed(() => {
  return props.project?.mobileVideo ? true : false;
});

// Extract introduction and feature list from description
const projectIntroduction = computed(() => {
  if (!props.project?.description) return '';
  const sentences = props.project.description.split('.');
  return sentences[0] + '.';
});

const projectFeatures = computed(() => {
  if (!props.project?.description) return [];
  
  const sentences = props.project.description.split('.');
  // Skip the first sentence (introduction) and filter out empty strings
  return sentences.slice(1)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0)
    .map(sentence => sentence + '.');
});

// Check if the video is a YouTube URL
const isYoutubeVideo = computed(() => {
  if (!props.project?.video) return false;
  return props.project.video.includes('youtube.com') || props.project.video.includes('youtu.be');
});

// Get the YouTube embed URL with autoplay
const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  
  // Add autoplay=1 parameter to the URL
  if (url.includes('?')) {
    return url + '&autoplay=1&mute=1';
  } else {
    return url + '?autoplay=1&mute=1';
  }
};

// Toggle video play/pause
const togglePlay = () => {
  if (isYoutubeVideo.value || !hasVideo.value) return; // YouTube videos handled by the iframe
  
  const video = activeVideoTab.value === 'desktop' ? videoRef.value : mobileVideoRef.value;
  if (!video) return;
  
  if (video.paused) {
    video.play();
    isPlaying.value = true;
  } else {
    video.pause();
    isPlaying.value = false;
  }
};

// Toggle fullscreen mode
const toggleFullscreen = () => {
  if (isYoutubeVideo.value || !hasVideo.value) return; // YouTube videos have their own fullscreen button
  
  const video = activeVideoTab.value === 'desktop' ? videoRef.value : mobileVideoRef.value;
  if (!video) return;
  
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    video.requestFullscreen();
  }
};

// Pause video when modal is closed or tab changes
watch([() => props.modelValue, activeVideoTab], ([newVal]) => {
  if (!isYoutubeVideo.value && hasVideo.value) {
    if (!newVal && videoRef.value) {
      videoRef.value.pause();
      isPlaying.value = false;
    }
    
    if (!newVal && mobileVideoRef.value) {
      mobileVideoRef.value.pause();
      isPlaying.value = false;
    }
  }
});

// Handle escape key to close modal
const handleEscapeKey = (e) => {
  if (e.key === 'Escape' && props.modelValue) {
    e.preventDefault();
    e.stopPropagation();
    if (!isYoutubeVideo.value && hasVideo.value && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {
        // Ignore if not in fullscreen mode
      });
    }
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey);
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
</style> 