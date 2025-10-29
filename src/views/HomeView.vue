<script setup>
import NavBar from '@/components/NavBar.vue';
import ListSpecialization from '@/components/ListSpecialization.vue';
import FuturedDoctorsList from '@/components/FuturedDoctorsList.vue';
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
  <div>
    <div class="relative w-full h-100 bg-[url('/src/assets/background.avif')] bg-cover bg-center">
      <div class="absolute inset-0 bg-black/60"></div>
      <div
        class="relative z-10 flex items-center justify-center h-full text-white text-3xl md:text-5xl font-semibold"
      >
        <img class="w-50" src="../assets/HealthCareLight.png" alt="" />
        <h2>
          HealthMate <br />
          Simple care, better heath
        </h2>
      </div>
    </div>
  </div>
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
