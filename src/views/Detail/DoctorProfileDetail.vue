<template>
  <div class="bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
    <!-- Loading state -->
    <div v-if="!doc._id" class="text-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600 text-lg">Đang tải thông tin bác sĩ...</p>
    </div>

    <div
      v-else
      class="bg-white shadow-xl rounded-3xl w-full overflow-hidden border border-slate-100"
    >
      <div class="h-48 bg-gradient-to-r from-blue-600 to-cyan-500 relative">
        <div
          class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"
        ></div>
      </div>

      <div class="px-6 relative text-center">
        <div class="relative -mt-20 inline-block">
          <div class="relative w-60 h-60 rounded-full p-1 bg-white shadow-lg mx-auto">
            <div class="w-full h-full rounded-full overflow-hidden relative">
              <img
                :src="getImageUrl(doc.avatar)"
                alt="Doctor Avatar"
                class="w-full h-full object-cover transform hover:scale-110 transition duration-500"
              />
            </div>
          </div>

          <div
            class="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full p-1.5 shadow-md flex items-center justify-center"
            title="HealthMate Verified"
          >
            <img
              src="./../../assets/HealthCare.png"
              alt="Logo"
              class="w-full h-full object-contain"
            />
          </div>
        </div>

        <div class="mt-4 mb-8">
          <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Dr. {{ doc.fullName }}</h2>
          <div class="flex items-center justify-center gap-2 mt-1">
            <span
              class="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100"
            >
              {{ doc.specializationIds.map(spec => spec.name).join(', ') }}
            </span>
          </div>
        </div>
      </div>

      <div class="px-6 pb-8 md:px-10">
        <div class="grid md:grid-cols-2 gap-6 md:gap-10">
          <div class="animate-slide-in-left" :class="{ 'opacity-0': !isLoaded }">
            <h4 class="flex items-center text-slate-800 text-lg font-bold mb-5 border-b pb-2">
              <svg
                class="w-5 h-5 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              Thông tin cá nhân
            </h4>

            <div class="space-y-4">
              <div class="flex items-start group">
                <div
                  class="min-w-[140px] text-slate-400 text-sm font-medium uppercase tracking-wider"
                >
                  Họ và tên
                </div>
                <div class="font-medium text-slate-700">{{ doc.fullName }}</div>
              </div>
              <div class="flex items-start group">
                <div
                  class="min-w-[140px] text-slate-400 text-sm font-medium uppercase tracking-wider"
                >
                  Ngày sinh
                </div>
                <div class="font-medium text-slate-700">{{ formatDate(doc.dateOfBirth) }}</div>
              </div>
              <div class="flex items-start group">
                <div
                  class="min-w-[140px] text-slate-400 text-sm font-medium uppercase tracking-wider"
                >
                  Kinh nghiệm
                </div>
                <div class="font-medium text-slate-700 flex items-center">
                  <span class="text-blue-600 font-bold text-lg mr-1">{{
                    doc.yearsOfExperience
                  }}</span>
                  năm
                </div>
              </div>
              <div class="flex items-start group">
                <div
                  class="min-w-[140px] text-slate-400 text-sm font-medium uppercase tracking-wider"
                >
                  Giấy phép
                </div>
                <div
                  class="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-sm font-mono border border-slate-200"
                >
                  {{ doc.licenseNumber }}
                </div>
              </div>
            </div>
          </div>

          <div class="animate-slide-in-right" :class="{ 'opacity-0': !isLoaded }">
            <h4 class="flex items-center text-slate-800 text-lg font-bold mb-5 border-b pb-2">
              <svg
                class="w-5 h-5 mr-2 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              Hiệu suất làm việc
            </h4>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
                <div class="text-3xl font-extrabold text-blue-600 mb-1">20</div>
                <div class="text-xs text-blue-400 font-medium uppercase">Lượt khám</div>
              </div>
              <div class="bg-yellow-50 rounded-2xl p-4 text-center border border-yellow-100">
                <div class="text-3xl font-extrabold text-yellow-600 mb-1">{{ averageRating }}</div>
                <div class="text-xs text-yellow-500 font-medium uppercase">Điểm đánh giá</div>
              </div>
            </div>

            <div
              class="bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-100"
            >
              <div class="flex items-center space-x-1 mb-2">
                <template v-for="n in 5" :key="n">
                  <i class="fa-solid fa-star text-yellow-400 text-2xl"></i>
                </template>
              </div>
              <p class="text-slate-500 text-sm">
                Dựa trên <span class="font-bold text-slate-700">{{ ratings.length }}</span> lượt
                phản hồi từ bệnh nhân
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- Ratings Section -->
      <div class="p-8 bg-white">
        <h4 class="text-2xl font-bold text-gray-800 mb-6">
          Đánh giá từ bệnh nhân ({{ ratings.length }})
        </h4>

        <!-- No ratings message -->
        <div v-if="ratings.length === 0" class="text-center py-12">
          <i class="fa-solid fa-star text-gray-300 text-4xl mb-3"></i>
          <p class="text-gray-500 text-lg">Chưa có đánh giá nào</p>
        </div>

        <!-- Ratings list -->
        <div v-else class="space-y-6">
          <div
            v-for="rating in ratings"
            :key="rating._id"
            class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <!-- Rating header with stars and score -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <img
                  v-if="rating.patientId?.avatar"
                  :src="getImageUrl(rating.patientId.avatar)"
                  alt="Patient Avatar"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div
                  v-else
                  class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center"
                >
                  <i class="fa-solid fa-user text-gray-500"></i>
                </div>
                <div>
                  <p class="font-semibold text-gray-800">
                    {{ rating.patientId?.firstName }} {{ rating.patientId?.lastName }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{
                      new Date(rating.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <div class="flex items-center space-x-1 mb-1 justify-end">
                  <template v-for="n in 5" :key="n">
                    <i class="fa-solid fa-star text-yellow-400 text-xl"></i>
                  </template>
                </div>
                <p class="text-sm font-semibold text-gray-700">{{ rating.score }}/5</p>
              </div>
            </div>

            <!-- Rating comment -->
            <p v-if="rating.comment" class="text-gray-700 leading-relaxed">
              {{ rating.comment }}
            </p>
            <p v-else class="text-gray-500 italic">Không có bình luận</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDoctorStore } from '@/stores/DoctorStore';
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useRatingStore } from '@/stores/RatingStore';

const doctorStore = useDoctorStore();
const route = useRoute();
const ratingStore = useRatingStore();

const getImageUrl = path => {
  if (!path) return '/src/assets/images/specilization/DefaultSpec.jpg';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${path}`;
};

const isLoaded = ref(false);
const doc = ref({});
const ratings = ref([]);
const averageRating = ref(0);

const getAverageRating = () => {
  if (ratings.value.length === 0) return 0;
  const sum = ratings.value.reduce((acc, rating) => acc + rating.score, 0);
  return (sum / ratings.value.length).toFixed(1);
};

onMounted(async () => {
  const doctorId = route.params.id;
  const docRes = await doctorStore.getDoctorById(doctorId);
  console.log('Fetched doctor data:', docRes);
  doc.value = docRes?.data || docRes;

  // Fetch ratings for this doctor
  try {
    await ratingStore.fetchRatingsByDoctor(doctorId);
    ratings.value = ratingStore.ratings;
    averageRating.value = getAverageRating();
  } catch (error) {
    console.error('Error fetching ratings:', error);
    ratings.value = [];
    averageRating.value = 0;
  }

  setTimeout(() => {
    isLoaded.value = true;
  }, 1000);
});

const formatDate = dateStr => {
  if (!dateStr) return 'Chưa cập nhật';
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
</script>

<style scoped>
/* Slide in from left animation */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Slide in from right animation */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-left {
  animation: slideInLeft 0.8s ease-out forwards;
}

.animate-slide-in-right {
  animation: slideInRight 0.8s ease-out forwards;
}

/* Thêm hiệu ứng nhỏ khi hover */
@media (hover: hover) {
  img {
    transition: transform 0.3s ease;
  }
  img:hover {
    transform: scale(1.05);
  }
}
</style>
