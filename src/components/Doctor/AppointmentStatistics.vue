<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-white">
      <h2 class="text-2xl font-bold flex items-center gap-3">
        <i class="fa-solid fa-chart-pie"></i>
        Thống Kê Cuộc Hẹn
      </h2>
    </div>

    <!-- Chart Container -->
    <div class="p-8">
      <!-- Loading state -->
      <div v-if="isLoading" class="flex items-center justify-center h-80">
        <div class="text-center">
          <i class="fa-solid fa-spinner fa-spin text-green-500 text-4xl mb-3"></i>
          <p class="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>

      <!-- Chart -->
      <div v-else>
        <Doughnut :data="chartData" :options="chartOptions" style="max-height: 400px" />

        <!-- Statistics Table -->
        <div class="mt-8 grid grid-cols-5 gap-4">
          <div class="bg-blue-50 rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-blue-600">{{ stats.total }}</p>
            <p class="text-sm text-gray-600 mt-2">Tổng Cuộc Hẹn</p>
          </div>
          <div class="bg-green-50 rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-green-600">{{ stats.completed }}</p>
            <p class="text-sm text-gray-600 mt-2">Hoàn Thành</p>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-yellow-600">{{ stats.pending }}</p>
            <p class="text-sm text-gray-600 mt-2">Chờ Xác Nhận</p>
          </div>
          <div class="bg-red-50 rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-red-600">{{ stats.rejected }}</p>
            <p class="text-sm text-gray-600 mt-2">Từ chối</p>
          </div>
          <div class="bg-red-50 rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-red-600">{{ stats.cancelled }}</p>
            <p class="text-sm text-gray-600 mt-2">Bị Hủy</p>
          </div>
        </div>

        <!-- Completion Rate -->
        <div
          class="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-lg font-semibold text-gray-800">Tỷ Lệ Hoàn Thành</p>
              <p class="text-sm text-gray-600 mt-1">Tỷ lệ hoàn thành các cuộc hẹn</p>
            </div>
            <div class="text-right">
              <p class="text-4xl font-bold text-green-600">{{ completionRate }}%</p>
              <div class="mt-2 w-48 bg-gray-300 rounded-full h-3">
                <div
                  class="bg-green-500 h-3 rounded-full"
                  :style="{ width: completionRate + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feedback Rate -->
        <div
          class="mt-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-lg font-semibold text-gray-800">Tỷ Lệ Có Đánh Giá</p>
              <p class="text-sm text-gray-600 mt-1">Tỷ lệ các cuộc hẹn có đánh giá</p>
            </div>
            <div class="text-right">
              <p class="text-4xl font-bold text-blue-600">{{ feedbackRate }}%</p>
              <div class="mt-2 w-48 bg-gray-300 rounded-full h-3">
                <div
                  class="bg-blue-500 h-3 rounded-full"
                  :style="{ width: feedbackRate + '%' }"
                ></div>
              </div>
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-700">
            <p>
              <i class="fa-solid fa-star text-yellow-400 mr-2"></i>{{ stats.withFeedback }} /
              {{ stats.completed }} cuộc hẹn có đánh giá
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import appointmentService from '@/api/appointmentService';
import { useUserStore } from '@/stores/userStore';
import { useRatingStore } from '@/stores/RatingStore';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const userStore = useUserStore();
const ratingStore = useRatingStore();
const isLoading = ref(false);
const stats = ref({
  total: 0,
  completed: 0,
  pending: 0,
  cancelled: 0,
  confirmed: 0,
  rejected: 0,
  withFeedback: 0,
});

const chartData = ref({
  labels: ['Hoàn Thành', 'Chờ Xác Nhận', 'Bị Hủy', 'Từ Chối'],
  datasets: [
    {
      data: [0, 0, 0, 0],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(168, 85, 247, 0.8)',
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(251, 146, 60)',
        'rgb(239, 68, 68)',
        'rgb(168, 85, 247)',
      ],
      borderWidth: 2,
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        font: {
          size: 14,
          weight: 'bold',
        },
      },
    },
    tooltip: {
      callbacks: {
        label: context => {
          const label = context.label || '';
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return `${label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
});

const completionRate = computed(() => {
  if (stats.value.total === 0) return 0;
  return Math.round((stats.value.completed / stats.value.total) * 100);
});

const feedbackRate = computed(() => {
  if (stats.value.completed === 0) return 0;
  return Math.round((stats.value.withFeedback / stats.value.completed) * 100);
});

const fetchAppointmentStats = async () => {
  try {
    isLoading.value = true;
    const doctorId = userStore.getUserInfo?.id;

    if (!doctorId) {
      console.error('Doctor ID not found');
      return;
    }

    // Fetch all appointments for this doctor
    const response = await appointmentService.getAppointmentsByDoctor(doctorId);
    const appointments = response?.data || response;

    // Calculate statistics
    const completed = appointments.filter(a => a.status === 'completed').length;
    const pending = appointments.filter(a => a.status === 'pending').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;
    const confirmed = appointments.filter(a => a.status === 'confirmed').length;
    const rejected = appointments.filter(a => a.status === 'rejected').length;
    const total = appointments.length;

    // Fetch ratings to count feedback
    await ratingStore.fetchRatingsByDoctor(doctorId);
    const ratings = ratingStore.ratings || [];
    const withFeedback = ratings.length;

    stats.value = {
      total,
      completed,
      pending,
      cancelled,
      confirmed,
      rejected,
      withFeedback,
    };

    // Update chart data
    chartData.value.datasets[0].data = [completed, pending, cancelled, rejected];
  } catch (error) {
    console.error('Error fetching appointment statistics:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAppointmentStats();
});
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
