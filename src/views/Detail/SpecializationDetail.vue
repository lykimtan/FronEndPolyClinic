<template>
  <div class="mx-auto my-8 p-6 bg-white rounded-xl shadow-2xl">
    <div v-if="specialization" class="grid md:grid-cols-2 gap-8 items-center">
      <div class="md:order-1 order-2">
        <img
          :src="getImageUrl(specialization.image)"
          :alt="specialization.name"
          class="w-[90%] object-cover object-center rounded-lg shadow-lg mb-6 border-4 border-gray-100"
        />
      </div>

      <div class="md:order-2 order-1">
        <h1 class="text-4xl font-extrabold mb-3 text-sky-700 border-b pb-2 border-gray-200">
          {{ specialization.name }}
        </h1>

        <p class="mt-4 text-gray-700 leading-relaxed text-lg whitespace-pre-line">
          {{ specialization.description }}
        </p>
        <p class="mt-4 text-gray-700 leading-relaxed text-lg whitespace-pre-line">
          <span class="font-semibold">Triệu chứng thường gặp:</span>
          {{ specialization.symptom }}
        </p>
      </div>
    </div>

    <!-- display list doctor -->
    <div v-if="doctors && doctors.length > 0">
      <DoctorItem
        v-for="doctor in doctors"
        :key="doctor._id || doctor.id"
        :doctor="doctor"
        :get-img-url="getImageUrl"
      />
    </div>

    <!-- Empty state when no doctors -->
    <div v-else class="text-center py-16 mt-8">
      <i class="fa-solid fa-user-doctor text-gray-300 text-6xl mb-4"></i>
      <h3 class="text-2xl font-bold text-gray-600 mb-2">Chưa có bác sĩ thuộc khoa này</h3>
      <p class="text-gray-500">
        Hiện tại chưa có bác sĩ nào trong chuyên khoa này. Vui lòng quay lại sau.
      </p>
    </div>
  </div>
</template>
<script setup>
// import components
import DoctorItem from '@/components/DoctorItem.vue';
import { useUserStore } from '@/stores/userStore';
import { useSpecializationStore } from '@/stores/specializationStore';
import { useDoctorStore } from '@/stores/DoctorStore';
import { onMounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const specializationStore = useSpecializationStore();
const userStore = useUserStore();
const doctorStore = useDoctorStore();
const userInfo = userStore.getUserInfo ? userStore.getUserInfo : null;

const getImageUrl = path => {
  if (!path) return '/src/assets/images/specilization/DefaultSpec.jpg';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${path}`;
};

const specialization = ref(null);
const doctors = ref([]);

onMounted(async () => {
  const id = route.params.id;
  const res = await specializationStore.fetchSepecializationById(id);
  const docsRes = await doctorStore.fetchDoctorBySpecialization(id);
  // normalize possible response shapes
  const docsData = docsRes?.data || docsRes;
  doctors.value = Array.isArray(docsData) ? docsData : docsData?.items || [];
  console.log('Doctors in this Specialization:', doctors.value);
  // fetchSepecializationById returns the specialization object (res or res.data)
  specialization.value = res?.data || res || null;
  console.log('Fetched Specialization Data:', specialization.value);
});

// When route param changes (including Back/Forward), re-fetch the specialization
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) {
      specializationStore.fetchSepecializationById(newId).then(res => {
        specialization.value = res?.data || res || null;
      });
      doctorStore.fetchDoctorBySpecialization(newId).then(docsRes => {
        const docsData = docsRes?.data || docsRes;
        doctors.value = Array.isArray(docsData) ? docsData : docsData?.items || [];
        console.log('Doctors in this Specialization after route change:', doctors.value);
      });
    }
  }
);

console.log('User Info in SpecializationDetail:', userInfo);
</script>
