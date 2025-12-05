<template>
  <div v-if="createdSchedules.length > 0">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Lịch Vừa Tạo</h2>
    <div class="grid gap-4">
      <div
        v-for="schedule in createdSchedules.slice(0, 5)"
        :key="schedule._id"
        class="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500"
      >
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-semibold text-gray-800">
            {{ formatDate(schedule.date) }}
          </h3>
          <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            {{ getShiftLabel(schedule.shift) }}
          </span>
        </div>
        <p class="text-gray-600 mb-2">
          <i class="fa-solid fa-stethoscope mr-2"></i>
          {{ schedule.specializationId?.name }}
        </p>
        <p class="text-sm text-gray-500">
          <i class="fa-solid fa-hourglass-end mr-2"></i>
          {{ schedule.availableSlots?.length || 0 }} khung giờ khám
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  createdSchedules: {
    type: Array,
    required: true,
  },
});

const shifts = [
  { value: 'morning', label: '⭐ Buổi Sáng' },
  { value: 'afternoon', label: '☀️ Buổi Chiều' },
  { value: 'evening', label: '🌙 Buổi Tối' },
];

const getShiftLabel = shiftValue => {
  if (Array.isArray(shiftValue)) {
    shiftValue = shiftValue[0];
  }
  const shift = shifts.find(s => s.value === shiftValue);
  return shift ? shift.label : shiftValue;
};

const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>
