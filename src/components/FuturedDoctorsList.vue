<script setup>
import { ref, defineProps } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  doctors: {
    type: Array,
    default: () => [],
  },
});

const scrollContainer = ref(null);

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -320, behavior: 'smooth' }); // Tăng khoảng cách scroll cho khớp với card
  }
};

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 320, behavior: 'smooth' });
  }
};

const getAvatarUrl = avatar => {
  if (!avatar) return '/src/assets/images/avartar.jpg';
  if (avatar.startsWith('http')) return avatar;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${avatar}`;
};

const getFullName = doctor => {
  return `${doctor.lastName} ${doctor.firstName}`;
};

const getSpecialization = doctor => {
  return doctor.specializationIds?.[0]?.name || 'Đa khoa';
};

const goToBookScreen = specializationIds => {
  // Kiểm tra an toàn trước khi map
  if (!specializationIds || specializationIds.length === 0) return;
  const ids = specializationIds.map(spec => spec._id).join(',');
  router.push({
    name: 'SpecializationDetail',
    params: { id: ids },
  });
};
</script>

<template>
  <div class="relative py-8">
    <div class="flex justify-between items-end px-5 mb-6">
      <div>
        <h2 class="font-bold text-2xl text-slate-800">Bác sĩ nổi bật</h2>
        <p class="text-slate-500 text-sm mt-1">Các chuyên gia hàng đầu sẵn sàng hỗ trợ bạn</p>
      </div>

      <div class="flex gap-3">
        <button
          class="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all shadow-sm flex items-center justify-center"
          aria-label="Scroll left"
          @click="scrollLeft"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button
          class="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all shadow-sm flex items-center justify-center"
          aria-label="Scroll right"
          @click="scrollRight"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <div
      ref="scrollContainer"
      class="flex overflow-x-auto snap-x gap-6 px-5 pb-8 scroll-smooth hide-scrollbar"
    >
      <div
        v-for="doctor in props.doctors"
        :key="doctor._id"
        class="group relative flex-shrink-0 snap-center w-72 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <div class="relative h-80 overflow-hidden rounded-t-2xl">
          <img
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            :src="getAvatarUrl(doctor.avatar)"
            :alt="getFullName(doctor)"
          />

          <div
            class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 shadow-sm"
          >
            {{ doctor.yearsOfExperience }}+ năm KN
          </div>

          <div
            class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
          >
            <button
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
              @click="goToBookScreen(doctor.specializationIds)"
            >
              <span>Đặt lịch ngay</span>
              <i class="fa-regular fa-calendar-check"></i>
            </button>
          </div>
        </div>

        <div class="p-4">
          <p class="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            {{ getSpecialization(doctor) }}
          </p>

          <h3
            class="font-bold text-lg text-slate-800 line-clamp-1 mb-2"
            :title="getFullName(doctor)"
          >
            {{ getFullName(doctor) }}
          </h3>

          <div class="flex items-center justify-between pt-3 border-t border-slate-100">
            <div class="flex items-center gap-1">
              <i class="fa-solid fa-star text-yellow-400 text-sm"></i>
              <span class="font-bold text-slate-700">{{ doctor.averageRating || 0 }}</span>
              <span class="text-slate-400 text-sm">/5</span>
            </div>
            <div class="text-slate-400 text-sm">Đánh giá</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
