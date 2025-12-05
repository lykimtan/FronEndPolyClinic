<template>
  <div class="bg-white rounded-lg shadow-lg p-6 sticky top-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">
      <i class="fa-solid fa-list text-blue-600 mr-2"></i>Danh Sách Bác Sĩ
    </h2>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-4 border-blue-600 mx-auto mb-2"></div>
      <p class="text-gray-500">Đang tải...</p>
    </div>

    <!-- Doctor List -->
    <div v-else class="space-y-3 max-h-[600px] overflow-y-auto">
      <div
        v-for="doctor in doctors"
        :key="doctor._id"
        :class="
          selectedDoctorId === doctor._id
            ? 'bg-blue-100 border-blue-500'
            : 'bg-gray-50 border-gray-300 hover:border-blue-400'
        "
        class="p-4 border-2 rounded-lg cursor-pointer transition transform hover:scale-102"
        @click="handleSelectDoctor(doctor)"
      >
        <div class="flex items-start gap-3">
          <div
            class="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0"
          >
            <i class="fa-solid fa-user-md"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-800 truncate">{{ doctor.fullName }}</p>
            <p class="text-sm text-gray-600">
              {{
                doctor.specializationIds && doctor.specializationIds.length > 0
                  ? doctor.specializationIds[0]?.name || 'N/A'
                  : 'N/A'
              }}
            </p>
            <p class="text-xs text-gray-500 mt-1">{{ doctor.email }}</p>
            <p class="text-xs text-gray-500 mt-1">MSNV: {{ doctor.employeeId }}</p>
          </div>
          <div v-if="selectedDoctorId === doctor._id" class="text-blue-600 flex-shrink-0">
            <i class="fa-solid fa-check-circle text-lg"></i>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="doctors.length === 0" class="text-center py-8">
        <i class="fa-solid fa-user-slash text-4xl text-gray-300 mb-2"></i>
        <p class="text-gray-500">Không có bác sĩ</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  doctors: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  selectedDoctorId: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['select-doctor']);

const handleSelectDoctor = doctor => {
  emit('select-doctor', doctor);
};
</script>
