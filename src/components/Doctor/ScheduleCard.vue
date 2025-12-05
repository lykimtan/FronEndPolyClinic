<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
    <!-- Schedule header -->
    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-3">
          <i class="fa-solid fa-calendar text-2xl"></i>
          <div>
            <h3 class="text-xl font-bold">
              {{ formatDate(schedule.date) }}
            </h3>
            <p class="text-blue-100">{{ getShiftLabel(schedule.shift) }}</p>
          </div>
        </div>
        <div class="text-right">
          <span
            :class="isSchedulePast(schedule.date) ? 'bg-gray-500' : 'bg-green-500'"
            class="px-3 py-1 rounded-full text-sm font-semibold"
          >
            {{ isSchedulePast(schedule.date) ? 'Đã qua' : 'Sắp tới' }}
          </span>
        </div>
      </div>
      <p class="text-blue-100">
        <i class="fa-solid fa-stethoscope mr-2"></i>
        {{ schedule.specializationId?.name || 'Chuyên khoa' }}
      </p>
    </div>

    <!-- Schedule content -->
    <div class="p-6">
      <!-- Slots -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold text-gray-800 mb-4">Khung giờ khám</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ScheduleSlot
            v-for="timeSlot in schedule.availableSlots"
            :key="timeSlot._id"
            :time-slot="timeSlot"
          />
        </div>
      </div>

      <!-- Statistics -->
      <ScheduleStats :schedule="schedule" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import ScheduleSlot from './ScheduleSlot.vue';
import ScheduleStats from './ScheduleStats.vue';

defineProps({
  schedule: {
    type: Object,
    required: true,
  },
});

const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getShiftLabel = shiftArray => {
  const shiftLabels = {
    morning: '⭐ Buổi sáng (8:00 - 12:00)',
    afternoon: '☀️ Buổi chiều (13:00 - 17:00)',
    evening: '🌙 Buổi tối (17:00 - 21:00)',
  };
  return shiftArray.map(shift => shiftLabels[shift] || shift).join(', ');
};

const isSchedulePast = dateString => {
  const scheduleDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  scheduleDate.setHours(0, 0, 0, 0);
  return scheduleDate < today;
};
</script>
