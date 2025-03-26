<template>
  <span class="typewriter">{{ displayText }}<span class="cursor">|</span></span>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  strings: {
    type: Array,
    required: true
  },
  typeSpeed: {
    type: Number,
    default: 100
  },
  deleteSpeed: {
    type: Number,
    default: 50
  },
  delayBetweenStrings: {
    type: Number,
    default: 1500
  }
});

const displayText = ref('');
let currentStringIndex = 0;
let isDeleting = false;
let timeout;

const typeText = () => {
  const currentString = props.strings[currentStringIndex];
  
  if (isDeleting) {
    // Deleting text
    displayText.value = currentString.substring(0, displayText.value.length - 1);
  } else {
    // Typing text
    displayText.value = currentString.substring(0, displayText.value.length + 1);
  }
  
  // Calculate typing speed
  let typeSpeed = isDeleting ? props.deleteSpeed : props.typeSpeed;
  
  // Check if complete
  if (!isDeleting && displayText.value === currentString) {
    // Pause at end of typing
    isDeleting = true;
    typeSpeed = props.delayBetweenStrings;
  } else if (isDeleting && displayText.value === '') {
    // Move to next string
    isDeleting = false;
    currentStringIndex = (currentStringIndex + 1) % props.strings.length;
  }
  
  timeout = setTimeout(typeText, typeSpeed);
};

onMounted(() => {
  typeText();
});

onUnmounted(() => {
  clearTimeout(timeout);
});
</script>

<style scoped>
.typewriter {
  position: relative;
}

.cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from, to {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style> 