<script setup>
import NavBar from '@/components/NavBar.vue';
import ListSpecialization from '@/components/ListSpecialization.vue';
import FuturedDoctorsList from '@/components/FuturedDoctorsList.vue';
import HeaderPart from '@/components/HeaderPart.vue';
import { useUserStore } from '@/stores/userStore';
import Advertisement from '@/components/Advertisement.vue';
import FandA from '@/components/FandA.vue';
import { useDoctorStore } from '@/stores/DoctorStore';
import { useSpecializationStore } from '@/stores/specializationStore';
const storeSpecialization = useSpecializationStore();
const specializations = storeSpecialization.getAll;
const store = useDoctorStore();
const userStore = useUserStore();

const userInfo = userStore.getUserInfo ? userStore.getUserInfo : null;
console.log('User Info in HomeView:', userInfo);

const doctors = store.getDoctorByRating;
</script>

<template>
  <HeaderPart />
  <NavBar :user-info="userInfo" />
  <ListSpecialization :specializations="specializations" />

  <!-- Advertisement Section -->
  <Advertisement />

  <!-- Featured Doctors Section -->
  <FuturedDoctorsList :doctors="doctors" />

  <!-- F&A Section -->
  <FandA />

  <div class="h-800"></div>
</template>
