<template>
  <div
    class="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:scale-105 transform"
    @click="viewDetail"
  >
    <!-- Header with gradient -->
    <div class="h-3 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

    <!-- Content -->
    <div class="p-6">
      <!-- Date & Doctor -->
      <div class="flex items-start justify-between mb-4">
        <div>
          <p class="text-xs text-gray-500 font-semibold uppercase mb-1">Ngày khám</p>
          <p class="text-lg font-bold text-gray-800">
            {{ formatDate(medicalRecord.createdAt) }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-xs text-gray-500 font-semibold uppercase mb-1">Bác sĩ</p>
          <p class="text-sm font-semibold text-blue-600">
            {{ medicalRecord.doctorId?.fullName || 'N/A' }}
          </p>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-b border-gray-200 my-4"></div>

      <!-- Diagnosis -->
      <div class="mb-4">
        <p class="text-xs text-gray-500 font-semibold uppercase mb-2">Chẩn đoán</p>
        <p class="text-sm text-gray-700 line-clamp-2">
          {{ medicalRecord.diagnosis || 'Chưa cập nhật' }}
        </p>
      </div>

      <!-- Symptoms -->
      <div class="mb-4">
        <p class="text-xs text-gray-500 font-semibold uppercase mb-2">Triệu chứng</p>
        <p class="text-sm text-gray-700 line-clamp-2">
          {{ medicalRecord.symptoms || 'Chưa cập nhật' }}
        </p>
      </div>

      <!-- Status Badges -->
      <div class="flex flex-wrap gap-2 mt-4">
        <!-- Prescription Badge -->
        <span
          v-if="medicalRecord.prescribedMedications"
          class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
        >
          <i class="fa-solid fa-pills text-xs"></i>
          Có đơn thuốc
        </span>

        <!-- Follow-up Badge -->
        <span
          v-if="medicalRecord.followUpRequire"
          class="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
        >
          <i class="fa-solid fa-calendar-check text-xs"></i>
          Tái khám {{ formatDate(medicalRecord.followUpDate) }}
        </span>

        <!-- Test Results Badge -->
        <span
          v-if="medicalRecord.testResults && medicalRecord.testResults.length > 0"
          class="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
        >
          <i class="fa-solid fa-flask-vial text-xs"></i>
          {{ medicalRecord.testResults.length }} xét nghiệm
        </span>
      </div>

      <!-- View Detail Button -->
      <button
        class="w-full mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
        @click="viewDetail"
      >
        <i class="fa-solid fa-arrow-right"></i>
        Xem chi tiết
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  medicalRecord: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['view-detail']);

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function viewDetail() {
  router.push({
    name: 'MyDetailMedicalRecord',
    params: { id: props.medicalRecord._id },
  });
  emit('view-detail', props.medicalRecord._id);
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}
</style>
