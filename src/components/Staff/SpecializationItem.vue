<template>
  <div class="mx-auto bg-blue-50 rounded-2xl overflow-hidden shadow-lg border border-blue-100 m-10">
    <!-- Nội dung chính -->
    <div class="flex items-center p-5">
      <!-- Ảnh -->
      <img
        :src="getImageUrl(props.specialization.image)"
        alt="specialization image"
        class="w-40 h-40 object-cover rounded-xl border-2 border-blue-200 shadow-sm"
      />

      <!-- Thông tin -->
      <div class="ml-6 space-y-2 text-gray-700">
        <h2 class="text-2xl font-semibold text-blue-700">
          {{ props.specialization.name }}
        </h2>
        <p class="text-base">
          <span class="font-medium text-blue-600">Mô tả:</span>
          {{ props.specialization.description }}
        </p>
        <p class="text-base">
          <span class="font-medium text-blue-600">Triệu chứng:</span>
          {{ props.specialization.symptom }}
        </p>
      </div>
    </div>

    <!-- Nút Update -->
    <div class="bg-blue-200 text-center py-3">
      <button
        class="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        @click="$emit('edit', props.specialization.id || props.specialization._id)"
      >
        Update
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
  specialization: {
    type: Object,
    required: true,
  },
});
defineEmits(['edit']);

const getImageUrl = path => {
  if (!path) return '/src/assets/images/specilization/DefaultSpec.jpg';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${path}`;
};
</script>
