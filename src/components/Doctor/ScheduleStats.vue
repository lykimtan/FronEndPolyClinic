<template>
  <div class="grid grid-cols-3 gap-2 mt-4 bg-gray-50 p-4 rounded-lg">
    <div class="text-center">
      <p class="text-2xl font-bold text-blue-600">{{ totalSlots }}</p>
      <p class="text-sm text-gray-600">Tổng slot</p>
    </div>
    <div class="text-center">
      <p class="text-2xl font-bold text-green-600">{{ availableSlots }}</p>
      <p class="text-sm text-gray-600">Còn trống</p>
    </div>
    <div class="text-center">
      <p class="text-2xl font-bold text-red-600">{{ bookedSlots }}</p>
      <p class="text-sm text-gray-600">Đã đặt</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  schedule: {
    type: Object,
    required: true,
  },
});

const totalSlots = computed(() => props.schedule.timeSlots?.length || 0);

const availableSlots = computed(
  () => props.schedule.timeSlots?.filter(slot => !slot.isBooked).length || 0
);

const bookedSlots = computed(
  () => props.schedule.timeSlots?.filter(slot => slot.isBooked).length || 0
);
</script>
