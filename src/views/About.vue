<template>
  <div>
    <!-- Page Header -->
    <div class="bg-secondary text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">About Me</h1>
        <div class="w-20 h-1 bg-primary mx-auto mb-6"></div>
        <p class="text-xl text-white/80 max-w-3xl mx-auto">
          Get to know more about me, my background, what drives me, and the values that shape my work.
        </p>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="section">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <!-- Left column: Image and quick facts -->
        <div>
          <div class="relative">
            <!-- Main image with border effect -->
            <div class="relative z-10">
              <img :src="getAssetPath('/assets/references/profile_picture.jpeg')" alt="Mustafa Camci" 
                class="w-full h-auto rounded-lg shadow-xl" />
            </div>
            
            <!-- Background accent elements -->
            <div class="absolute top-10 -left-10 w-full h-full border-4 border-primary rounded-lg -z-0"></div>
            <div class="absolute -bottom-10 -right-10 w-64 h-64 bg-secondary/10 rounded-lg -z-0"></div>
            
            <!-- Quick facts -->
            <div class="absolute bottom-10 -right-5 bg-white shadow-xl p-6 rounded-lg z-20 max-w-xs">
              <h3 class="text-lg font-bold text-secondary mb-4">Quick Facts</h3>
              <ul class="space-y-2">
                <li class="flex items-center">
                  <div class="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <span>Based in USA</span>
                </li>
                <li class="flex items-center">
                  <div class="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                    <i class="fas fa-briefcase"></i>
                  </div>
                  <span>5+ Years Experience</span>
                </li>
                <li class="flex items-center">
                  <div class="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                    <i class="fas fa-language"></i>
                  </div>
                  <span>English, Turkish</span>
                </li>
                <li class="flex items-center">
                  <div class="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                    <i class="fas fa-laptop-code"></i>
                  </div>
                  <span>Remote, Hybrid or Onsite Work</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Right column: Text content -->
        <div>
          <h2 class="text-3xl font-bold text-secondary mb-6">Hello, I'm Mustafa</h2>
          
          <div class="space-y-6 text-lg text-gray-600">
            <p>
              I'm a passionate software engineer with a strong focus on creating elegant, efficient, and user-friendly web applications. With over 5 years of experience in the industry, I've had the opportunity to work on various projects, from small business websites to large-scale enterprise applications.
            </p>
            
            <p>
              My journey in technology began with a curiosity about how websites worked. What started as a hobby quickly evolved into a passion and then a career. I'm constantly learning and exploring new technologies to stay at the forefront of web development.
            </p>
            
            <h3 class="text-xl font-bold text-secondary mt-8 mb-4">My Approach</h3>
            
            <p>
              I believe in writing clean, maintainable code that solves real problems. My approach combines technical expertise with a deep understanding of user needs. Whether I'm building a frontend interface or architecting a backend system, I focus on creating solutions that are both powerful and intuitive.
            </p>
            
            <p>
              Collaboration is at the heart of my work style. I enjoy working closely with designers, product managers, and fellow developers to bring ideas to life. By fostering open communication and embracing feedback, I ensure that the final product exceeds expectations.
            </p>
            
            <h3 class="text-xl font-bold text-secondary mt-8 mb-4">Beyond Coding</h3>
            
            <p>
              When I'm not coding, you might find me watching Formula 1 races, walking around the city, or diving into a good article. I believe that these diverse interests enhance my creativity and problem-solving abilities in my professional work.
            </p>
            
            <div class="mt-10">
              <router-link to="/contact" class="btn btn-primary">Get In Touch</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- My Values Section -->
    <div class="section bg-gray-50">
      <h2 class="text-3xl font-bold text-secondary text-center mb-12">My Values</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="value in values" :key="value.title" class="card p-6 text-center">
          <div class="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <i :class="value.icon"></i>
          </div>
          <h3 class="text-xl font-bold text-secondary mb-3">{{ value.title }}</h3>
          <p class="text-gray-600">{{ value.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- Testimonials Section -->
    <div class="section">
      <h2 class="text-3xl font-bold text-secondary text-center mb-12">What People Say</h2>
      
      <div class="relative px-8">
        <!-- Testimonial slider (simplified version) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="testimonial in testimonials" :key="testimonial.name" class="card p-8">
            <div class="text-primary text-4xl mb-4">❝</div>
            <p class="text-gray-600 mb-6">{{ testimonial.text }}</p>
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-full overflow-hidden mr-4">
                <img :src="testimonial.image" :alt="testimonial.name" class="w-full h-full object-cover" />
              </div>
              <div>
                <h4 class="font-bold text-secondary">{{ testimonial.name }}</h4>
                <p class="text-sm text-gray-500">{{ testimonial.position }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Call to Action -->
    <div class="section bg-primary text-white text-center">
      <h2 class="text-3xl font-bold mb-6">Want to work together?</h2>
      <p class="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
        I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
      </p>
      <router-link to="/contact" class="btn bg-white text-primary hover:bg-white/90">
        Start a Conversation
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Helper function to get the correct asset path
const getAssetPath = (path) => {
  // If the path is already an absolute URL, return it as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // Strip the leading "../" if present to ensure correct path resolution
  const cleanPath = path.replace(/^\.\.\//, '');
  
  // Add a leading slash to ensure the path is absolute from the base URL
  return import.meta.env.BASE_URL + cleanPath;
};

// Values
const values = [
  {
    title: 'Quality',
    icon: 'fas fa-star fa-lg',
    description: 'I believe in delivering high-quality work that exceeds expectations and stands the test of time.'
  },
  {
    title: 'Innovation',
    icon: 'fas fa-lightbulb fa-lg',
    description: 'I embrace new technologies and approaches to solve complex problems with creative solutions.'
  },
  {
    title: 'Collaboration',
    icon: 'fas fa-users fa-lg',
    description: 'I thrive in collaborative environments where diverse perspectives lead to better outcomes.'
  },
  {
    title: 'Continuous Learning',
    icon: 'fas fa-book fa-lg',
    description: 'I am committed to lifelong learning and constantly expanding my knowledge and skills.'
  }
];

// Testimonials
const testimonials = [
  {
    text: "Working with Mustafa was a pleasure. His technical skills and attention to detail transformed our project from good to exceptional.",
    name: "Jessica Monet",
    position: "Brand Communication Manager at Oro Jewelry",
    image: getAssetPath('/assets/references/jessica_monet.jpeg')
  },
  {
    text: "Mustafa's ability to understand our requirements and translate them into elegant code made all the difference. Highly recommended!",
    name: "Berkay Godeoglu",
    position: "AI and Robotics Engiineer at Ford Otosan",
    image: getAssetPath('/assets/references/berkay_godeoglu.jpeg')
  },
  {
    text: "Not only is Mustafa technically proficient, but he's also a great communicator who keeps everyone informed throughout the project.",
    name: "Mert Sever",
    position: "Planning and Control SW Development Leader at Ford Otosan",
    image: getAssetPath('/assets/references/mert_sever.jpeg')
  }
];
</script> 