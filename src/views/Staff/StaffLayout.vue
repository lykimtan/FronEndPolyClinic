<template>
  <HeaderStaff />
  <NavBarStaff :user-info="userStore.getUserInfo" />
  <router-view></router-view>
  <FooterPart />
</template>

<script setup>
import HeaderStaff from '@/components/Staff/HeaderStaff.vue';
import NavBarStaff from '@/components/Staff/NavBarStaff.vue';
import FooterPart from '@/components/Footer.vue';
//import store
import { useUserStore } from '@/stores/userStore';
import { useSpecializationStore } from '@/stores/specializationStore';
import { onMounted } from 'vue';

const userStore = useUserStore();
const storeSpecialization = useSpecializationStore();

onMounted(async () => {
  await userStore.fetchUserProfile();
  console.log('Fetched user profile:', userStore.getUserInfo);
  await storeSpecialization.fetchSpecializations();
  console.log('Specializations fetched in HomeView: ', storeSpecialization.getAll);
});
</script>
