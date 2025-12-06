<template>
  <div class="bg-gray-800 rounded-xl p-6 shadow-lg">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-white">Thống Kê Cuộc Hẹn</h3>
      <!-- Month/Year Filter -->
      <div class="flex gap-2 items-center">
        <label class="text-gray-400 text-sm">Chọn tháng:</label>
        <input
          v-model="selectedMonth"
          type="month"
          class="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
          @change="fetchStatistics"
        />
        <button
          v-if="selectedMonth"
          class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition"
          @click="clearMonthFilter"
        >
          Xóa
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center h-80">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-3"
        ></div>
        <p class="text-gray-400">Đang tải dữ liệu...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center h-80">
      <div class="text-center">
        <p class="text-red-400 mb-2">{{ error }}</p>
        <button
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          @click="fetchStatistics"
        >
          Thử lại
        </button>
      </div>
    </div>

    <!-- Chart and Stats -->
    <div v-else class="space-y-8">
      <!-- Pie Chart -->
      <div>
        <h4 class="text-lg font-semibold text-white mb-4">Phân bố trạng thái hẹn khám</h4>
        <div class="flex justify-center items-center h-80">
          <Pie :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="bg-gray-700 rounded-lg p-4 text-center">
          <p class="text-gray-400 text-sm mb-2">Tổng</p>
          <p class="text-2xl font-bold text-white">{{ stats.total }}</p>
        </div>
        <div class="bg-green-900/30 rounded-lg p-4 text-center border border-green-500/30">
          <p class="text-green-400 text-sm mb-2">Hoàn thành</p>
          <p class="text-2xl font-bold text-green-400">{{ stats.completed }}</p>
        </div>
        <div class="bg-blue-900/30 rounded-lg p-4 text-center border border-blue-500/30">
          <p class="text-blue-400 text-sm mb-2">Đã xác nhận</p>
          <p class="text-2xl font-bold text-blue-400">{{ stats.confirmed }}</p>
        </div>
        <div class="bg-yellow-900/30 rounded-lg p-4 text-center border border-yellow-500/30">
          <p class="text-yellow-400 text-sm mb-2">Chờ xử lý</p>
          <p class="text-2xl font-bold text-yellow-400">{{ stats.pending }}</p>
        </div>
        <div class="bg-red-900/30 rounded-lg p-4 text-center border border-red-500/30">
          <p class="text-red-400 text-sm mb-2">Đã hủy</p>
          <p class="text-2xl font-bold text-red-400">{{ stats.cancelled }}</p>
        </div>
      </div>

      <!-- Percentages -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-700">
        <div class="text-center">
          <p class="text-gray-400 text-sm mb-1">% Hoàn thành</p>
          <p class="text-lg font-bold text-green-400">
            {{ stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0 }}%
          </p>
        </div>
        <div class="text-center">
          <p class="text-gray-400 text-sm mb-1">% Đã xác nhận</p>
          <p class="text-lg font-bold text-blue-400">
            {{ stats.total > 0 ? ((stats.confirmed / stats.total) * 100).toFixed(1) : 0 }}%
          </p>
        </div>
        <div class="text-center">
          <p class="text-gray-400 text-sm mb-1">% Chờ xử lý</p>
          <p class="text-lg font-bold text-yellow-400">
            {{ stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : 0 }}%
          </p>
        </div>
        <div class="text-center">
          <p class="text-gray-400 text-sm mb-1">% Đã hủy</p>
          <p class="text-lg font-bold text-red-400">
            {{ stats.total > 0 ? ((stats.cancelled / stats.total) * 100).toFixed(1) : 0 }}%
          </p>
        </div>
        <div class="text-center">
          <p class="text-gray-400 text-sm mb-1">% Từ chối</p>
          <p class="text-lg font-bold text-purple-400">
            {{ stats.total > 0 ? ((stats.rejected / stats.total) * 100).toFixed(1) : 0 }}%
          </p>
        </div>
      </div>

      <!-- Top 5 Doctors Bar Chart -->
      <div>
        <h4 class="text-lg font-semibold text-white mb-4">
          Top 5 bác sĩ có nhiều lịch hẹn khám nhất
        </h4>
        <div class="flex justify-center items-center h-96">
          <Bar :data="topDoctorsChartData" :options="barChartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Pie, Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import appointmentService from '@/api/appointmentService';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const isLoading = ref(false);
const error = ref(null);
const selectedMonth = ref(''); // Format: YYYY-MM
const stats = ref({
  total: 0,
  completed: 0,
  confirmed: 0,
  pending: 0,
  cancelled: 0,
  rejected: 0,
});

const chartData = ref({
  labels: ['Hoàn thành', 'Đã xác nhận', 'Chờ xử lý', 'Đã hủy', 'Từ chối'],
  datasets: [
    {
      data: [0, 0, 0, 0, 0],
      backgroundColor: [
        '#10b981', // Green for completed
        '#3b82f6', // Blue for confirmed
        '#f59e0b', // Yellow for pending
        '#ef4444', // Red for cancelled
        '#8b5cf6', // Purple for rejected
      ],
      borderColor: '#374151',
      borderWidth: 2,
    },
  ],
});

const topDoctorsChartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Số lịch hẹn',
      data: [],
      backgroundColor: [
        '#3b82f6', // Blue
        '#60a5fa', // Light Blue
        '#93c5fd', // Lighter Blue
        '#bfdbfe', // Even Lighter Blue
        '#dbeafe', // Lightest Blue
      ],
      borderColor: '#1e40af',
      borderWidth: 1,
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#d1d5db',
        padding: 15,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || '';
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: {
      display: true,
      labels: {
        color: '#d1d5db',
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        color: '#9ca3af',
        font: {
          size: 11,
        },
      },
      grid: {
        color: 'rgba(107, 114, 128, 0.2)',
      },
    },
    y: {
      ticks: {
        color: '#9ca3af',
        font: {
          size: 11,
        },
      },
      grid: {
        display: false,
      },
    },
  },
};

const fetchStatistics = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const response = await appointmentService.getAllAppointments();
    let appointments = response.data || [];

    // Filter by month if selected
    if (selectedMonth.value) {
      const [year, month] = selectedMonth.value.split('-');
      appointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate.getFullYear() === parseInt(year) &&
          appointmentDate.getMonth() === parseInt(month) - 1
        );
      });
    }

    // Count appointments by status
    const statusCounts = {
      completed: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      rejected: 0,
    };

    // Count appointments by patient
    const doctorCounts = {};

    appointments.forEach(appointment => {
      const status = appointment.status?.toLowerCase();
      if (status in statusCounts) {
        statusCounts[status]++;
      }

      // Count by doctor
      if (appointment.doctorId) {
        const doctorId = appointment.doctorId._id || appointment.doctorId;
        const doctorName =
          appointment.doctorId.firstName && appointment.doctorId.lastName
            ? `${appointment.doctorId.fullName} ${appointment.doctorId.employeeId}`
            : appointment.doctorId.name || `Bác sĩ ${doctorId.toString().slice(-6)}`;

        if (!doctorCounts[doctorId]) {
          doctorCounts[doctorId] = {
            name: doctorName,
            count: 0,
          };
        }
        doctorCounts[doctorId].count++;
      }
    });

    // Update stats
    stats.value = {
      total: appointments.length,
      ...statusCounts,
    };

    // Update pie chart data
    chartData.value.datasets[0].data = [
      statusCounts.completed,
      statusCounts.confirmed,
      statusCounts.pending,
      statusCounts.cancelled,
      statusCounts.rejected,
    ];

    // Get top 5 doctors
    const topDoctors = Object.values(doctorCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Update bar chart data
    topDoctorsChartData.value.labels = topDoctors.map(d => d.name);
    topDoctorsChartData.value.datasets[0].data = topDoctors.map(d => d.count);
  } catch (err) {
    console.error('Error fetching appointment statistics:', err);
    error.value = 'Không thể tải dữ liệu thống kê. Vui lòng thử lại.';
  } finally {
    isLoading.value = false;
  }
};

const clearMonthFilter = () => {
  selectedMonth.value = '';
  fetchStatistics();
};

onMounted(() => {
  fetchStatistics();
});
</script>
