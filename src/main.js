import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import './assets/main.css';

// Import views
import Home from './views/Home.vue';
import About from './views/About.vue';
import Resume from './views/Resume.vue';
import Projects from './views/Projects.vue';
import Contact from './views/Contact.vue';
import ModelCustomizer from './views/ModelCustomizer.vue';

// Define routes
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/resume', component: Resume },
  { path: '/projects', component: Projects },
  { path: '/projects/:projectId', component: Projects },
  { path: '/contact', component: Contact },
  { path: '/model-customizer', component: ModelCustomizer },
];

// Create router instance
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0, behavior: 'smooth' };
  },
});

// Create and mount the Vue application
const app = createApp(App);
app.use(router);
app.mount('#app');
