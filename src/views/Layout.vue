<script setup>
import NavBar from '@/components/NavBar.vue';
import FooterPart from '@/components/Footer.vue';
import NavBarStaff from '@/components/Staff/NavBarStaff.vue';
import NavBarDoctor from '@/components/Doctor/DoctorNavBar.vue';
import HeaderPartDoctor from '@/components/Doctor/HeaderPart.vue';
import HeaderPartStaff from '@/components/Staff/HeaderStaff.vue';

import HeaderPart from '@/components/HeaderPart.vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const userInfo = userStore.getUserInfo ? userStore.getUserInfo : null;
console.log('User Info in HomeView:', userInfo);
</script>

<template>
  <div v-if="userInfo.role === 'staff'">
    <HeaderPartStaff />

    <NavBarStaff :user-info="userInfo" />
  </div>

  <div v-else-if="userInfo.role === 'doctor'">
    <HeaderPartDoctor />

    <NavBarDoctor :user-info="userInfo" />
  </div>

  <div v-else>
    <HeaderPart />

    <NavBar :user-info="userInfo" />
  </div>

  <router-view></router-view>
  <FooterPart />
</template>
