<template>
  <div class="mx-auto px-4 py-8 bg-[#2563EB]">
    <!-- Header -->
    <div class="mb-8 text-white">
      <h1 class="text-4xl font-bold mb-2">Lịch hẹn của tôi</h1>
      <p class="text-gray-200">Quản lý và theo dõi các lịch hẹn khám bệnh của bạn</p>
    </div>

    <!-- Search and Filter Section -->
    <div class="mb-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Search by Patient Name -->
        <div>
          <label class="flex items-center text-sm font-medium text-gray-700 mb-2">
            <i class="fa-solid fa-search mr-2 text-blue-600"></i>
            Tìm kiếm theo tên bệnh nhân
          </label>
          <input
            v-model="searchPatientName"
            type="text"
            placeholder="Nhập tên bệnh nhân..."
            class="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-gray-100"
          />
        </div>

        <!-- Filter by Date -->
        <div>
          <label class="flex items-center text-sm font-medium text-gray-700 mb-2">
            <i class="fa-solid fa-calendar mr-2 text-blue-600"></i>
            Lọc theo ngày
          </label>
          <input
            v-model="filterDate"
            type="date"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-gray-100"
          />
        </div>
      </div>

      <!-- Reset Filters Button -->
      <button
        v-if="searchPatientName || filterDate"
        class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium shadow-sm transition-all flex items-center"
        @click="resetFilters"
      >
        <i class="fa-solid fa-times mr-2"></i>
        Xóa bộ lọc
      </button>
    </div>

    <!-- Filter Tabs -->
    <div class="mb-6 flex flex-wrap gap-3">
      <button
        v-for="filter in filterOptions"
        :key="filter.value"
        :class="[
          'px-6 py-3 rounded-full font-medium transition-all duration-300',
          currentFilter === filter.value
            ? 'bg-blue-500 text-white shadow-lg scale-105'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ]"
        @click="currentFilter = filter.value"
      >
        {{ filter.label }}
        <span
          v-if="getFilteredAppointments(filter.value).length > 0"
          class="ml-2 px-2 py-1 text-xs rounded-full"
          :class="
            currentFilter === filter.value ? 'bg-white text-blue-500' : 'bg-gray-300 text-gray-700'
          "
        >
          {{ getFilteredAppointments(filter.value).length }}
        </span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <i class="fa-solid fa-spinner fa-spin text-blue-500 text-5xl mb-4"></i>
        <p class="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    </div>

    <!-- Appointments List -->
    <TransitionGroup
      v-else-if="filteredAppointments.length > 0"
      name="list"
      tag="div"
      class="space-y-4"
    >
      <div
        v-for="(appointment, index) in filteredAppointments"
        :key="appointment._id"
        :style="{ '--index': index }"
        class="appointment-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <div class="flex flex-col md:flex-row">
          <!-- Status Badge & Date Section -->
          <div
            :class="[
              'flex-none w-full md:w-48 p-6 flex flex-col items-center justify-center text-white',
              getStatusColor(appointment.status),
            ]"
          >
            <div class="text-center">
              <i :class="['text-4xl mb-3', getStatusIcon(appointment.status)]"></i>
              <p class="text-sm font-medium mb-1">{{ getStatusLabel(appointment.status) }}</p>
              <div class="bg-white/20 rounded-lg px-3 py-2 mt-2">
                <p class="text-2xl font-bold">
                  {{ formatDate(appointment.appointmentDate).day }}
                </p>
                <p class="text-sm">{{ formatDate(appointment.appointmentDate).monthYear }}</p>
              </div>
            </div>
          </div>

          <!-- Appointment Details -->
          <div class="flex-1 p-6">
            <div class="grid md:grid-cols-2 gap-4">
              <!-- Doctor Info -->
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <i class="fa-solid fa-bed text-blue-500 text-xl mt-1"></i>
                  <div>
                    <p class="text-sm text-gray-500 font-medium">Họ tên bệnh nhân</p>
                    <p class="text-lg font-bold text-gray-800">
                      {{ appointment.patientId?.fullName || 'Đang cập nhật' }}
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <i class="fa-solid fa-hospital text-blue-500 text-xl mt-1"></i>
                  <div>
                    <p class="text-sm text-gray-500 font-medium">Chuyên khoa</p>
                    <p class="text-base font-semibold text-gray-700">
                      {{ appointment.specializationId?.name || 'Đang cập nhật' }}
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <i class="fa-solid fa-clock text-blue-500 text-xl mt-1"></i>
                  <div>
                    <p class="text-sm text-gray-500 font-medium">Thời gian khám</p>
                    <p class="text-base font-semibold text-gray-700">
                      {{ appointment.slotId?.time || 'Đang cập nhật' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Additional Info -->
              <div class="space-y-3">
                <div v-if="appointment.reason" class="flex items-start gap-3">
                  <i class="fa-solid fa-notes-medical text-blue-500 text-xl mt-1"></i>
                  <div>
                    <p class="text-sm text-gray-500 font-medium">Lý do khám</p>
                    <p class="text-base text-gray-700">{{ appointment.reason }}</p>
                  </div>
                </div>

                <div v-if="appointment.notes" class="flex items-start gap-3">
                  <i class="fa-solid fa-file-lines text-blue-500 text-xl mt-1"></i>
                  <div>
                    <p class="text-sm text-gray-500 font-medium">Ghi chú</p>
                    <p class="text-base text-gray-700">{{ appointment.notes }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <i class="fa-solid fa-calendar-check text-blue-500 text-xl mt-1"></i>
                  <div>
                    <p class="text-sm text-gray-500 font-medium">Ngày tạo lịch</p>
                    <p class="text-sm text-gray-600">
                      {{ formatCreatedDate(appointment.createdAt) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 flex flex-wrap gap-3">
              <button
                v-if="appointment.status === 'pending'"
                class="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
                @click="approveAppointment(appointment._id)"
              >
                <i class="fa-solid fa-check"></i>
                Duyệt lịch hẹn
              </button>

              <button
                v-if="appointment.status === 'pending'"
                class="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
                @click="rejectAppointment(appointment._id)"
              >
                <i class="fa-solid fa-x"></i>
                Từ chối lịch hẹn
              </button>

              <button
                class="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
                @click="viewDetails(appointment._id)"
              >
                <i class="fa-solid fa-eye"></i>
                Xem chi tiết
              </button>

              <button
                v-if="appointment.status === 'completed' && appointment.medicalRecordId"
                class="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
                @click="viewMedicalRecord(appointment.medicalRecordId)"
              >
                <i class="fa-solid fa-file-medical"></i>
                Xem hồ sơ bệnh án
              </button>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <i class="fa-solid fa-calendar-xmark text-gray-300 text-6xl mb-4"></i>
      <p class="text-xl text-gray-500 font-medium mb-2">Không có lịch hẹn nào</p>
      <p class="text-sm text-gray-400 mb-6">Bạn chưa có lịch hẹn nào</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { useUserStore } from '@/stores/userStore';
import Swal from 'sweetalert2';
import router from '@/router';

const appointmentStore = useAppointmentStore();
const userStore = useUserStore();

const appointments = ref([]);
const currentUser = ref(null);

const loading = ref(true);
const currentFilter = ref('all');
const searchPatientName = ref('');
const filterDate = ref('');

const filterOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Chờ xác nhận', value: 'pending' },
  { label: 'Đã xác nhận', value: 'confirmed' },
  { label: 'Hoàn thành', value: 'completed' },
  { label: 'Đã hủy', value: 'cancelled' },
  { label: 'Đã từ chối', value: 'rejected' },
];

const filteredAppointments = computed(() => {
  return getFilteredAppointments(currentFilter.value);
});

function getFilteredAppointments(filter) {
  let results = appointments.value;

  // Filter by status
  if (filter !== 'all') {
    results = results.filter(apt => apt.status === filter);
  }

  // Filter by patient name
  if (searchPatientName.value.trim()) {
    const searchTerm = searchPatientName.value.toLowerCase().trim();
    results = results.filter(apt => apt.patientId?.fullName?.toLowerCase().includes(searchTerm));
  }

  // Filter by date
  if (filterDate.value) {
    const selectedDate = new Date(filterDate.value).toISOString().split('T')[0];
    results = results.filter(apt => {
      const appointmentDateStr = new Date(apt.appointmentDate).toISOString().split('T')[0];
      return appointmentDateStr === selectedDate;
    });
  }

  return results;
}

function resetFilters() {
  searchPatientName.value = '';
  filterDate.value = '';
}

function getStatusColor(status) {
  const colors = {
    pending: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    confirmed: 'bg-gradient-to-br from-blue-400 to-blue-600',
    completed: 'bg-gradient-to-br from-green-400 to-green-600',
    cancelled: 'bg-gradient-to-br from-gray-400 to-gray-600',
    rejected: 'bg-gradient-to-br from-red-400 to-red-600',
  };
  return colors[status] || 'bg-gradient-to-br from-gray-400 to-gray-600';
}

function getStatusIcon(status) {
  const icons = {
    pending: 'fa-solid fa-clock',
    confirmed: 'fa-solid fa-check-circle',
    completed: 'fa-solid fa-circle-check',
    cancelled: 'fa-solid fa-ban',
  };
  return icons[status] || 'fa-solid fa-question';
}

function getStatusLabel(status) {
  const labels = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    rejected: 'Đã từ chối',
  };
  return labels[status] || 'Không xác định';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('vi-VN', { month: 'long' });
  const year = date.getFullYear();

  return {
    day: day,
    monthYear: `${month} ${year}`,
  };
}

function formatCreatedDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function rejectAppointment(appointmentId) {
  // Hỏi lý do từ chối (Optional - nâng cao trải nghiệm)
  const reason = prompt('Nhập lý do từ chối (để trống nếu không cần):');
  if (reason === null) return; // Nếu user bấm Cancel ở popup

  try {
    await appointmentStore.updateAppointmentStatus(appointmentId, 'rejected');

    await fetchAppointments();
    alert('Đã từ chối lịch hẹn.');
  } catch (error) {
    console.error('Lỗi khi từ chối lịch:', error);
    alert('Có lỗi xảy ra khi hủy lịch hẹn.');
  }
}

function viewDetails(appointmentId) {
  console.log('View appointment details:', appointmentId);
  router.push({
    name: 'DetailAppointment',
    params: {
      id: appointmentId,
    },
  });
}
function viewMedicalRecord(medicalRecordId) {
  console.log('View medical record:', medicalRecordId);
  // TODO: Navigate to medical record page
}

async function fetchAppointments() {
  try {
    loading.value = true;
    // TODO: Get actual patient ID from auth store
    const doctorId = currentUser.value; // Replace with actual user ID
    appointments.value = await appointmentStore.fetchAppointmentsByDoctorId(doctorId);
    console.log('Fetched appointments:', appointments.value);
  } catch (error) {
    console.error('Error fetching appointments:', error);
  } finally {
    loading.value = false;
  }
}

async function approveAppointment(appointmentId) {
  const result = await Swal.fire({
    title: 'Xác nhận duyệt lịch?',
    text: 'Bạn có chắc chắn muốn duyệt lịch hẹn này không?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10B981',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Đồng ý duyệt',
    cancelButtonText: 'Hủy bỏ',
  });

  if (!result.isConfirmed) return;

  try {
    Swal.fire({
      title: 'Đang xử lý...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    await appointmentStore.updateAppointmentStatus(appointmentId, 'confirmed');
    await fetchAppointments();

    // Thông báo thành công
    Swal.fire({
      title: 'Thành công!',
      text: 'Đã duyệt lịch hẹn thành công.',
      icon: 'success',
      confirmButtonColor: '#10B981',
      timer: 2000,
    });
  } catch (error) {
    console.error('Lỗi khi duyệt lịch:', error);
    Swal.fire({
      title: 'Lỗi!',
      text: 'Có lỗi xảy ra, vui lòng thử lại.',
      icon: 'error',
    });
  }
}

onMounted(async () => {
  currentUser.value = userStore.getUserInfo.id;
  console.log('Current User ID:', currentUser.value);

  await fetchAppointments();
});
</script>

<style scoped>
.appointment-card {
  animation: fadeInUp 0.5s ease-out backwards;
  animation-delay: calc(var(--index) * 0.1s);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-20px) scale(0.95);
}

.list-move {
  transition: transform 0.4s ease;
}
</style>
