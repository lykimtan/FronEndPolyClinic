<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
    <!-- Header with gradient background -->
    <div class="h-24 bg-gradient-to-br from-blue-500 to-blue-600"></div>

    <!-- Content -->
    <div class="px-6 pb-6">
      <!-- Avatar -->
      <div class="flex justify-center -mt-12 mb-4">
        <img
          :src="getAvatarUrl(doctor.avatar)"
          :alt="doctor.fullName"
          class="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
        />
      </div>

      <!-- Doctor Name -->
      <h3 class="text-center text-2xl font-bold text-gray-800 mb-1">
        {{ doctor.fullName }}
      </h3>

      <!-- Years of Experience -->
      <div class="text-center mb-6">
        <span
          class="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium"
        >
          <i class="fa-solid fa-briefcase mr-2"></i>
          {{ doctor.yearsOfExperience }} năm kinh nghiệm
        </span>
      </div>

      <!-- Specializations -->
      <div class="mb-6">
        <p class="text-xs font-bold text-gray-500 uppercase mb-3">Chuyên khoa</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-if="specializationName"
            class="inline-block bg-green-100 text-green-800 px-3 py-1.5 rounded-lg text-sm font-medium"
          >
            {{ specializationName }}
          </span>
          <span v-else class="text-gray-400 italic text-sm">Chưa cập nhật</span>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-200 my-6"></div>

      <!-- Contact Information -->
      <div class="space-y-4">
        <!-- Email -->
        <div class="flex items-start gap-3">
          <div class="flex-none w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <i class="fa-solid fa-envelope text-blue-600"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold text-gray-500 uppercase mb-1">Email</p>
            <p class="text-sm text-gray-700 break-all">{{ doctor.email || 'Chưa cập nhật' }}</p>
          </div>
        </div>

        <!-- Phone -->
        <div class="flex items-start gap-3">
          <div class="flex-none w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <i class="fa-solid fa-phone text-green-600"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold text-gray-500 uppercase mb-1">Điện thoại</p>
            <p class="text-sm text-gray-700">{{ doctor.phone || 'Chưa cập nhật' }}</p>
          </div>
        </div>

        <!-- License Number -->
        <div v-if="doctor.licenseNumber" class="flex items-start gap-3">
          <div
            class="flex-none w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"
          >
            <i class="fa-solid fa-certificate text-purple-600"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold text-gray-500 uppercase mb-1">Chứng chỉ hành nghề</p>
            <p class="text-sm text-gray-700">{{ doctor.licenseNumber }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  doctor: {
    type: Object,
    default: () => ({
      _id: '',
      fullName: 'N/A',
      email: '',
      phone: '',
      avatar: '',
      yearsOfExperience: 0,
      licenseNumber: '',
      specializationIds: [],
    }),
  },

  specializationName: {
    type: String,
    default: 'N/A',
  },
});

const getAvatarUrl = avatar => {
  if (!avatar) return '/src/assets/images/avartar.jpg';
  if (avatar.startsWith('http')) return avatar;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${avatar}`;
};
</script>

<style scoped>
.bg-gradient-to-br {
  background: linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(37, 99, 235) 100%);
}
</style>
