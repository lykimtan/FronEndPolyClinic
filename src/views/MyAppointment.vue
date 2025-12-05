<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">Lịch khám của tôi</h1>
      <p class="text-gray-600">Quản lý và theo dõi các lịch hẹn khám bệnh của bạn</p>
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
                  <i class="fa-solid fa-user-doctor text-blue-500 text-xl mt-1"></i>
                  <div>
                    <p class="text-sm text-gray-500 font-medium">Bác sĩ khám</p>
                    <p class="text-lg font-bold text-gray-800">
                      {{ appointment.doctorId?.fullName || 'Đang cập nhật' }}
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
                <div v-if="appointment.status === 'rejected'" class="flex items-start gap-3">
                  <i class="fa-solid fa-message text-blue-500 text-xl mt-1"></i>
                  <div>
                    <p class="text-sm text-gray-500 font-medium">Lý do từ chối</p>
                    <p class="text-sm text-gray-600">
                      {{ appointment.reasonForRejection || 'Không có' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 flex flex-wrap gap-3">
              <button
                v-if="appointment.status === 'pending'"
                class="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
                @click="cancelAppointment(appointment._id)"
              >
                <i class="fa-solid fa-xmark"></i>
                Hủy lịch hẹn
              </button>

              <button
                v-if="appointment.status === 'rejected' || appointment.status === 'cancelled'"
                class="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
                @click="deleteAppointment(appointment._id)"
              >
                <i class="fa-solid fa-trash"></i>
                Xóa lịch hẹn
              </button>

              <button
                class="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
                @click="viewDetails(appointment)"
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
      <p class="text-sm text-gray-400 mb-6">Bạn chưa đặt lịch khám nào</p>
      <button
        class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-300"
        @click="$router.push('/appointment/schedule')"
      >
        <i class="fa-solid fa-calendar-plus mr-2"></i>
        Đặt lịch khám ngay
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { useUserStore } from '@/stores/userStore';
import Swal from 'sweetalert2';

const router = useRouter();
const appointmentStore = useAppointmentStore();
const userStore = useUserStore();

const appointments = ref([]);
const currentUser = ref(null);

const loading = ref(true);
const currentFilter = ref('all');

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
  if (filter === 'all') return appointments.value;
  return appointments.value.filter(apt => apt.status === filter);
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
    rejected: 'fa-solid fa-thumbs-down',
  };
  return icons[status] || 'fa-solid fa-question';
}

function getStatusLabel(status) {
  const labels = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    rejected: 'Đã bị từ chối',
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

async function cancelAppointment(appointmentId) {
  const result = await Swal.fire({
    title: 'Bạn có chắc chắn?',
    text: 'Bạn muốn hủy lịch hẹn này. Hành động này có thể được hoàn tác.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#3b82f6',
    confirmButtonText: 'Vâng, hủy nó!',
    cancelButtonText: 'Không, giữ lại',
  });

  if (!result.isConfirmed) return;

  try {
    Swal.fire({
      title: 'Đang xử lý...',
      text: 'Vui lòng chờ trong giây lát',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    await appointmentStore.updateAppointmentStatus(appointmentId, 'cancelled');
    await fetchAppointments();

    Swal.fire({
      title: 'Đã hủy!',
      text: 'Lịch hẹn đã được hủy thành công.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error('Error canceling appointment:', error);

    Swal.fire({
      title: 'Lỗi!',
      text: error.message || 'Có lỗi xảy ra khi hủy lịch hẹn.',
      icon: 'error',
      confirmButtonText: 'Đóng',
    });
  }
}

async function deleteAppointment(appointmentId) {
  const result = await Swal.fire({
    title: 'Bạn có chắc chắn?',
    text: 'Hành động này không thể hoàn tác! Lịch hẹn sẽ bị xóa vĩnh viễn.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Vâng, xóa nó!',
    cancelButtonText: 'Hủy bỏ',
  });

  if (!result.isConfirmed) return;

  try {
    Swal.fire({
      title: 'Đang xóa...',
      text: 'Vui lòng chờ trong giây lát',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    await appointmentStore.deleteAppointment(appointmentId);

    await fetchAppointments();

    Swal.fire({
      title: 'Đã xóa!',
      text: 'Lịch hẹn đã được xóa thành công.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);

    Swal.fire({
      title: 'Lỗi!',
      text: error.message || 'Có lỗi xảy ra khi xóa lịch hẹn.',
      icon: 'error',
      confirmButtonText: 'Đóng',
    });
  }
}

function viewDetails(appointment) {
  router.push({
    name: 'MyDetailAppointment',
    params: { id: appointment._id },
  });
}

function viewMedicalRecord(medicalRecordId) {
  console.log('View medical record:', medicalRecordId);
  router.push({
    name: 'MyDetailMedicalRecord',
    params: { id: medicalRecordId },
  });
}

async function fetchAppointments() {
  try {
    loading.value = true;
    // TODO: Get actual patient ID from auth store
    const patientId = currentUser.value; // Replace with actual user ID
    appointments.value = await appointmentStore.fetchAppointmentsByPatientId(patientId);
    console.log('Fetched appointments:', appointments.value);
  } catch (error) {
    console.error('Error fetching appointments:', error);
  } finally {
    loading.value = false;
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
