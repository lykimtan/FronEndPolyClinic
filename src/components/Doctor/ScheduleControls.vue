<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div class="flex gap-4 items-center">
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          @click="$emit('previous-month')"
        >
          <i class="fa-solid fa-chevron-left mr-2"></i>Tháng trước
        </button>
        <h2 class="text-2xl font-bold text-gray-800 w-48 text-center">
          {{ currentMonthYear }}
        </h2>
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          @click="$emit('next-month')"
        >
          Tháng sau<i class="fa-solid fa-chevron-right ml-2"></i>
        </button>
      </div>
      <button
        class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        @click="$emit('go-today')"
      >
        <i class="fa-solid fa-calendar-day mr-2"></i>Hôm nay
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  currentDate: {
    type: Date,
    required: true,
  },
});

defineEmits(['previous-month', 'next-month', 'go-today']);

const currentMonthYear = computed(() => {
  return new Date(props.currentDate).toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  });
});
</script>
