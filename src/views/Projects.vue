<template>
  <div>
    <!-- Page Header -->
    <div class="bg-secondary text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">My Projects</h1>
        <div class="w-20 h-1 bg-primary mx-auto mb-6"></div>
        <p class="text-xl text-white/80 max-w-3xl mx-auto">
          Explore my portfolio of projects, showcasing my skills and experience across various technologies and domains.
        </p>
      </div>
    </div>

    <!-- Projects Filter Section -->
    <div class="section">
      <div class="flex flex-wrap justify-center gap-3 mb-12">
        <button 
          @click="selectedCategory = category"
          v-for="category in categories" 
          :key="category"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          :class="selectedCategory === category 
            ? 'bg-primary text-white' 
            : 'bg-gray-100 text-secondary hover:bg-gray-200'"
        >
          {{ category }}
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProjectCard 
          v-for="project in filteredProjects" 
          :key="project.id" 
          :project="project" 
          class="opacity-0 animate-fadeIn"
          @click="openProjectModal(project)"
        />
      </div>
    </div>
    
    <!-- Project Modal -->
    <ProjectModal 
      v-model="showModal" 
      :project="selectedProject" 
    />
    
    <!-- Let's Work Together Section -->
    <div class="section bg-primary text-white text-center">
      <h2 class="text-3xl font-bold mb-6">Have a project in mind?</h2>
      <p class="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
        I'm always looking for new challenges and opportunities to create something amazing. Let's discuss your project and bring your ideas to life.
      </p>
      <router-link to="/contact" class="btn bg-white text-primary hover:bg-white/90">
        Get In Touch
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ProjectCard from '../components/ProjectCard.vue';
import ProjectModal from '../components/ProjectModal.vue';

// Get route information
const route = useRoute();

// Modal state
const showModal = ref(false);
const selectedProject = ref(null);

// Open project modal
const openProjectModal = (project) => {
  selectedProject.value = project;
  showModal.value = true;
};

// Categories
const categories = ['All', 'Web Development', 'E-commerce', 'Python Automation', 'Marketing Analytics'];
const selectedCategory = ref('All');

// Projects data
const projects = [
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
    id: 3,
    title: 'Modern Portfolio Website',
    description: 'Developed a sophisticated personal portfolio website with advanced interaction and multimedia capabilities. Built with Vue.js and Tailwind CSS for a fast, responsive, and modern user experience. Implemented a flexible project showcase with interactive modals and media display. Created custom video integration supporting both direct video files and YouTube embeds with player controls. Integrated 3D.js for interactive visual elements and dynamic content presentation. Designed an intelligent content display system that adapts to different media types (videos, images). Incorporated a two-column feature list layout for improved readability of project details. Built responsive design ensuring optimal experience across all devices from mobile to desktop. Added category filtering for easy navigation through different project types. Implemented smooth animations and transitions for enhanced user experience. Used modern JavaScript features and Vue.js composition API for maintainable and scalable code architecture.',
    image: 'https://placehold.co/600x400/e74c3c/FFFFFF.png?text=Vue.js+Tailwind.css+Portfolio',
    noMedia: true,
    tags: ['Vue.js', 'Tailwind CSS', 'JavaScript', '3D.js', 'Responsive Design', 'Interactive UI'],
    category: 'Web Development',
    link: '#'
  },
  {
    id: 4,
    title: 'Mosaique AI Marketing Tracker',
    description: 'Built a sophisticated AI-powered marketing analytics platform from the ground up. AWS based ecosystem leveraging cloud-native architecture. Custom Lambda functions for serverless processing of marketing data. Custom API Gateways established for secure data flow and third-party integrations. Vue.js front-end with custom CSS styling delivering an intuitive user experience. Modern and fresh interface designed for clarity and ease of use. Detailed metric demonstration through interactive graphs, charts and comprehensive summaries. External application connections integrated seamlessly with Meta Suite, Shopify and Google Analytics. Full private integrated AI solution for predictive analytics and marketing insights. Custom development environment with enhanced authentication steps based on AWS security best practices.',
    image: 'https://mosaique.us/img/logo_black.c5aa620b.png',
    imageBg: 'bg-white',
    imageStyle: 'object-contain max-w-[50%] max-h-[50%]',
    tags: ['AWS', 'Vue.js', 'Lambda', 'API Gateway', 'AI', 'Analytics', 'Serverless'],
    category: 'Web Development',
    link: '#'
  },
  {
    id: 5,
    title: 'EU HORIZON 2020 HADRIAN Project - HMI Development',
    description: 'Collaborated with the University of Surrey on the prestigious EU HORIZON 2020 HADRIAN project to develop next-generation Human-Machine Interfaces for automated vehicles. Implemented an agile HMI development methodology based on extensive research, psychological studies, A/B testing frameworks, and simulation evaluations. Designed and executed comprehensive in-vehicle studies to validate interface effectiveness and user experience in real-world scenarios. Developed a robust communication architecture utilizing UDP protocols to integrate vehicle data streams with HADRIAN innovations. Created adaptive interfaces that respond to driver state and vehicle environment for improved safety and user experience. Implemented real-time data visualization components to provide drivers with intuitive feedback about automation status and vehicle intentions. Conducted extensive usability testing with diverse user groups to ensure inclusive design principles were followed. Collaborated with international research teams to integrate findings from multiple disciplines including cognitive psychology, human factors, and computer science. Contributed to publications and deliverables documenting methodologies and results for the broader scientific community.',
    image: 'https://hadrianproject.eu/wp-content/uploads/2019/09/HADRIAN.svg',
    imageBg: 'bg-white',
    imageStyle: 'object-contain max-w-[70%] max-h-[70%]',
    video: 'https://www.youtube.com/embed/DkOp4oDuxT0',
    tags: ['Python', 'HMI Development', 'Vehicle Communication', 'UDP', 'User Experience', 'Research Integration'],
    category: 'Python Automation',
    link: 'https://hadrianproject.eu'
  },
  {
    id: 6,
    title: 'EU HORIZON 2020 HADRIAN Project - Driver Monitoring System',
    description: 'Developed a sophisticated Driver Monitoring System (DMS) for the EU HORIZON 2020 HADRIAN project, designed to enhance road safety in automated vehicles through advanced driver state detection. Created predictive models capable of multi-class classification of driver states including attentiveness, distraction, fatigue, and readiness to take control of automated vehicles. Implemented TensorFlow-based deep learning architectures optimized for real-time processing of multidimensional driver data. Designed and executed comprehensive data collection protocols, gathering high-quality behavioral data across diverse driving scenarios and conditions. Developed robust data cleaning and preprocessing pipelines to ensure model training integrity and performance reliability. Enhanced classification accuracy through the integration of emotional state recognition, creating more nuanced driver state profiles that account for stress, cognitive load, and situational awareness. Collaborated with interdisciplinary teams to validate system performance against human factors research benchmarks. Contributed to technical deliverables and publications documenting methodologies, algorithm design, and performance metrics. Developed system integration protocols allowing the DMS to communicate seamlessly with other vehicle subsystems including HMI and automation controllers.',
    image: 'https://hadrianproject.eu/wp-content/uploads/2019/09/HADRIAN.svg',
    imageBg: 'bg-white',
    imageStyle: 'object-contain max-w-[70%] max-h-[70%]',
    video: 'https://www.youtube.com/embed/i5oQ8uUmtMk?start=330',
    tags: ['Python', 'TensorFlow', 'Machine Learning', 'Driver Monitoring', 'Classification Algorithms', 'Data Analysis'],
    category: 'Python Automation',
    link: 'https://hadrianproject.eu'
  },
  {
    id: 7,
    title: 'Shopify-Grist Integration System',
    description: 'Developed a comprehensive system to synchronize product, inventory, customer, and order data between Shopify and Grist databases. Created bidirectional data flow ensuring real-time inventory accuracy across platforms. Implemented customer data validation with phone number verification. Built GUI dashboard for simplified order management and processing. Designed automated payment verification and refund/return handling. Established reliable secure connection between platforms with proper authentication. Created an audit trail for all data modifications ensuring transparency and traceability. Implemented error recovery processes to handle network or API failures gracefully.',
    image: 'https://placehold.co/600x400/27ae60/FFFFFF.png?text=Shopify-Grist+Integration',
    noMedia: true,
    tags: ['Python', 'Shopify', 'API Integration', 'Data Synchronization', 'Automation'],
    category: 'E-commerce',
    link: 'https://github.com/Camci/Portfolio_Automations/tree/master/ecommerce_integration/shopify_grist'
  },
  {
    id: 8,
    title: 'Jewelry Product Weight Management Suite',
    description: 'Engineered specialized tools for jewelry product weight calculations and automated updates across product variants. Developed algorithms to convert weights between different gold karats (10K, 14K). Created automated weight update pipelines for thousands of products. Implemented validation to ensure data accuracy and consistency. Reduced manual data entry by 90% through automation. Built a product database with comprehensive metal type and weight specifications. Created specialized formulas that account for stone settings and other non-gold components. Enabled bulk processing capabilities to handle large product catalogs efficiently.',
    image: 'https://placehold.co/600x400/f1c40f/FFFFFF.png?text=Jewelry+Weight+Management',
    noMedia: true,
    tags: ['Python', 'Shopify', 'Data Processing', 'Product Management', 'Automation'],
    category: 'E-commerce',
    link: 'https://github.com/Camci/Portfolio_Automations/tree/master/ecommerce_integration/jewelry_weight_management'
  },
  {
    id: 9,
    title: 'Dynamic Pricing System',
    description: 'Built a system that automatically adjusts product pricing based on real-time gold market rates. Integrated with Kitco API for reliable gold price data. Implemented daily update cycles with error handling. Created flexible pricing rules based on product categories and metal types. Maintained profit margins despite market fluctuations. Developed customizable markup rules for different product categories and types. Created a dashboard for monitoring price changes and market trends. Implemented notification system for significant market movements. Established historical pricing database for trend analysis and forecasting.',
    image: 'https://placehold.co/600x400/16a085/FFFFFF.png?text=Dynamic+Pricing+System',
    noMedia: true,
    tags: ['Python', 'API Integration', 'Pricing Algorithms', 'E-commerce', 'Automation'],
    category: 'E-commerce',
    link: 'https://github.com/Camci/Portfolio_Automations/tree/master/ecommerce_integration/pricing_system'
  },
  {
    id: 10,
    title: 'Product Image Management System',
    description: 'Developed image processing tools to handle product variations and maintain visual consistency. Batch processing for resizing and optimizing product images. Automated image adjustments for different metal types (White Gold, Rose Gold). Quality verification and metadata management. Cross-platform image synchronization. Implemented intelligent image naming and organization system. Created bulk upload utilities with progress tracking and error recovery. Built automated watermarking with customizable positioning and opacity. Developed an image transformation pipeline for consistent styling across thousands of products.',
    image: 'https://placehold.co/600x400/7f8c8d/FFFFFF.png?text=Image+Processing+Tools',
    noMedia: true,
    tags: ['Python', 'Image Processing', 'Automation', 'Batch Processing', 'Metadata'],
    category: 'Python Automation',
    link: 'https://github.com/Camci/Portfolio_Automations/tree/master/ecommerce_integration/product_image_management'
  },
  {
    id: 11,
    title: 'Google Ads Performance Analytics',
    description: 'Built custom reporting tools to track and analyze Google Ads campaign performance. Comprehensive historical data analysis with data visualization and trend identification. API integration with secure authentication and rate limit handling. Custom metrics calculation and visualization for ROAS, conversion rates, and engagement. Automated reporting and insights generation with scheduled distribution. Implemented cross-campaign comparison and optimization suggestions. Created customizable dashboards for different stakeholder needs. Developed predictive modeling for campaign performance forecasting.',
    image: 'https://placehold.co/600x400/3498db/FFFFFF.png?text=Google+Ads+Analytics',
    noMedia: true,
    tags: ['Python', 'Google Ads API', 'Data Analytics', 'Reporting', 'Visualization'],
    category: 'Marketing Analytics',
    link: 'https://github.com/Camci/Portfolio_Automations/tree/master/marketing_analytics/google_ads_analytics'
  },  
  {
    id: 12,
    title: 'Product Data Management System',
    description: 'Built tools to manage complex product variants and metadata across multiple e-commerce platforms. Bulk title and description updates with pattern matching and replacement. Variant structure management and optimization for complex product configurations. Product option configuration and relationship mapping. Data consistency validation across platforms and channels. Implemented product taxonomy and hierarchical categorization. Created advanced search and filtering tools for quick product location. Developed version control for product data changes with rollback capability. Built import/export utilities for cross-platform product management.',
    image: 'https://placehold.co/600x400/8e44ad/FFFFFF.png?text=Product+Data+Management',
    noMedia: true,
    tags: ['Python', 'Data Management', 'E-commerce', 'Product Variants', 'Metadata'],
    category: 'Python Automation',
    link: 'https://github.com/Camci/Portfolio_Automations/tree/master/automation_tools/product_management'
  },
  {
    id: 13,
    title: 'CSV Data Processing Pipeline',
    description: 'Created efficient data processing workflows for large CSV datasets to handle complex data operations. Designed high-performance data transformation algorithms with minimal memory footprint. Implemented error handling and data validation with comprehensive error reporting. Created logging and monitoring systems for process transparency. Built visualization tools for data exploration and pattern recognition. Developed streaming processors for handling files larger than available memory. Created automated data cleansing and normalization routines. Implemented configurable data mapping between different schemas and formats. Built parallel processing capabilities for multi-core utilization.',
    image: 'https://placehold.co/600x400/c0392b/FFFFFF.png?text=CSV+Processing+Pipeline',
    noMedia: true,
    tags: ['Python', 'Data Processing', 'ETL', 'CSV', 'Big Data'],
    category: 'Python Automation',
    link: 'https://github.com/Camci/Portfolio_Automations/tree/master/automation_tools/csv_processing'
  }
];

// Filtered projects based on selected category
const filteredProjects = computed(() => {
  if (selectedCategory.value === 'All') {
    return projects;
  }
  return projects.filter(project => project.category === selectedCategory.value);
});

// Find project by ID
const findProjectById = (id) => {
  const projectId = parseInt(id);
  return projects.find(project => project.id === projectId) || null;
};

// Check for project ID in route params when component is mounted
onMounted(() => {
  if (route.params.projectId) {
    const project = findProjectById(route.params.projectId);
    if (project) {
      selectedProject.value = project;
      showModal.value = true;
    }
  }
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}

.grid > *:nth-child(1) { animation-delay: 0.1s; }
.grid > *:nth-child(2) { animation-delay: 0.2s; }
.grid > *:nth-child(3) { animation-delay: 0.3s; }
.grid > *:nth-child(4) { animation-delay: 0.4s; }
.grid > *:nth-child(5) { animation-delay: 0.5s; }
.grid > *:nth-child(6) { animation-delay: 0.6s; }
.grid > *:nth-child(7) { animation-delay: 0.7s; }
.grid > *:nth-child(8) { animation-delay: 0.8s; }
.grid > *:nth-child(9) { animation-delay: 0.9s; }
</style> 