<script setup>
import { onMounted, ref } from 'vue';
import { useDoctorStore } from '@/stores/DoctorStore';
const doctorStore = useDoctorStore();

const props = defineProps({
  specialization: {
    type: Object,
    default: () => ({
      name: '',
      description: '',
      symptom: '',
      image: '',
    }),
  },

  handleClick: {
    type: Function,
    default: () => {},
  },
});

const doctorList = ref([]);

onMounted(async () => {
  try {
    doctorList.value = await doctorStore.fetchDoctorBySpecialization(props.specialization._id);
    console.log('Fetched doctor schedules on specialization mount:', doctorList.value);
  } catch (error) {
    console.error('Error fetching doctor schedules on specialization mount:', error);
  }
});

const getImageUrl = path => {
  if (!path) return '/src/assets/images/specilization/DefaultSpec.jpg';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${path}`;
};
</script>

<template>
  <div class="w-[90%] mx-auto">
    <div
      class="flex flex-col md:flex-row bg-gradient-to-br from-gray-100 to-gray-300 rounded-3xl overflow-hidden shadow-2xl hover:-translate-y-1 hover:shadow-3xl transition-all duration-300 cursor-pointer"
      @click="handleClick"
    >
      <!-- Image Section -->
      <div
        class="flex-none md:w-[45%] bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-8 md:p-10"
      >
        <img
          :src="getImageUrl(specialization.image)"
          :alt="specialization.name"
          class="w-full h-full object-contain max-h-80 md:max-h-96 drop-shadow-xl"
        />
      </div>

      <!-- Info Section -->
      <div class="flex-1 bg-white p-8 md:p-10 flex flex-col justify-center gap-6">
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
          {{ specialization.name }}
        </h2>

        <div class="flex flex-col gap-2">
          <p class="text-base md:text-lg font-bold text-gray-800">Mô tả:</p>
          <p class="text-sm md:text-base leading-relaxed text-gray-600">
            {{ specialization.description }}
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <p class="text-base md:text-lg font-bold text-gray-800">Các triệu chứng thường gặp:</p>
          <p class="text-sm md:text-base leading-relaxed text-gray-600">
            {{ specialization.symptom }}
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <p class="text-base md:text-lg font-bold text-gray-800">Danh sách bác sĩ:</p>
          <div v-if="doctorList.length > 0" class="flex flex-wrap gap-3 mt-2">
            <div
              v-for="doctor in doctorList"
              :key="doctor._id"
              class="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg border border-blue-200 transition-colors"
            >
              <img
                v-if="doctor.avatar"
                :src="getImageUrl(doctor.avatar)"
                :alt="doctor.fullName"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div class="flex items-center gap-1">
                <i class="fa-solid fa-user-doctor text-blue-600 text-sm"></i>
                <span class="text-sm font-medium text-gray-800">{{ doctor.fullName }}</span>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500 italic mt-2">Chưa có bác sĩ nào</p>
        </div>

        <div class="flex flex-col gap-2">
          <p class="text-base md:text-lg font-bold text-gray-800">Số lượng bác sĩ của khoa:</p>
          <p class="text-3xl md:text-4xl font-black text-red-500">{{ doctorList.length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Custom shadow for better effect */
.shadow-3xl {
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}
</style>
