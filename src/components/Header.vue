<template>
  <header class="bg-transparent backdrop-blur-sm shadow-sm sticky top-0 z-50 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <span class="text-2xl font-bold text-primary font-heading transition-colors hover:text-primary/80">MC</span>
          </router-link>
        </div>

        <!-- Desktop navigation -->
        <nav class="hidden md:flex space-x-8 items-center">
          <router-link v-for="item in navigation" :key="item.name"
            :to="item.href"
            class="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            :class="{ 'text-primary after:w-full': isActive(item.href) }">
            {{ item.name }}
          </router-link>
          <a @click="scrollToContact" class="btn btn-primary text-sm hover:shadow-lg transition-all cursor-pointer">Contact Me</a>
        </nav>

        <!-- Mobile menu button -->
        <div class="flex items-center md:hidden">
          <button @click="mobileMenuOpen = !mobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none transition-colors">
            <span class="sr-only">Open main menu</span>
            <svg v-if="!mobileMenuOpen" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-transparent backdrop-blur-md shadow-lg">
      <div class="pt-2 pb-3 space-y-1">
        <router-link v-for="item in navigation" :key="item.name"
          :to="item.href"
          class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50/50 transition-colors"
          :class="{ 'text-primary bg-gray-50/50': isActive(item.href) }"
          @click="mobileMenuOpen = false">
          {{ item.name }}
        </router-link>
        <a @click="scrollToContactMobile"
          class="block px-3 py-2 text-base font-medium text-primary hover:bg-gray-50/50 transition-colors cursor-pointer">
          Contact Me
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const mobileMenuOpen = ref(false);

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Resume', href: '/resume' },
  { name: 'Projects', href: '/projects' },
  { name: '3D Customizer', href: '/model-customizer' },
];

const isActive = (path) => {
  return route.path === path;
};

// Function to scroll to contact section
const scrollToContact = () => {
  if (route.path === '/') {
    // If already on home page, scroll to the contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    // If on another page, navigate to home and then scroll to contact
    router.push('/');
    // Wait for navigation to complete before scrolling
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  }
};

// Function for mobile menu that also closes the menu
const scrollToContactMobile = () => {
  mobileMenuOpen.value = false;
  scrollToContact();
};
</script>