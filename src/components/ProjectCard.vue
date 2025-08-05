<template>
  <div class="card group overflow-hidden cursor-pointer" @click="$emit('click', project)">
    <div class="relative overflow-hidden aspect-video">
      <!-- Video preview for card when video exists -->
      <video 
        v-if="!isYoutubeVideo && project.video && !project.noMedia" 
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        autoplay 
        loop 
        muted 
        playsinline
        :src="project.video"
      ></video>
      
      <!-- YouTube thumbnail for YouTube videos -->
      <div v-else-if="isYoutubeVideo && !project.noMedia" class="w-full h-full">
        <img 
          :src="getYoutubeThumbnail" 
          :alt="project.title" 
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Multiple images carousel -->
      <div v-else-if="hasMultipleImages" class="w-full h-full relative">
        <img 
          :src="currentImage" 
          :alt="project.title" 
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <!-- Navigation dots for multiple images -->
        <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <div 
            v-for="(image, index) in project.images" 
            :key="index"
            class="w-2 h-2 rounded-full transition-colors duration-200"
            :class="currentImageIndex === index ? 'bg-white' : 'bg-white/50'"
          ></div>
        </div>
        <!-- Navigation arrows -->
        <div v-if="project.images.length > 1" class="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            @click.stop="previousImage"
            class="w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            @click.stop="nextImage"
            class="w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Regular image for all other projects -->
      <div 
        v-else
        class="w-full h-full flex items-center justify-center overflow-hidden" 
        :class="project.imageBg || 'bg-gray-100'"
      >
        <img 
          :src="project.image" 
          :alt="project.title" 
          :class="[
            project.imageStyle || 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
          ]" 
        />
      </div>
      
      <div class="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
        <div class="p-6">
          <h3 class="text-xl font-bold text-white mb-2">{{ project.title }}</h3>
          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="tag in project.tags" :key="tag" class="text-xs px-2 py-1 bg-primary/80 text-white rounded-md">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="p-6">
      <h3 class="text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors">{{ project.title }}</h3>
      <p class="text-gray-600 mb-4">{{ project.description.split('.')[0] }}.</p>
      <div class="text-primary font-medium inline-flex items-center">
        View Details
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});

defineEmits(['click']);

// Multiple images functionality
const currentImageIndex = ref(0);

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

// Check if the video is a YouTube URL
const isYoutubeVideo = computed(() => {
  if (!props.project?.video) return false;
  return props.project.video.includes('youtube.com') || props.project.video.includes('youtu.be');
});

// Get YouTube thumbnail
const getYoutubeThumbnail = computed(() => {
  if (!isYoutubeVideo.value) return '';
  
  // Extract YouTube video ID
  let videoId = '';
  const url = props.project.video;
  
  if (url.includes('embed/')) {
    videoId = url.split('embed/')[1].split('?')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('watch?v=')) {
    videoId = url.split('watch?v=')[1].split('&')[0];
  }
  
  // Return high quality thumbnail
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
});
</script> 