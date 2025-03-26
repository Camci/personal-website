<template>
  <div class="model-customizer-page">
    <div class="bg-gradient-to-r from-blue-900 to-purple-900 py-20 px-4">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Sherlock Holmes Suit Customizer
        </h1>
        <p class="text-xl text-gray-300 max-w-3xl mx-auto">
          Design your own personalized Sherlock Holmes-inspired suit with our interactive 3D customizer.
          Select colors, materials, and make it uniquely yours.
        </p>
        <p>
        Sherlock Holmes 3D model created by 
        <a href="https://www.fab.com/listings/c08c0688-1102-4d1b-b538-895e7d8a59f1" 
           target="_blank" 
           class="text-blue-400 hover:text-blue-300 underline">
           a9908244
        </a>
        via FAB.com. Used with permission.
      </p>
      </div>
    </div>

    <div class="py-12 bg-gray-900">
      <div class="container mx-auto px-4">
        <ModelCustomizer />
        
        <div class="mt-16 max-w-3xl mx-auto">
          <h2 class="text-2xl font-bold mb-6">How It Works</h2>
          
          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-gray-800 p-6 rounded-lg">
              <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span class="text-xl font-bold">1</span>
              </div>
              <h3 class="text-xl font-semibold mb-2">Select Parts</h3>
              <p class="text-gray-300">Choose different parts of the vintage suit to customize</p>
            </div>
            
            <div class="bg-gray-800 p-6 rounded-lg">
              <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span class="text-xl font-bold">2</span>
              </div>
              <h3 class="text-xl font-semibold mb-2">Choose Colors</h3>
              <p class="text-gray-300">Pick from a wide range of colors to personalize each part</p>
            </div>
            
            <div class="bg-gray-800 p-6 rounded-lg">
              <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span class="text-xl font-bold">3</span>
              </div>
              <h3 class="text-xl font-semibold mb-2">Select Materials</h3>
              <p class="text-gray-300">Choose from different material options for a unique look</p>
            </div>
          </div>
        </div>
        
        <div class="mt-16 max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg">
          <h2 class="text-2xl font-bold mb-6">Features</h2>
          
          <ul class="grid md:grid-cols-2 gap-4">
            <li class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Real-time 3D visualization</span>
            </li>
            <li class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Multiple color options</span>
            </li>
            <li class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Different material finishes</span>
            </li>
            <li class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Save your designs</span>
            </li>
            <li class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Custom part selection</span>
            </li>
            <li class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Interactive 3D controls</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ModelCustomizer from '../components/ModelCustomizer.vue';
</script>

<style scoped>
.model-customizer-page {
  background-color: #0a0a0a;
  color: white;
  min-height: 100vh;
}
</style> 