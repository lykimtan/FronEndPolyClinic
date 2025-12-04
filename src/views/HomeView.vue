<script setup>
import ListSpecialization from '@/components/ListSpecialization.vue';
import FuturedDoctorsList from '@/components/FuturedDoctorsList.vue';
import { useRouter } from 'vue-router';

import Advertisement from '@/components/Advertisement.vue';
import FandA from '@/components/FandA.vue';
import { useSpecializationStore } from '@/stores/specializationStore';
import { useRatingStore } from '@/stores/RatingStore';

const router = useRouter();
import { onMounted, computed } from 'vue';
const storeSpecialization = useSpecializationStore();
const ratingStore = useRatingStore();

onMounted(async () => {
  await storeSpecialization.fetchSpecializations();

  // fetch top rated doctors (with rating >= 4.5)
  await ratingStore.fetchTopRatedDoctors(10, 4.5);
});

const specializations = computed(() => storeSpecialization.getAll);

function handleGoToDetail(specializationId) {
  router.push({ name: 'SpecializationDetail', params: { id: specializationId } });
}

// Get top rated doctors from rating store
const doctors = computed(() => {
  return ratingStore.getTopRatedDoctors;
});
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
