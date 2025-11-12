<script setup>
import ListSpecialization from '@/components/ListSpecialization.vue';
import FuturedDoctorsList from '@/components/FuturedDoctorsList.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import Advertisement from '@/components/Advertisement.vue';
import FandA from '@/components/FandA.vue';
import { useDoctorStore } from '@/stores/DoctorStore';
import { useSpecializationStore } from '@/stores/specializationStore';

const router = useRouter();
import { onMounted, computed } from 'vue';
const storeSpecialization = useSpecializationStore();

onMounted(async () => {
  // fetch and populate specializations into the store when HomeView mounts
  await storeSpecialization.fetchSpecializations();
  console.log('Specializations fetched in HomeView: ', storeSpecialization.getAll);
});
// make specializations reactive so it updates after fetchSpecializations completes
const specializations = computed(() => storeSpecialization.getAll);
const store = useDoctorStore();
const userStore = useUserStore();

const userInfo = userStore.getUserInfo ? userStore.getUserInfo : null;
console.log('User Info in HomeView:', userInfo);

function handleGoToDetail(specializationId) {
  router.push({ name: 'SpecializationDetail', params: { id: specializationId } });
}

const doctors = store.getDoctorByRating;
</script>

<template>
  <ListSpecialization :specializations="specializations" @go-to-detail="handleGoToDetail" />

  <!-- Advertisement Section -->
  <Advertisement />

  <!-- Featured Doctors Section -->
  <FuturedDoctorsList :doctors="doctors" />

  <!-- F&A Section -->
  <FandA />
</template>
