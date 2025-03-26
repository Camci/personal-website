<template>
  <div class="relative">
    <!-- Hero Section with 3D Background -->
    <section class="relative min-h-[80vh] flex items-center overflow-hidden">
      <ThreeJsHeroSelector @hero-changed="updateHeroType" />
      <div class="container mx-auto px-4 z-10 text-center md:text-left">
        <div class="md:max-w-2xl backdrop-blur-sm bg-white/30 p-8 rounded-xl shadow-xl">
          <h1 class="text-4xl md:text-6xl font-bold mb-4 text-shadow-sm" :class="selectedHero === 'Globe' ? 'text-white' : 'text-secondary'">
            Hi, I'm <span class="text-primary text-shadow-sm">Mustafa Camci</span>
          </h1>
          <h2 class="text-2xl md:text-3xl mb-6" :class="selectedHero === 'Globe' ? 'text-white/80' : 'text-secondary/80'">
            <TypewriterEffect :strings="['Web Developer', 'Software Engineer', 'Tech Enthusiast']" />
          </h2>
          <p class="text-lg md:text-xl mb-8 max-w-2xl" :class="selectedHero === 'Globe' ? 'text-white/70' : 'text-secondary/70'">
            Building innovative digital experiences with modern web technologies. Let's create something amazing together.
          </p>
          <div class="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <router-link to="/projects" class="btn btn-primary">View My Work</router-link>
            <router-link to="/contact" class="btn bg-white text-secondary border border-secondary hover:bg-secondary hover:text-white">Get In Touch</router-link>
          </div>
        </div>
      </div>
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#about-preview" class="text-secondary opacity-70 hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>

    <!-- About Preview Section -->
    <section id="about-preview" class="section">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl font-bold text-secondary mb-6">About Me</h2>
          <p class="text-lg text-secondary/70 mb-6">
            I'm a passionate software engineer with a focus on creating clean, efficient, and user-friendly applications. With a strong foundation in both frontend and backend technologies, I bring a holistic approach to development.
          </p>
          <p class="text-lg text-secondary/70 mb-8">
            My journey in tech has equipped me with a diverse skill set and a problem-solving mindset that I apply to every project.
          </p>
          <div class="flex justify-center md:justify-start">
            <router-link to="/about" class="btn btn-secondary inline-block">More About Me</router-link>
          </div>
        </div>
        <div class="relative">
          <div class="aspect-square rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
            <img src="/src/assets/references/profile_picture.jpeg" alt="Mustafa Camci" class="w-full h-full object-cover" />
          </div>
          <div class="absolute -bottom-6 -right-6 bg-primary text-white p-4 rounded-lg shadow-lg">
            <div class="flex items-center space-x-2">
              <span class="text-4xl font-bold">5+</span>
              <span class="text-sm">Years of<br>Experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Preview -->
    <section class="section bg-gray-100">
      <h2 class="text-3xl font-bold text-secondary mb-12 text-center">My Skills</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        <SkillCard v-for="skill in skills" :key="skill.name" :skill="skill" />
      </div>
      <div class="text-center mt-12">
        <router-link to="/resume" class="btn btn-primary">View My Resume</router-link>
      </div>
    </section>

    <!-- Project Preview -->
    <section class="section">
      <div class="flex flex-col md:flex-row justify-between items-center mb-12">
        <h2 class="text-3xl font-bold text-secondary">Featured Projects</h2>
        <router-link to="/projects" class="mt-4 md:mt-0 text-primary hover:text-primary/80 font-medium">
          View All Projects →
        </router-link>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProjectCard 
          v-for="project in featuredProjects" 
          :key="project.id" 
          :project="project" 
          @click="navigateToProject(project)"
        />
      </div>
    </section>

    <!-- Contact CTA -->
    <section id="contact" class="section bg-secondary text-white">
      <div class="text-center max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold mb-6">Let's Work Together</h2>
        <p class="text-xl text-white/80 mb-8">
          Interested in collaborating or have a project in mind? Let's connect and discuss how we can work together.
        </p>
        <router-link to="/contact" class="btn bg-white text-secondary hover:bg-white/90">
          Get In Touch
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import ThreeJsHeroSelector from '../components/ThreeJsHeroSelector.vue';
import SkillCard from '../components/SkillCard.vue';
import ProjectCard from '../components/ProjectCard.vue';
import TypewriterEffect from '../components/TypewriterEffect.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Get router
const router = useRouter();

// Function to navigate to project
const navigateToProject = (project) => {
  router.push(`/projects/${project.id}`);
};

// Track the selected hero type
const selectedHero = ref('Particles');

// Function to update the hero type
const updateHeroType = (heroName) => {
  selectedHero.value = heroName;
};

// Skills data
const skills = [
  { name: 'JavaScript', icon: 'fab fa-js', level: 90 },
  { name: 'Liquid', icon: 'fab fa-shopify', level: 95 },
  { name: 'Vue.js', icon: 'fab fa-vuejs', level: 90 },
  { name: 'React', icon: 'fab fa-react', level: 70 },
  { name: 'Node.js', icon: 'fab fa-node-js', level: 80 },
  { name: 'HTML5', icon: 'fab fa-html5', level: 95 },
  { name: 'CSS3', icon: 'fab fa-css3-alt', level: 95 },
  { name: 'Git', icon: 'fab fa-git-alt', level: 95 },
  { name: 'AWS', icon: 'fab fa-aws', level: 75 },
  { name: 'Python', icon: 'fab fa-python', level: 95 },
  { name: 'MySQL', icon: 'fas fa-database', level: 80 },
  { name: 'NoSQL', icon: 'fas fa-database', level: 90 },
  { name: 'Docker', icon: 'fab fa-docker', level: 60 },
  { name: 'PHP', icon: 'fab fa-php', level: 50 }
];

// Projects data
const featuredProjects = [
  {
    id: 1,
    title: 'B2B Fully Customized Shopify Website',
    description: 'Developed a comprehensive B2B Shopify solution with enterprise-level functionality without relying on paid apps or themes. B2B completely free platform without paid apps or themes. Only accepted users can access the platform through a custom tag mechanism.',
    image: 'https://placehold.co/600x400/3498db/FFFFFF.png?text=B2B+Shopify+Website',
    tags: ['Shopify', 'B2B', 'Custom Development', 'Liquid', 'JavaScript'],
    link: '#'
  },
  {
    id: 2,
    title: 'B2C Shopify Website',
    description: 'Developed a custom B2C e-commerce solution on Shopify with premium user experience and advanced functionality. Customized Product page with enhanced display options and user interactions.',
    image: 'https://placehold.co/600x400/2c3e50/FFFFFF.png?text=B2C+Shopify+Website',
    tags: ['Shopify', 'B2C', 'Custom Development', 'Liquid', 'JavaScript', 'API Integration'],
    link: '#'
  },
  {
    id: 4,
    title: 'Mosaique AI Marketing Tracker',
    description: 'Built a sophisticated AI-powered marketing analytics platform from the ground up. AWS based ecosystem leveraging cloud-native architecture. Custom Lambda functions for serverless processing of marketing data.',
    image: 'https://mosaique.us/img/logo_black.c5aa620b.png',
    imageBg: 'bg-white',
    imageStyle: 'object-contain max-w-[50%] max-h-[50%]',
    tags: ['AWS', 'Vue.js', 'Lambda', 'API Gateway', 'AI', 'Analytics', 'Serverless'],
    link: '#'
  }
];
</script>

<style scoped>
.text-shadow-sm {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style> 