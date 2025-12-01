<template>
  <div>
    <!-- Page Header -->
    <div class="bg-secondary text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">My Resume</h1>
        <div class="w-20 h-1 bg-primary mx-auto mb-6"></div>
        <p class="text-xl text-white/80 max-w-3xl mx-auto">
          A detailed overview of my professional experience, education, and technical skills.
        </p>
        <div class="mt-8">
          <a href="https://github.com/Camci/personal-website/raw/master/MustafaCamci_CV.pdf" download class="btn bg-white text-secondary hover:bg-white/90">
            <i class="fas fa-download mr-2"></i> Download PDF
          </a>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Left Column: Skills and Education -->
        <div class="lg:col-span-1">
          <!-- Skills Section -->
          <div class="mb-12">
            <h2 class="text-2xl font-bold text-secondary mb-6 flex items-center">
              <span class="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <i class="fas fa-code"></i>
              </span>
              Technical Skills
            </h2>
            
            <div class="space-y-6">
              <div v-for="(skills, category) in skillCategories" :key="category">
                <h3 class="text-lg font-semibold text-secondary mb-3">{{ category }}</h3>
                <div class="space-y-4">
                  <div v-for="skill in skills" :key="skill.name" class="relative">
                    <div class="flex justify-between mb-1">
                      <span class="text-secondary">{{ skill.name }}</span>
                      <span class="text-primary font-medium">{{ skill.level }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-primary h-2 rounded-full" :style="{ width: `${skill.level}%` }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Education Section -->
          <div>
            <h2 class="text-2xl font-bold text-secondary mb-6 flex items-center">
              <span class="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <i class="fas fa-graduation-cap"></i>
              </span>
              Education
            </h2>
            
            <div class="space-y-8">
              <div v-for="education in educationHistory" :key="education.degree" class="relative border-l-2 border-gray-200 pl-6 pb-6">
                <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary"></div>
                <span class="text-sm text-primary font-medium">{{ education.period }}</span>
                <h3 class="text-lg font-bold text-secondary mt-1">{{ education.degree }}</h3>
                <p class="text-secondary/80 mb-2">{{ education.institution }}</p>
                <p class="text-gray-600">{{ education.description }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Column: Work Experience -->
        <div class="lg:col-span-2">
          <h2 class="text-2xl font-bold text-secondary mb-6 flex items-center">
            <span class="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mr-3">
              <i class="fas fa-briefcase"></i>
            </span>
            Professional Experience
          </h2>
          
          <div class="space-y-12">
            <div v-for="experience in workExperience" :key="experience.title" class="relative">
              <div class="card p-8">
                <div class="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <h3 class="text-xl font-bold text-secondary">{{ experience.title }}</h3>
                    <p class="text-primary font-medium">{{ experience.company }}</p>
                  </div>
                  <div class="bg-gray-100 px-4 py-2 rounded-md text-sm text-secondary font-medium mt-2 md:mt-0 inline-block">
                    {{ experience.period }}
                  </div>
                </div>
                
                <p class="text-gray-600 mb-6">{{ experience.description }}</p>
                
                <div>
                  <h4 class="font-semibold text-secondary mb-2">Key Responsibilities:</h4>
                  <ul class="list-disc pl-5 space-y-1 text-gray-600">
                    <li v-for="(responsibility, index) in experience.responsibilities" :key="index">
                      {{ responsibility }}
                    </li>
                  </ul>
                </div>
                
                <div class="mt-6 pt-4 border-t border-gray-100">
                  <div class="flex flex-wrap gap-2">
                    <span v-for="tech in experience.technologies" :key="tech" class="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-md">
                      {{ tech }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Certifications Section -->
    <div class="section bg-gray-50">
      <h2 class="text-2xl font-bold text-secondary mb-12 text-center">Certifications & Additional Training</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="cert in certifications" :key="cert.name" class="card p-6">
          <div class="flex items-start">
            <div class="bg-primary/10 text-primary p-3 rounded-lg mr-4">
              <i :class="cert.icon"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-secondary">{{ cert.name }}</h3>
              <p class="text-gray-500 text-sm mb-2">{{ cert.issuer }} • {{ cert.date }}</p>
              <p class="text-gray-600">{{ cert.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- CTA Section -->
    <div class="section bg-primary text-white text-center">
      <h2 class="text-3xl font-bold mb-6">Interested in working together?</h2>
      <p class="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
        Let's connect and discuss how my skills and experience can benefit your project.
      </p>
      <router-link to="/contact" class="btn bg-white text-primary hover:bg-white/90">
        Get In Touch
      </router-link>
    </div>
  </div>
</template>

<script setup>
// Skill categories
const skillCategories = {
  'Programming Languages': [
    { name: 'JavaScript', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'Python', level: 95 },
    { name: 'PHP', level: 50 },
    { name: 'C++', level: 70 }
  ],
  'Frontend Development': [
    { name: 'Vue.js', level: 90 },
    { name: 'React', level: 95 },
    { name: 'Next.js', level: 95 },
    { name: 'HTML5', level: 95 },
    { name: 'CSS3', level: 95 },
    { name: 'Shopify Liquid', level: 95 }
  ],
  'Backend & Cloud': [
    { name: 'Node.js', level: 85 },
    { name: 'Express.js', level: 90 },
    { name: 'AWS', level: 85 },
    { name: 'Serverless', level: 85 },
    { name: 'GraphQL/REST', level: 90 },
    { name: 'MySQL', level: 80 },
    { name: 'NoSQL', level: 90 },
    { name: 'Docker', level: 80 }
  ],
  'ML & Data Science': [
    { name: 'Machine Learning', level: 80 },
    { name: 'Computer Vision', level: 85 },
    { name: 'Data Analytics', level: 80 },
    { name: 'AI Integration', level: 75 }
  ],
  'Tools & Version Control': [
    { name: 'Git', level: 95 }
  ]
};

// Education history
const educationHistory = [
  {
    period: '2016 - 2021',
    degree: 'Bachelor of Science in Mechanical Engineering',
    institution: 'Koç University',
    description: 'Focused on artificial intelligence and machine learning applications in mechanical systems and biomedical engineering.'
  }
];

// Work experience
const workExperience = [
  {
    title: 'Freelance Shopify Developer',
    company: 'Self-employed',
    period: 'Nov 2021 - Present',
    description: 'Specializing in Shopify theme and app development, creating custom e-commerce solutions for clients.',
    responsibilities: [
      'Shopify theme development and customization, creating responsive and aesthetic e-commerce websites that meet unique branding and functional requirements',
      'Shopify app development, delivering custom solutions to enhance functionality and user experience',
      'Developing custom online stores with reusable components for managing bulk orders for wholesale',
      'Proficient in Storefront, Admin AJAX, GraphQL, and REST APIs for efficient data analysis',
      'Built Python-based data distribution models, enhancing analytics with Google Ads and Meta APIs',
      'Creating headless Shopify stores using Next.js and Shopify Storefront API',
      'Creating Internal Data management tools with Next.js and AWS deployment solutions (Dockerized)',
      "Creationg Invoicing and reporting tools with Next.js and AWS deployment solutions (Dockerized)"

    ],
    technologies: ['Shopify', 'Liquid', 'JavaScript', 'Python', 'GraphQL', 'REST API', 'HTML/CSS', 'AJAX']
  },
  {
    title: 'Tech Lead/Full Stack Developer',
    company: 'Mosaique',
    period: 'Sep 2023 - Present',
    description: 'Tech lead and co-founder of an AWS-based AI Marketing tool.',
    responsibilities: [
      'Leading development of AI-powered marketing tools',
      'Building and maintaining AWS-based infrastructure',
      'Implementing serverless architecture solutions',
      'Designing and developing user interfaces and backend systems',
      'Coordinating technical aspects of the product roadmap'
    ],
    technologies: ['AWS Lambda', 'DynamoDB', 'API Gateway', 'Amplify', 'Cognito', 'JavaScript', 'React']
  },
  {
    title: 'Autonomous Driving Systems Engineer',
    company: 'Ford Otosan',
    period: 'Sep 2021 - July 2023',
    description: 'Researched and developed autonomous driving systems and vehicle HMI features.',
    responsibilities: [
      'Researching and developing autonomous driving systems and autonomous vehicle HMI features',
      'Improvement of camera-based Driver Monitoring System (DMS) algorithms capable of detecting drowsiness or distraction',
      'Actively contributed to and coordinated HADRIAN (an EU Horizon 2020 project) deliverables',
      'Experience as a team member in Scrum and Agile management methodologies',
      'Implementing and testing computer vision algorithms for autonomous systems'
    ],
    technologies: ['Python', 'Computer Vision', 'Machine Learning', 'Autonomous Systems', 'C++', 'Scrum']
  },
  {
    title: 'Frontend Developer',
    company: 'BuldunGO',
    period: '2021 - 2022',
    description: 'Developed e-commerce web solutions and admin panel interfaces.',
    responsibilities: [
      'E-commerce web design and development',
      'Building and maintaining admin panel interfaces',
      'Creating responsive user interfaces',
      'Implementing frontend components and features',
      'Collaborating with backend developers for API integration'
    ],
    technologies: ['JavaScript', 'Vue.js', 'HTML/CSS', 'API Integration', 'E-commerce']
  },
  {
    title: 'Research Assistant',
    company: 'Koç University Bioinformatics Lab',
    period: '2020 - 2021',
    description: 'Applying AI and machine learning techniques for bioinformatics research.',
    responsibilities: [
      'Identifying disease types using Python-based artificial intelligence models',
      'Processing and analyzing biological datasets',
      'Developing algorithms for medical data classification',
      'Collaborating with researchers and scientists',
      'Contributing to academic publications and research findings'
    ],
    technologies: ['Python', 'Machine Learning', 'AI', 'Data Analysis', 'Bioinformatics']
  }
];

// Certifications
const certifications = [
  {
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: '2023',
    description: 'Expertise in designing and deploying scalable, highly available systems on AWS.',
    icon: 'fab fa-aws fa-2x'
  },
  {
    name: 'Shopify Partner Developer',
    issuer: 'Shopify',
    date: '2022',
    description: 'Certified for developing custom Shopify themes and applications to enhance e-commerce functionality.',
    icon: 'fab fa-shopify fa-2x'
  },
  {
    name: 'Google Cybersecurity Professional',
    issuer: 'Google',
    date: '2024',
    description: 'Comprehensive training in cybersecurity fundamentals, intrusion detection, SIEM, network security, and security operations.',
    icon: 'fab fa-google fa-2x'
  },
  {
    name: 'Professional Scrum Master I',
    issuer: 'Scrum.org',
    date: '2022',
    description: 'Completed comprehensive Scrum training and certification for implementing Agile methodologies in team environments.',
    icon: 'fas fa-tasks fa-2x'
  },
  {
    name: 'Generative AI with Large Language Models',
    issuer: 'Amazon Web Services (AWS)',
    date: '2024',
    description: 'Advanced training in developing and implementing generative AI applications using large language models.',
    icon: 'fas fa-robot fa-2x'
  },
  {
    name: 'Vue.js Advanced Developer',
    issuer: 'Vue Mastery',
    date: '2022',
    description: 'Mastery of advanced Vue.js concepts including Vuex, composition API, and performance optimization.',
    icon: 'fab fa-vuejs fa-2x'
  },
  {
    name: 'Introduction to Artificial Intelligence',
    issuer: 'IBM',
    date: '2024',
    description: 'Foundational knowledge of AI concepts, methodologies, and practical applications using Python.',
    icon: 'fas fa-microchip fa-2x'
  },
  {
    name: 'NYU Startup Bootcamp',
    issuer: 'NYU Entrepreneurial Institute',
    date: '2024',
    description: 'Intensive training in startup development, business analysis, project management, and entrepreneurial problem-solving.',
    icon: 'fas fa-university fa-2x'
  },
  {
    name: 'Advanced Learning Algorithms',
    issuer: 'DeepLearning.AI - Standford University',
    date: '2024',
    description: 'Advanced techniques in machine learning algorithms, neural networks, and deep learning using PyTorch and Python.',
    icon: 'fas fa-brain fa-2x'
  }
];
</script>
