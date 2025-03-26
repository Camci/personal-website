<template>
  <div>
    <!-- Page Header -->
    <div class="bg-secondary text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
        <div class="w-20 h-1 bg-primary mx-auto mb-6"></div>
        <p class="text-xl text-white/80 max-w-3xl mx-auto">
          Have a question or want to work together? Feel free to reach out to me.
        </p>
      </div>
    </div>

    <!-- Contact Content -->
    <div class="section py-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <!-- Contact Form -->
        <div>
          <h2 class="text-2xl font-bold text-secondary mb-6">Send Me a Message</h2>
          
          <form action="https://formspree.io/f/xwplqrqr" method="POST" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  required
                />
              </div>
            </div>
            
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                required
              />
            </div>
            
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="6" 
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                required
              ></textarea>
            </div>
            
            <div>
              <button 
                type="submit" 
                class="btn btn-primary w-full md:w-auto"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
        
        <!-- Contact Information -->
        <div>
          <h2 class="text-2xl font-bold text-secondary mb-6">Contact Information</h2>
          
          <div class="space-y-8">
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-primary/10 p-4 rounded-md mr-4">
                <i class="fas fa-envelope text-primary text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-secondary mb-1">Email</h3>
                <p class="text-gray-600">mcamci98@gmail.com</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-primary/10 p-4 rounded-md mr-4">
                <i class="fas fa-map-marker-alt text-primary text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-secondary mb-1">Location</h3>
                <p class="text-gray-600">Philadelphia, US</p>
                <p class="text-gray-600">Available for remote work, hybrid work, and travel worldwide</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-primary/10 p-4 rounded-md mr-4">
                <i class="fas fa-share-alt text-primary text-xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-secondary mb-1">Social Media</h3>
                <div class="flex space-x-4 mt-2">
                  <a href="https://www.linkedin.com/in/mustafa-camc%C4%B1-b0ba68177" class="text-gray-600 hover:text-primary transition-colors">
                    <i class="fab fa-linkedin text-2xl"></i>
                  </a>
                  <a href="https://github.com/Camci" class="text-gray-600 hover:text-primary transition-colors">
                    <i class="fab fa-github text-2xl"></i>
                  </a>
                </div>
              </div>
            </div>
            
            <div class="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-100">
              <h3 class="text-lg font-semibold text-secondary mb-3">Available For</h3>
              <ul class="space-y-2">
                <li class="flex items-center">
                  <i class="fas fa-check text-primary mr-2"></i>
                  <span>Full-time positions</span>
                </li>
                <li class="flex items-center">
                  <i class="fas fa-check text-primary mr-2"></i>
                  <span>Freelance projects</span>
                </li>
                <li class="flex items-center">
                  <i class="fas fa-check text-primary mr-2"></i>
                  <span>Consulting</span>
                </li>
                <li class="flex items-center">
                  <i class="fas fa-check text-primary mr-2"></i>
                  <span>Remote collaboration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Map Section (Optional - would need to integrate with a map service) -->
    <div class="h-96 bg-gray-200 flex items-center justify-center">
      <div class="text-center">
        <h3 class="text-xl font-semibold mb-2">Map Integration</h3>
        <p class="text-gray-600">A map would be displayed here, showing my location in Istanbul, Turkey.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// No reactive form handling needed with Formspree
</script> 