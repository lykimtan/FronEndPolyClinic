<template>
  <HeaderPart />
  <DoctorNavBar :user-info="userStore.getUserInfo" />
  <router-view class="bg-[#2563EB]"> </router-view>
  <FooterPart />
</template>
<script setup>
import HeaderPart from '@/components/Doctor/HeaderPart.vue';
import DoctorNavBar from '@/components/Doctor/DoctorNavBar.vue';
import FooterPart from '@/components/Footer.vue';

import { useUserStore } from '@/stores/userStore';
import { onMounted } from 'vue';

const userStore = useUserStore();

onMounted(async () => {
  await userStore.fetchUserProfile();
  console.log('📄 Fetched user profile:', userStore.getUserInfo);
});
</script>
