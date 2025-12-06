<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Lịch làm việc của tôi</h1>
        <p class="text-gray-600">Quản lý và xem tất cả lịch làm việc của bạn</p>
      </div>

      <!-- Controls -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="space-y-4">
          <!-- Row 1: Month Controls -->
          <div>
            <ScheduleControls
              :current-date="currentDate"
              @previous-month="previousMonth"
              @next-month="nextMonth"
              @go-today="goToToday"
            />
          </div>

          <!-- Row 2: Date Filter -->
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <i class="fa-solid fa-calendar-days mr-2"></i>Lọc theo ngày
              </label>
              <input
                v-model="selectedDate"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div class="flex flex-col justify-end">
              <button
                class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
                @click="clearDateFilter"
              >
                <i class="fa-solid fa-times mr-2"></i>Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule List -->
      <div class="grid gap-6">
        <!-- Loading state -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Đang tải lịch làm việc...</p>
        </div>

        <!-- No schedules message -->
        <div
          v-else-if="filteredSchedules.length === 0"
          class="text-center py-12 bg-white rounded-lg"
        >
          <i class="fa-solid fa-calendar-xmark text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 text-lg">Không có lịch làm việc nào trong tháng này</p>
        </div>

        <!-- Schedule cards -->
        <div v-else class="space-y-4">
          <ScheduleCard
            v-for="schedule in filteredSchedules"
            :key="schedule._id"
            :schedule="schedule"
          />
        </div>
      </div>

      <!-- Summary -->
      <div v-if="filteredSchedules.length > 0" class="mt-12 grid md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm mb-1">Tổng lịch làm việc</p>
              <p class="text-4xl font-bold text-blue-600">{{ filteredSchedules.length }}</p>
            </div>
            <i class="fa-solid fa-calendar-check text-5xl text-blue-200"></i>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm mb-1">Tổng khung giờ còn trống</p>
              <p class="text-4xl font-bold text-green-600">{{ totalAvailableSlots }}</p>
            </div>
            <i class="fa-solid fa-hourglass-end text-5xl text-green-200"></i>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm mb-1">Tổng khung giờ đã đặt</p>
              <p class="text-4xl font-bold text-red-600">{{ totalBookedSlots }}</p>
            </div>
            <i class="fa-solid fa-user-check text-5xl text-red-200"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useDoctorScheduleStore } from '@/stores/DoctorScheduleStore';
import ScheduleControls from '@/components/Doctor/ScheduleControls.vue';
import ScheduleCard from '@/components/Doctor/ScheduleCard.vue';

const userStore = useUserStore();
const doctorScheduleStore = useDoctorScheduleStore();

const schedules = ref([]);
const isLoading = ref(false);
const currentDate = ref(new Date());
const selectedDate = ref('');

// Computed properties
const filteredSchedules = computed(() => {
  let filtered = schedules.value;

  // Filter by month/year
  filtered = filtered.filter(schedule => {
    const scheduleDate = new Date(schedule.date);
    return (
      scheduleDate.getMonth() === currentDate.value.getMonth() &&
      scheduleDate.getFullYear() === currentDate.value.getFullYear()
    );
  });

  // Filter by specific date if selected
  if (selectedDate.value) {
    filtered = filtered.filter(schedule => {
      const scheduleDate = new Date(schedule.date).toISOString().split('T')[0];
      return scheduleDate === selectedDate.value;
    });
  }

  return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
});

const totalAvailableSlots = computed(() => {
  return filteredSchedules.value.reduce(
    (sum, schedule) => sum + schedule.availableSlots.filter(s => !s.isBooked).length,
    0
  );
});

const totalBookedSlots = computed(() => {
  return filteredSchedules.value.reduce(
    (sum, schedule) => sum + schedule.availableSlots.filter(s => s.isBooked).length,
    0
  );
});

// Methods
const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1);
};

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1);
};

const goToToday = () => {
  currentDate.value = new Date();
};

const clearDateFilter = () => {
  selectedDate.value = '';
};

// Fetch schedules on mount
onMounted(async () => {
  try {
    isLoading.value = true;
    const doctorId = userStore.getUserInfo.id;
    console.log('Fetching schedules for doctor:', doctorId);

    const fetchedSchedules = await doctorScheduleStore.fetchSchedulesByDoctorId(doctorId);
    schedules.value = Array.isArray(fetchedSchedules) ? fetchedSchedules : [];
    console.log('Fetched schedules:', schedules.value);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    schedules.value = [];
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>
