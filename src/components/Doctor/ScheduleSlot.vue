<template>
  <div
    :class="timeSlot.isBooked ? 'bg-red-100 border-red-300' : 'bg-green-100 border-green-300'"
    class="border-2 rounded-lg p-3 text-center"
  >
    <p class="font-bold text-gray-800">{{ timeSlot.time }}</p>
    <span
      :class="timeSlot.isBooked ? 'text-red-600' : 'text-green-600'"
      class="text-sm font-semibold"
    >
      {{ timeSlot.isBooked ? 'Đã đặt' : 'Còn trống' }}
    </span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  timeSlot: {
    type: Object,
    required: true,
  },
});
</script>
