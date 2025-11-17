<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 py-12 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-extrabold text-white tracking-wide uppercase">
          Welcome, Dr. {{ doc.fullName }}
        </h1>
      </div>

      <!-- Main Content -->
      <div class="grid md:grid-cols-5 gap-8 items-start">
        <div
          class="md:col-span-2 flex flex-col items-center animate-fade-in-left"
          style="animation-delay: 0.2s"
        >
          <!-- Avatar -->
          <div
            class="relative w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl"
          >
            <img
              :src="getImageUrl(doc.avatar)"
              :alt="doc.fullName"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Name -->
          <h2 class="mt-8 text-4xl font-bold text-white text-center tracking-wide uppercase">
            Dr. {{ doc.fullName }}
          </h2>
        </div>

        <!-- Right Column - Split into 2 sections -->
        <div class="md:col-span-3 space-y-8">
          <!-- My Information Card -->
          <div class="animate-fade-in-right" style="animation-delay: 0.4s">
            <div
              class="bg-indigo-600/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-indigo-400"
            >
              <!-- Title -->
              <h3 class="text-3xl font-extrabold text-white mb-6 uppercase tracking-wider">
                My Information
              </h3>

              <!-- Information Items -->
              <div class="space-y-4">
                <!-- Full Name -->
                <div class="flex items-center text-white">
                  <span class="text-lg font-bold uppercase tracking-wide">Họ và Tên:</span>
                  <span class="ml-4 text-lg font-medium">{{ doc.fullName }}</span>
                </div>

                <!-- Specialization -->
                <div class="flex items-center text-white">
                  <span class="text-lg font-bold uppercase tracking-wide">Chuyên khoa:</span>
                  <span class="ml-4 text-lg font-medium">
                    {{
                      doc.specializationIds?.map(spec => spec.name).join(', ') || 'Chưa cập nhật'
                    }}
                  </span>
                </div>

                <!-- Rating -->
                <div class="flex items-center text-white">
                  <span class="text-lg font-bold uppercase tracking-wide">Rating:</span>
                  <div class="ml-4 flex items-center gap-1">
                    <i
                      v-for="star in 5"
                      :key="star"
                      class="fa-solid fa-star text-yellow-300 text-lg"
                    ></i>
                  </div>
                </div>

                <!-- Email -->
                <div class="flex items-center text-white">
                  <span class="text-lg font-bold uppercase tracking-wide">Email:</span>
                  <span class="ml-4 text-lg font-medium">{{ doc.email || 'Chưa cập nhật' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Today's Calendar Card -->
          <div class="animate-fade-in-right" style="animation-delay: 0.5s">
            <div
              class="bg-purple-600/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-purple-400"
            >
              <!-- Calendar Header -->
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-3xl font-extrabold text-white uppercase tracking-wider">
                  Lịch hôm nay
                </h3>
                <div class="text-white text-lg font-semibold">
                  <i class="fa-solid fa-calendar-day mr-2"></i>
                  {{ formatToday() }}
                </div>
              </div>

              <!-- Calendar Content -->
              <div class="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
                <!-- Sample Schedule Items -->
                <div
                  v-for="(schedule, index) in todaySchedules"
                  :key="index"
                  class="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"
                      >
                        <i class="fa-solid fa-clock text-white text-xl"></i>
                      </div>
                      <div>
                        <p class="text-white font-bold text-lg">{{ schedule.time }}</p>
                        <p class="text-white/80 text-sm">{{ schedule.patient }}</p>
                      </div>
                    </div>
                    <span
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                      :class="
                        schedule.status === 'pending'
                          ? 'bg-yellow-500 text-yellow-900'
                          : 'bg-green-500 text-green-900'
                      "
                    >
                      {{ schedule.status === 'pending' ? 'Chờ khám' : 'Hoàn thành' }}
                    </span>
                  </div>
                </div>

                <!-- No schedules message -->
                <div v-if="todaySchedules.length === 0" class="text-center text-white/60 py-8">
                  <i class="fa-solid fa-calendar-xmark text-5xl mb-3"></i>
                  <p class="text-lg">Không có lịch hẹn nào hôm nay</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Cards Section -->
      <div class="mt-16">
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Card 1: Lịch làm việc của tôi -->
          <div
            class="bg-slate-700/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-slate-500 animate-fade-in-up"
            style="animation-delay: 0.6s"
            @click="navigateToSchedule"
          >
            <div class="flex items-center justify-center mb-4">
              <i class="fa-solid fa-calendar-days text-6xl text-white"></i>
            </div>
            <h3 class="text-3xl font-extrabold text-white text-center uppercase tracking-wider">
              Lịch làm việc của tôi
            </h3>
          </div>

          <!-- Card 2: Diễn đàn FnA -->
          <div
            class="bg-slate-700/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-slate-500 animate-fade-in-up"
            style="animation-delay: 0.7s"
            @click="navigateToFnA"
          >
            <div class="flex items-center justify-center mb-4">
              <i class="fa-solid fa-comments text-6xl text-white"></i>
            </div>
            <h3 class="text-3xl font-extrabold text-white text-center uppercase tracking-wider">
              Diễn đàn FnA
            </h3>
          </div>

          <!-- Card 3: Lịch làm việc của tôi (duplicate) -->
          <div
            class="bg-slate-700/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-slate-500 animate-fade-in-up"
            style="animation-delay: 0.8s"
            @click="navigateToSchedule"
          >
            <div class="flex items-center justify-center mb-4">
              <i class="fa-solid fa-clock text-6xl text-white"></i>
            </div>
            <h3 class="text-3xl font-extrabold text-white text-center uppercase tracking-wider">
              Lịch làm việc của tôi
            </h3>
          </div>

          <!-- Card 4: Lịch làm việc của tôi (duplicate) -->
          <div
            class="bg-slate-700/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-slate-500 animate-fade-in-up"
            style="animation-delay: 0.9s"
            @click="navigateToSchedule"
          >
            <div class="flex items-center justify-center mb-4">
              <i class="fa-solid fa-calendar-check text-6xl text-white"></i>
            </div>
            <h3 class="text-3xl font-extrabold text-white text-center uppercase tracking-wider">
              Lịch làm việc của tôi
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useDoctorStore } from '@/stores/DoctorStore';
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const getImageUrl = path => {
  if (!path) return '/src/assets/images/specilization/DefaultSpec.jpg';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${path}`;
};

const doc = ref({});
const userStore = useUserStore();
const doctorStore = useDoctorStore();

// Today's schedules - sample data (replace with actual API call)
const todaySchedules = ref([
  { time: '08:00 - 08:30', patient: 'Nguyễn Văn A', status: 'completed' },
  { time: '09:00 - 09:30', patient: 'Trần Thị B', status: 'completed' },
  { time: '10:00 - 10:30', patient: 'Lê Văn C', status: 'pending' },
  { time: '14:00 - 14:30', patient: 'Phạm Thị D', status: 'pending' },
  { time: '15:30 - 16:00', patient: 'Hoàng Văn E', status: 'pending' },
]);

// Format today's date
const formatToday = () => {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return today.toLocaleDateString('vi-VN', options);
};

onMounted(async () => {
  await userStore.fetchUserProfile();
  console.log('📄 Fetched doctor Profile in this:', userStore.getUserInfo);
  const doctorId = userStore.getUserInfo.id;
  console.log('Doctor ID:', doctorId);
  const docRes = await doctorStore.getDoctorById(doctorId);
  console.log('Fetched doctor data:', docRes);
  doc.value = docRes?.data || docRes;

  // TODO: Fetch today's schedules from API
  // const schedules = await fetchTodaySchedules(doctorId);
  // todaySchedules.value = schedules;
});

// Navigation functions
const navigateToSchedule = () => {
  router.push('/doctor/schedule');
};

const navigateToFnA = () => {
  router.push('/fna');
};
</script>

<style scoped>
/* Fade in from left animation */
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Fade in from right animation */
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-left {
  opacity: 0;
  animation: fadeInLeft 0.8s ease-out forwards;
}

.animate-fade-in-right {
  opacity: 0;
  animation: fadeInRight 0.8s ease-out forwards;
}

/* Fade in from bottom animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

/* Custom scrollbar for calendar */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
