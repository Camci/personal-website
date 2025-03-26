<template>
  <div class="card p-6 flex flex-col items-center transform hover:-translate-y-2 transition-all duration-300">
    <div class="text-4xl text-primary mb-4">
      <i :class="skill.icon"></i>
    </div>
    <h3 class="text-lg font-medium text-secondary mb-2">{{ skill.name }}</h3>
    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
      <div class="bg-primary h-2.5 rounded-full" :style="{ width: `${skill.level}%` }"></div>
    </div>
    <span class="text-sm text-gray-500 mt-2">{{ skill.level }}%</span>
  </div>
</template>

<script setup>
defineProps({
  skill: {
    type: Object,
    required: true
  }
});
</script> 