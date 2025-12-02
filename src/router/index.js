import { createWebHistory, createRouter } from 'vue-router';
import { authGuard } from '../utils/authGuard';

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
      {
        path: '/appointment/create',
        name: 'CreateAppointment',
        component: () => import('../views/CreateAppointment.vue'),
      },
      {
        path: '/appointment/schedule',
        name: 'ScheduleAppointment',
        component: () => import('../views/ScheduleAppointment.vue'),
      },
      {
        path: '/my-appointments',
        name: 'MyAppointments',
        component: () => import('../views/MyAppointment.vue'),
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

  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('../views/Forbidden.vue'),
  },

  //admin
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/Admin/DashBoard.vue'), // Tải vào router-view BÊN TRONG AdminLayout
        meta: { requiresAuth: true, role: 'admin' },
      },
      {
        path: 'role-request/:id',
        name: 'AdminRoleRequests',
        component: () => import('../views/Admin/RoleRequestDetail.vue'),
        meta: { requiresAuth: true, role: 'admin' },
      },
    ],
  },

  //doctor
  {
    path: '/doctor',
    name: 'Doctor',
    component: () => import('../views/Doctor/DoctorLayout.vue'),
    meta: { requiresAuth: true, role: 'doctor' },
    children: [
      {
        path: 'dashboard',
        name: 'DoctorDashboard',
        component: () => import('../views/Doctor/DoctorDashboard.vue'),
        meta: { requiresAuth: true, role: 'doctor' },
      },
      {
        path: 'today-appointments/',
        name: 'AppointmentsToday',
        component: () => import('../views/Doctor/AppointmentsToday.vue'),
        meta: { requiresAuth: true, role: 'doctor' },
      },

      {
        path: 'all-appointments/',
        name: 'AllAppointments',
        component: () => import('../views/Doctor/AllAppointments.vue'),
        meta: { requiresAuth: true, role: 'doctor' },
      },

      {
        path: 'appointment/:id',
        name: 'DetailAppointment',
        component: () => import('../views/Doctor/DetailAppointment.vue'),
        meta: { requiresAuth: true, role: 'doctor' },
      },

      //examination room
      {
        path: 'examination-room/:id',
        name: 'ExaminationRoom',
        component: () => import('../views/Doctor/ExaminationRoom.vue'),
        meta: { requiresAuth: true, role: 'doctor' },
      },
      {
        path: 'medical-record/:id',
        name: 'DetailMedicalRecord',
        component: () => import('../views/Doctor/DetailMedicalRecord.vue'),
        meta: { requiresAuth: true, role: 'doctor' },
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
    meta: { requiresAuth: true, role: 'staff' },
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

// Add global navigation guard
router.beforeEach((to, from, next) => {
  const result = authGuard(to);

  if (result === true) {
    next();
  } else {
    next(result);
  }
});

router.afterEach((to, from) => {
  window.scrollTo(0, 0);
});

export default router;
