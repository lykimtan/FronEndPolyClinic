import { createWebHistory, createRouter } from 'vue-router';
// import { authGuard } from './authGuard';
const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('../views/Layout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/HomeView.vue'),
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
        path: '/specialization/:id',
        name: 'SpecializationDetail',
        component: () => import('../views/Detail/SpecializationDetail.vue'),
      },
      {
        path: '/doctor/:id',
        name: 'DoctorProfile',
        component: () => import('../views/Detail/DoctorProfileDetail.vue'),
      },
    ],
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

  //admin
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin/AdminLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/Admin/DashBoard.vue'), // Tải vào router-view BÊN TRONG AdminLayout
      },
      {
        path: 'role-request/:id',
        name: 'AdminRoleRequests',
        component: () => import('../views/Admin/RoleRequestDetail.vue'),
      },
    ],
  },

  //detail screen
  //specialization detail
  //STAFF

  {
    path: '/staff',
    name: 'Staff',
    component: () => import('../views/Staff/StaffLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'StaffDashboard',
        component: () => import('../views/Staff/staffDashBoard.vue'),
        meta: { requiresAuth: true, role: 'staff' },
      },

      {
        path: 'specialization/edit/:id',
        name: 'EditSpecialization',
        component: () => import('../views/Staff/CreateUpdateSpecialization.vue'),
      },

      {
        path: 'specialization/create',
        name: 'CreateSpecialization',
        component: () => import('../views/Staff/CreateUpdateSpecialization.vue'),
      },

      {
        path: 'recurring-schedule-management',
        name: 'RecurringScheduleManagement',
        component: () => import('../views/Staff/RecurringScheduleManagement.vue'),
        meta: { requiresAuth: true, role: 'staff' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
