<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800">Phòng Khám</h1>
      <p class="text-gray-600 mt-2">Tạo hồ sơ y tế cho bệnh nhân</p>
    </div>

    <!-- Loading State -->
    <div v-if="!appointment" class="flex items-center justify-center h-96">
      <div class="text-center">
        <i class="fa-solid fa-spinner fa-spin text-blue-500 text-5xl mb-4"></i>
        <p class="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Column 1: Patient & Appointment Info -->
      <div class="lg:col-span-1 space-y-6">
        <PatientInfoCard :patient="appointment.patientId" />
        <AppointmentDetails :appointment="appointment" />
      </div>

      <!-- Column 2: Medical Record Form -->
      <div class="lg:col-span-2">
        <MedicalRecordForm :appointment="appointment" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppointmentStore } from '@/stores/appointmentStore';
import Swal from 'sweetalert2';

import PatientInfoCard from '../../components/Doctor/PatientInfoCard.vue';
import AppointmentDetails from '../../components/Doctor/AppointmentDetails.vue';
import MedicalRecordForm from '../../components/Doctor/MedicalRecordForm.vue';

const route = useRoute();
const router = useRouter();
const appointmentId = route.params.id;
const appointmentStore = useAppointmentStore();

const appointment = ref(null);

onMounted(async () => {
  try {
    appointment.value = await appointmentStore.fetchAppointmentById(appointmentId);
    console.log('Loaded appointment:', appointment.value);
  } catch (error) {
    console.error('Error loading appointment:', error);
    Swal.fire({
      title: 'Lỗi!',
      text: 'Không thể tải thông tin cuộc hẹn',
      icon: 'error',
      confirmButtonText: 'Quay lại',
    }).then(() => {
      router.back();
    });
  }
});
</script>
