<script setup>
import { ref, defineProps } from 'vue';

//them props
const props = defineProps({
  doctors: {
    type: Array,
    default: () => [],
  },
});
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
</script>
<template>
  <div class="relative">
    <h2 class="pl-5 pt-5 font-bold text-xl">Bác sĩ nổi bậc</h2>

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
        v-for="doctor in props.doctors"
        :key="doctor.id"
        class="relative group flex-shrink-0 text-center snap-center w-80"
      >
        <!-- Ảnh -->
        <img
          class="w-80 h-90 rounded-tl-lg rounded-tr-lg object-cover"
          :src="doctor.image"
          alt=""
        />

        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/60 flex flex-col items-center justify-evenly opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 rounded-lg"
        >
          <p class="font-bold p-4 text-3xl text-sky-300">{{ doctor.name }}</p>
          <p class="font-bold p-4 text-xl text-sky-300">Chuyên khoa: {{ doctor.specialization }}</p>
          <button class="bg-blue-500 text-white p-5 py-2 rounded-lg text-2xl">
            Đặt lịch khám bệnh
          </button>
        </div>

        <div class="bg-gray-400 rounded-br-lg rounded-bl-lg">
          <p class="font-bold p-4 text-2xl">{{ doctor.name }}</p>
          <div class="flex justify-around font-semibold">
            <p class="text-gray-500 text-lg">Chuyên khoa</p>
            <p class="text-gray-700 text-lg ml-1">{{ doctor.specialization }}</p>
          </div>

          <p class="text-gray-700 text-lg p-3">{{ doctor.yearOfExperience }} năm kinh nghiệm</p>

          <div class="flex items-center space-x-1 p-3 justify-center">
            <i
              v-for="star in 5"
              :key="star"
              class="text-lg"
              :class="
                doctor.ratingAverage >= star
                  ? 'fa-solid fa-star text-yellow-400'
                  : doctor.ratingAverage >= star - 0.5
                    ? 'fa-solid fa-star-half-stroke text-yellow-400'
                    : 'fa-regular fa-star text-gray-300'
              "
            ></i>
            <span class="text-gray-600 text-sm ml-2">({{ doctor.ratingAverage }}/5)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
