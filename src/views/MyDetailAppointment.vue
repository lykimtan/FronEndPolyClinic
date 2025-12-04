<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">Chi tiết cuộc hẹn</h1>
      <p class="text-gray-600">Xem toàn bộ thông tin về cuộc khám bệnh của bạn</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <i class="fa-solid fa-spinner fa-spin text-blue-500 text-5xl mb-4"></i>
        <p class="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    </div>

    <!-- Appointment Details -->
    <div v-else-if="appointment" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Doctor Info -->
      <div class="lg:col-span-1">
        <DoctorInfoCard
          :doctor="appointment.doctorId"
          :specialization-name="appointment.specializationId.name"
        />
      </div>

      <!-- Right Column: Appointment Info -->
      <div class="lg:col-span-2 space-y-6">
        <AppointmentInfoCard
          :appointment="appointment"
          @cancel-appointment="handleCancelAppointment"
          @delete-appointment="handleDeleteAppointment"
        />

        <!-- Rating Component -->
        <DoctorRatingCard :appointment="appointment" />
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="text-center py-20">
      <i class="fa-solid fa-calendar-xmark text-gray-300 text-6xl mb-4"></i>
      <p class="text-xl text-gray-500 font-medium mb-2">Không tìm thấy cuộc hẹn</p>
      <p class="text-sm text-gray-400 mb-6">Lịch khám bạn tìm kiếm không tồn tại</p>
      <button
        class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-300"
        @click="$router.push('/my-appointments')"
      >
        <i class="fa-solid fa-arrow-left mr-2"></i>
        Quay lại danh sách lịch khám
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppointmentStore } from '@/stores/appointmentStore';
import DoctorInfoCard from '@/components/Patient/DoctorInfoCard.vue';
import AppointmentInfoCard from '@/components/Patient/AppointmentInfoCard.vue';
import DoctorRatingCard from '@/components/Patient/DoctorRatingCard.vue';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const appointmentStore = useAppointmentStore();

const appointment = ref(null);
const loading = ref(true);

async function fetchAppointmentDetails() {
  try {
    loading.value = true;
    const appointmentId = route.params.id;
    appointment.value = await appointmentStore.fetchAppointmentById(appointmentId);
    console.log('Fetched appointment:', appointment.value);
    console.log('specialization:', appointment.value.specializationId.name);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    Swal.fire({
      title: 'Lỗi!',
      text: error.message || 'Không thể tải thông tin cuộc hẹn',
      icon: 'error',
      confirmButtonText: 'Đóng',
    });
  } finally {
    loading.value = false;
  }
}

async function handleCancelAppointment(appointmentId) {
  const result = await Swal.fire({
    title: 'Xác nhận hủy lịch hẹn',
    text: 'Bạn có chắc chắn muốn hủy cuộc hẹn này?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f87171',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Vâng, hủy nó!',
    cancelButtonText: 'Không, giữ lại',
  });

  if (!result.isConfirmed) return;

  try {
    Swal.fire({
      title: 'Đang hủy...',
      text: 'Vui lòng chờ trong giây lát',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    await appointmentStore.updateAppointmentStatus(appointmentId, 'cancelled');

    await fetchAppointmentDetails();

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

async function handleDeleteAppointment(appointmentId) {
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

    Swal.fire({
      title: 'Đã xóa!',
      text: 'Lịch hẹn đã được xóa thành công.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });

    router.push('/my-appointments');
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

onMounted(async () => {
  await fetchAppointmentDetails();
});
</script>
