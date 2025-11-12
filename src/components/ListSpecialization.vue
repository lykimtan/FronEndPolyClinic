<script setup>
import { ref, defineProps, defineEmits } from 'vue';

defineProps({
  specializations: {
    type: Array,
    default: () => [],
  },
});
defineEmits(['goToDetail']);
const scrollContainer = ref(null);

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: -300,
      behavior: 'smooth',
    });
  }
};

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: 300,
      behavior: 'smooth',
    });
  }
};
const getImageUrl = path => {
  if (!path) return '/src/assets/images/specilization/DefaultSpec.jpg';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${path}`;
};
</script>
<template>
  <div class="relative">
    <h2 class="pl-5 pt-5 font-bold text-xl">Chọn khoa khám bệnh</h2>

    <div class="absolute right-5 top-5 flex gap-2 z-10">
      <button
        class="w-10 h-10 rounded-full bg-white shadow-lg hover:bg-gray-100 transition flex items-center justify-center"
        aria-label="Scroll left"
        @click="scrollLeft"
      >
        <i class="fa-solid fa-chevron-left text-gray-700"></i>
      </button>
      <button
        class="w-10 h-10 rounded-full bg-white shadow-lg hover:bg-gray-100 transition flex items-center justify-center"
        aria-label="Scroll right"
        @click="scrollRight"
      >
        <i class="fa-solid fa-chevron-right text-gray-700"></i>
      </button>
    </div>

    <div
      ref="scrollContainer"
      class="flex flex-nowrap p-5 bg-gray-100 snap-x gap-4 overflow-x-auto scroll-smooth"
    >
      <div
        v-for="specialization in specializations"
        :key="specialization.id"
        class="relative group flex-shrink-0 text-center snap-center w-80"
        @click="$emit('goToDetail', specialization.id)"
      >
        <!-- Ảnh -->
        <img
          class="w-80 h-90 rounded-lg object-cover"
          :src="getImageUrl(specialization.image)"
          alt=""
        />

        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/60 flex flex-col items-center justify-evenly opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 rounded-lg"
        >
          <p class="font-bold p-4 text-xl text-sky-300">{{ specialization.name }}</p>
          <p class="text-gray-200 text-sm px-4 text-justify">
            <span class="text-lg font-bold">Triệu chứng thường gặp:</span>
            <br />
            {{ specialization.symptom }}
          </p>
          <p class="text-gray-200 text-sm px-4 text-justify">
            <span class="text-lg font-bold">Thông tin khoa:</span>
            <br />
            {{ specialization.description }}
          </p>
        </div>

        <p class="font-bold p-4 text-xl">{{ specialization.name }}</p>
      </div>
    </div>
  </div>
</template>
