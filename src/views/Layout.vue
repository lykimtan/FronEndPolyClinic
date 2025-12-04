<script setup>
import NavBar from '@/components/NavBar.vue';
import FooterPart from '@/components/Footer.vue';
import NavBarStaff from '@/components/Staff/NavBarStaff.vue';
import NavBarDoctor from '@/components/Doctor/DoctorNavBar.vue';
import HeaderPartDoctor from '@/components/Doctor/HeaderPart.vue';
import HeaderPartStaff from '@/components/Staff/HeaderStaff.vue';

import HeaderPart from '@/components/HeaderPart.vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const userStore = useUserStore();
const router = useRouter();

const userInfo = userStore.getUserInfo;

// Redirect to login if not authenticated
onMounted(() => {
  if (!userInfo) {
    router.push({ name: 'Login' });
  }
});
</script>

<template>
  <div v-if="userInfo?.role === 'staff'">
    <HeaderPartStaff />

    <NavBarStaff :user-info="userInfo" />
  </div>

  <div v-else-if="userInfo?.role === 'doctor'">
    <HeaderPartDoctor />

    <NavBarDoctor :user-info="userInfo" />
  </div>

  <div v-else-if="userInfo">
    <HeaderPart />

    <NavBar :user-info="userInfo" />
  </div>

  <router-view></router-view>
  <FooterPart />
</template>
