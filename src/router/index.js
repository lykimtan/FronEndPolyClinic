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

  {
    path: '/userProfile',
    name: 'UserProfile',
    component: () => import('../views/User/UserProfile.vue'),
  },

  {
    path: '/editProfile',
    name: 'EditProfile',
    component: () => import('../views/User/EditProfile.vue'),
  },

  {
    path: '/changePassword',
    name: 'ChangePassword',
    component: () => import('../views/User/ChangePassword.vue'),
  },

  {
    path: '/role-requests',
    name: 'RoleRequests',
    component: () => import('../views/User/RoleRequested.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
