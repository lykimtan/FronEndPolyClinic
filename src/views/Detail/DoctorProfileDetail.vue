<template>
  <div class="bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
    <!-- Loading state -->
    <div v-if="!doc._id" class="text-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600 text-lg">Đang tải thông tin bác sĩ...</p>
    </div>

    <div v-else class="bg-white shadow-lg rounded-3xl w-full overflow-hidden">
      <!-- Header -->
      <div class="text-center p-6 border-b border-gray-200">
        <h2 class="text-3xl font-bold text-blue-700 tracking-wide">Thông tin bác sĩ</h2>

        <!-- Avatar -->
        <div class="relative mt-4 flex justify-center">
          <div
            class="relative w-100 h-100 rounded-full border-[20px] border-blue-600 overflow-hidden"
          >
            <img
              :src="getImageUrl(doc.avatar)"
              alt="Doctor Avatar"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="absolute w-20 h-20 -bottom-[20px]">
            <img src="./../../assets/HealthCareWhite.png" alt="" />
          </div>
        </div>

        <h3 class="mt-4 text-2xl font-bold text-gray-800">DR. {{ doc.fullName }}</h3>
      </div>

      <!-- Content -->
      <div class="flex justify-center bg-gray-50 py-6">
        <div
          class="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-white shadow-md rounded-2xl max-w-6xl w-full"
        >
          <!-- Personal Info -->
          <div class="p-6 animate-slide-in-left" :class="{ 'opacity-0': !isLoaded }">
            <h4 class="text-gray-900 text-lg font-semibold mb-3">Thông tin cá nhân</h4>
            <ul class="space-y-2 text-gray-600 text-sm md:text-base">
              <li><span class="font-medium">Full Name:</span> {{ doc.fullName }}</li>
              <li>
                <span class="font-medium">Date of Birth:</span> {{ formatDate(doc.dateOfBirth) }}
              </li>
              <li>
                <span class="font-medium">Specialization:</span>
                {{ doc.specializationIds.map(spec => spec.name).join(', ') }}
              </li>
              <li><span class="font-medium">Kinh nghiệm:</span> {{ doc.yearsOfExperience }} năm</li>
              <li><span class="font-medium">Giấy phép hành nghề:</span> {{ doc.licenseNumber }}</li>
            </ul>
          </div>

          <!-- Record -->
          <div class="p-6 animate-slide-in-right" :class="{ 'opacity-0': !isLoaded }">
            <h4 class="text-gray-700 font-semibold mb-3 text-lg">
              Quá trình công tác tại phòng khám
            </h4>
            <ul class="space-y-3 text-gray-600 text-sm md:text-base">
              <li><span class="font-medium">Tổng số lượt khám:</span> {{ doctor.totalExams }}</li>
              <li>
                <span class="font-medium">Đánh giá trung bình:</span>
                <div class="flex items-center mt-1 space-x-1">
                  <template v-for="n in 5" :key="n">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      :class="n <= Math.round(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.964a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.382 2.457a1 1 0 00-.364 1.118l1.287 3.965c.3.921-.755 1.688-1.54 1.118l-3.383-2.457a1 1 0 00-1.175 0l-3.383 2.457c-.784.57-1.838-.197-1.539-1.118l1.287-3.965a1 1 0 00-.364-1.118L2.05 9.391c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.964z"
                      />
                    </svg>
                  </template>
                </div>
                <p class="text-gray-700 font-medium mt-0.5">{{ doctor.rating }}/5</p>
              </li>
            </ul>
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

const doctorStore = useDoctorStore();
const route = useRoute();

const getImageUrl = path => {
  if (!path) return '/src/assets/images/specilization/DefaultSpec.jpg';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${path}`;
};

const isLoaded = ref(false);
const doc = ref({});

const doctor = {
  name: 'Ly Van Sol',
  fullName: 'Lý Văn Sol',
  dob: '20/10/1989',
  specialization: 'Tim mạch',
  experience: 20,
  education: 'Tốt nghiệp trường Đại học Y Hà Nội',
  totalExams: 50,
  rating: 4.8,
  image: 'https://i.pinimg.com/1200x/2a/cb/ab/2acbab619d2094753c4483c521d43344.jpg', // ảnh mẫu
};

onMounted(async () => {
  const doctorId = route.params.id;
  const docRes = await doctorStore.getDoctorById(doctorId);
  console.log('Fetched doctor data:', docRes);
  doc.value = docRes?.data || docRes;
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
