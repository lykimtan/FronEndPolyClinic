<template>
  <div>
    <!-- header -->
    <div class="flex items-center justify-center w-full my-8">
      <div class="flex-1 h-[2px] bg-black"></div>
      <div class="mx-4 bg-gray-300 font-extrabold text-xl px-16 py-4 rounded-full shadow-md">
        <h2 class="text-2xl font-extrabold text-sky-700 text-center">
          Bác sĩ chuyên khoa
          <br />
          {{ doctor.fullName }}
        </h2>
      </div>
      <div class="flex-1 h-[2px] bg-black"></div>
    </div>
    <!-- end-header -->
    <div class="bg-gray-300 flex items-center justify-center p-4">
      <div
        class="grid md:grid-cols-3 bg-blue-400 rounded-lg overflow-hidden shadow-xl w-[90%] max-h-[150] cursor-pointer hover:shadow-2xl transition-shadow duration-300"
        @click="navigateToDoctorProfile"
      >
        <!-- Cột ảnh -->
        <div class="relative group md:col-span-1">
          <img
            :src="getImgUrl(doctor.avatar)"
            :alt="doctor.fullName || 'Doctor Avatar'"
            class="w-full h-full object-cover object-center"
          />

          <!-- Overlay -->
          <div
            class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out"
          >
            <h2 class="text-2xl font-bold mb-2">{{ doctor.fullName }}</h2>
            <p class="text-lg">
              Chuyên khoa: {{ doctor.specializationIds.map(spec => spec.name).join(', ') }}
            </p>
            <p class="text-sm mt-2 text-gray-200">
              {{ doctor.yearsOfExperience }} years of experience
            </p>
          </div>
        </div>

        <!-- Cột nội dung -->
        <div class="flex items-center justify-center text-center p-8">
          <h1 class="text-2xl font-semibold text-white">Choose time to make an appointment</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  doctor: {
    type: Object,
    required: true,
  },

  getImgUrl: {
    type: Function,
    required: true,
  },
});

const navigateToDoctorProfile = () => {
  router.push({
    name: 'DoctorProfile',
    params: { id: props.doctor._id || props.doctor.id },
  });
};
</script>
