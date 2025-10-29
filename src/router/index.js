import { createWebHistory, createRouter } from 'vue-router';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Auth/Login.vue'),
  },

  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Auth/Register.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
