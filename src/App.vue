<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

// Handle page transitions
onMounted(() => {
  document.body.classList.add('page-loaded');
});

// Optional: Global event listeners or theme initialization
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.page-loaded {
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}
</style> 