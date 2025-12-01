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
        <a @click="scrollToSection('about-preview')" class="text-secondary opacity-70 hover:opacity-100 cursor-pointer">
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
            <img src="../assets/references/profile_picture.jpeg" alt="Mustafa Camci" class="w-full h-full object-cover" />
          </div>
          <div class="absolute -bottom-3 md:-bottom-6 -right-3 md:-right-6 bg-primary text-white p-3 md:p-4 rounded-lg shadow-lg">
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

// Function to scroll to a section
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Skills data
const skills = [
  { name: 'JavaScript', icon: 'fab fa-js', level: 90 },
  { name: 'Liquid', icon: 'fab fa-shopify', level: 95 },
  { name: 'Vue.js', icon: 'fab fa-vuejs', level: 90 },
  { name: 'React', icon: 'fab fa-react', level: 95 },
  { name: 'Next.js', icon: 'simple-icons:nextdotjs', level: 95 },
  { name: 'Node.js', icon: 'fab fa-node-js', level: 85 },
  { name: 'Express.js', icon: 'simple-icons:express', level: 90 },
  { name: 'HTML5', icon: 'fab fa-html5', level: 95 },
  { name: 'CSS3', icon: 'fab fa-css3-alt', level: 95 },
  { name: 'Git', icon: 'fab fa-git-alt', level: 95 },
  { name: 'AWS', icon: 'fab fa-aws', level: 85 },
  { name: 'Python', icon: 'fab fa-python', level: 95 },
  { name: 'MySQL', icon: 'fas fa-database', level: 80 },
  { name: 'NoSQL', icon: 'fas fa-database', level: 90 },
  { name: 'Docker', icon: 'fab fa-docker', level: 80 },
  { name: 'PHP', icon: 'fab fa-php', level: 50 }
];

// Projects data
const featuredProjects = [
{
    id: 1,
    title: 'B2B Fully Customized Shopify Website',
    description: 'Developed a comprehensive B2B Shopify solution with enterprise-level functionality without relying on paid apps or themes. B2B completely free platform without paid apps or themes. Only accepted users can access the platform through a custom tag mechanism. Engineered custom page and collection mechanisms for optimized browsing. Designed collection pages to display 33 products per page for optimal user experience. Built product pages supporting up to 5,000 variants while maintaining performance. Implemented AJAX-powered variant selection for seamless cart interactions. Created a system to pass custom metafield values to cart line items as properties. Fully responsive and mobile-friendly design for seamless experience across all devices.',
    image: 'https://placehold.co/600x400/3498db/FFFFFF.png?text=B2B+Shopify+Website',
    video: 'https://www.youtube.com/embed/4DJhnep2IcM',
    mobileVideo: 'https://www.youtube.com/embed/led-Z57MLDU',
    tags: ['Shopify', 'B2B', 'Custom Development', 'Liquid', 'JavaScript'],
    category: 'Web Development',
    link: '#'
  },
  {
    id: 2,
    title: 'B2C Shopify Website',
    description: 'Developed a custom B2C e-commerce solution on Shopify with premium user experience and advanced functionality. Customized Product page with enhanced display options and user interactions. Customized Home Page with engaging layout and brand-focused sections. Customized Pages including comprehensive footer design. Custom Announcement Bar with theme adaptability allowing client control via the online editor. Custom Gold API integration for real-time precious metal pricing. Custom buttons for seamless external app integration. Custom Metafield connections for external apps enhancing product information. Custom collection slider on the home page for featured product showcasing. Custom Drawer menu optimized for mobile users. Marketing tools integration including Meta suite, Klaviyo and more for comprehensive marketing capabilities. Maintaining theme integrity when updates are released for seamless platform evolution.',
    image: 'https://placehold.co/600x400/2c3e50/FFFFFF.png?text=B2C+Shopify+Website',
    video: 'https://www.youtube.com/embed/mbG1s6tzAGo',
    mobileVideo: 'https://www.youtube.com/embed/Rl--ypITGfY',
    tags: ['Shopify', 'B2C', 'Custom Development', 'Liquid', 'JavaScript', 'API Integration'],
    category: 'Web Development',
    link: '#'
  },

  {
    id: 6,
    title: 'Shopify Headless E-commerce Store',
    description: 'Built a modern, full-featured headless e-commerce store using NextJs 15, TypeScript, and Shopify Storefront API. NextJs 15, TypeScript, and Shopify Storefront API. Developed a performant, scalable e-commerce solution with advanced features including real-time filtering, search, and cart management. Implemented comprehensive product catalog with pagination and detailed product pages featuring image galleries with hover zoom effects. Created advanced search functionality with real-time results, debouncing, and search dropdown with product previews. Built sophisticated filtering system supporting price ranges, availability, categories, and multiple sorting options. Developed responsive cart management system with add, remove, and update functionality using React Context API. Implemented server-side rendering for SEO optimization and secure API routes for server-side operations. Created loading states with skeleton animations and comprehensive error handling with graceful recovery. Built accessible design following WCAG guidelines with optimized images and lazy loading for performance. Integrated GraphQL with Shopify Storefront API for efficient data fetching and real-time updates.',
    image: 'https://placehold.co/600x400/3498db/FFFFFF.png?text=Shopify+Headless+Store',
    video: 'https://www.youtube.com/embed/VkZQm764nlw',
    tags: ['Next.js 15', 'TypeScript', 'Shopify Storefront API', 'GraphQL', 'Tailwind CSS', 'Headless E-commerce', 'React Context', 'Server-Side Rendering'],
    category: 'Web Development',
    link: 'https://github.com/Camci/shopify-headless-example'
  },
    {
    id: 5,
    title: 'Crypto Management Platform',
    description: 'Built a modern, full-featured cryptocurrency trading and portfolio management platform using NextJS 15 and TypeScript. Developed a professional-grade crypto trading platform with real-time data, advanced charting, and intelligent portfolio insights. Implemented comprehensive portfolio tracking with performance analytics, asset allocation visualization, and historical performance charts. Created advanced trading interface with real-time candlestick charts, order books, and professional trading tools. Built market analysis dashboard with trending coins, top gainers/losers, and comprehensive market statistics. Developed staking platform with multiple pools, flexible terms, and reward tracking. Implemented secure wallet management with multi-asset support, transaction history, and QR code generation. Created crypto debit card system with spending analytics and cashback rewards. Built global search functionality with real-time suggestions and smart filtering. Implemented dark/light theme toggle with seamless switching and persistent settings. Integrated CoinPaprika API for real-time cryptocurrency data with rate limiting and error handling. Built responsive design optimized for desktop, tablet, and mobile devices with smooth animations.',
    image: 'https://placehold.co/600x400/8e44ad/FFFFFF.png?text=Crypto+Management+Platform',
    video: 'https://www.youtube.com/embed/LAs-sXhJb7A',
    tags: ['Next.js 15', 'TypeScript', 'React', 'Tailwind CSS', 'Recharts', 'CoinPaprika API', 'Cryptocurrency', 'Trading Platform', 'Portfolio Management', 'Staking'],
    category: 'Web Development',
    link: 'https://github.com/Camci/crypto-management'
  },
  {
    id: 3,
    title: 'BulkBridge - Shopify Data Management App',
    description: 'Developed a comprehensive Shopify embedded application for bulk data import/export operations using CSV format. Built with AWS Serverless architecture for high scalability and cost efficiency. Implemented secure authentication using Shopify session tokens and JWT. Created a React-based frontend with Shopify Polaris UI components and App Bridge for seamless integration. Built serverless backend using AWS Lambda, API Gateway, DynamoDB, and S3 for optimal performance. Implemented comprehensive job tracking system with detailed status updates and error handling. Developed bulk operations for products, customers, orders, discounts, and metafields management. Created automated CSV processing with validation and error reporting. Built scalable architecture supporting stores with thousands of products. Implemented secure file handling with S3 integration for temporary storage. Created detailed logging system for audit trails and debugging. Built responsive admin interface with real-time progress tracking. Implemented batch processing capabilities for large datasets. Created automated cleanup processes for temporary files and expired sessions. 10K variants imported in 3 minutes.',
    image: 'https://placehold.co/600x400/1abc9c/FFFFFF.png?text=BulkBridge+App',
    video: 'https://www.youtube.com/embed/McGy23z7rI8',
    tags: ['Shopify', 'AWS', 'React', 'Serverless', 'CSV Processing', 'Bulk Operations', 'API Integration', 'DynamoDB', 'Lambda'],
    category: 'Web Development',
    link: '#'
  },
  {
    id: 7,
    title: 'Mosaique AI Marketing Tracker',
    description: 'Built a sophisticated AI-powered marketing analytics platform from the ground up. AWS based ecosystem leveraging cloud-native architecture. Custom Lambda functions for serverless processing of marketing data.',
    image: 'https://mosaique.us/img/logo_black.c5aa620b.png',
    imageBg: 'bg-white',
    imageStyle: 'object-contain max-w-[50%] max-h-[50%]',
    tags: ['AWS', 'Vue.js', 'Lambda', 'API Gateway', 'AI', 'Analytics', 'Serverless'],
    link: '#'
  },
  
];
</script>

<style scoped>
.text-shadow-sm {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style>