<template>
  <div class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-4xl font-bold text-gray-800 mb-2">Chi Tiết Hồ Sơ Y Tế</h1>
      <p v-if="medicalRecord" class="text-gray-600">
        Bệnh nhân: <span class="font-semibold">{{ medicalRecord.patientId?.fullName }}</span>
      </p>
    </div>
    <div class="flex gap-3">
      <button
        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
        @click="$emit('edit')"
      >
        <i class="fa-solid fa-pen-to-square"></i>
        Chỉnh Sửa
      </button>
      <button
        class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
        @click="$emit('back')"
      >
        <i class="fa-solid fa-arrow-left"></i>
        Quay lại
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  medicalRecord: {
    type: Object,
    default: null,
  },
});

defineEmits(['back', 'edit']);
</script>
