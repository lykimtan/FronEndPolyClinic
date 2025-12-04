<template>
  <div class="space-y-6">
    <!-- Status Badge -->
    <div :class="['rounded-2xl shadow-lg p-6 text-white', getStatusColor(appointment.status)]">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <i :class="['text-3xl', getStatusIcon(appointment.status)]"></i>
          <div>
            <p class="text-sm font-medium opacity-90">Trạng thái cuộc hẹn</p>
            <p class="text-2xl font-bold">{{ getStatusLabel(appointment.status) }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm opacity-90">Ngày khám</p>
          <p class="text-3xl font-bold">{{ formatDate(appointment.appointmentDate).day }}</p>
          <p class="text-sm">{{ formatDate(appointment.appointmentDate).monthYear }}</p>
        </div>
      </div>
    </div>

    <!-- Appointment Details Card -->
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div class="px-6 py-6">
        <!-- Specialization -->
        <div class="mb-6">
          <div class="flex items-start gap-3 mb-4">
            <div
              class="flex-none w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"
            >
              <i class="fa-solid fa-hospital text-blue-600"></i>
            </div>
            <div class="flex-1">
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Chuyên khoa</p>
              <p class="text-lg font-semibold text-gray-800">
                {{ appointment.specializationId?.name || 'Chưa cập nhật' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Appointment Time -->
        <div class="mb-6">
          <div class="flex items-start gap-3">
            <div
              class="flex-none w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"
            >
              <i class="fa-solid fa-clock text-green-600"></i>
            </div>
            <div class="flex-1">
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Khung giờ khám</p>
              <p class="text-lg font-semibold text-gray-800">
                {{ appointment.slotId?.time || 'Chưa cập nhật' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-200 my-6"></div>

        <!-- Reason for Appointment -->
        <div v-if="appointment.reason" class="mb-6">
          <div class="flex items-start gap-3">
            <div
              class="flex-none w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"
            >
              <i class="fa-solid fa-notes-medical text-purple-600"></i>
            </div>
            <div class="flex-1">
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Lý do khám</p>
              <p class="text-base text-gray-700">{{ appointment.reason }}</p>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="appointment.notes" class="mb-6">
          <div class="flex items-start gap-3">
            <div
              class="flex-none w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center"
            >
              <i class="fa-solid fa-file-lines text-yellow-600"></i>
            </div>
            <div class="flex-1">
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Ghi chú</p>
              <p class="text-base text-gray-700">{{ appointment.notes }}</p>
            </div>
          </div>
        </div>

        <!-- Rejection Reason -->
        <div
          v-if="appointment.reasonForRejection && appointment.status === 'rejected'"
          class="mb-6"
        >
          <div class="flex items-start gap-3">
            <div class="flex-none w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <i class="fa-solid fa-exclamation text-red-600"></i>
            </div>
            <div class="flex-1">
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Lý do từ chối</p>
              <p class="text-base text-gray-700">{{ appointment.reasonForRejection }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-200"></div>

      <!-- Action Buttons -->
      <div class="px-6 py-4 bg-gray-50 flex flex-wrap gap-3">
        <!-- View Medical Record Button (if completed) -->
        <button
          v-if="appointment.status === 'completed' && appointment.medicalRecordId"
          class="flex-1 min-w-max px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
          @click="viewMedicalRecord"
        >
          <i class="fa-solid fa-file-medical"></i>
          Xem hồ sơ bệnh án
        </button>

        <!-- Cancel Button (if pending) -->
        <button
          v-if="appointment.status === 'pending'"
          class="flex-1 min-w-max px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
          @click="cancelAppointment"
        >
          <i class="fa-solid fa-xmark"></i>
          Hủy lịch hẹn
        </button>

        <!-- Delete Button (if cancelled or rejected) -->
        <button
          v-if="appointment.status === 'cancelled' || appointment.status === 'rejected'"
          class="flex-1 min-w-max px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
          @click="deleteAppointment"
        >
          <i class="fa-solid fa-trash"></i>
          Xóa lịch hẹn
        </button>

        <!-- Back Button -->
        <button
          class="flex-1 min-w-max px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
          @click="goBack"
        >
          <i class="fa-solid fa-arrow-left"></i>
          Quay lại
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { defineProps, defineEmits } from 'vue';

const router = useRouter();

const props = defineProps({
  appointment: {
    type: Object,
    default: () => ({
      _id: '',
      status: 'pending',
      appointmentDate: new Date(),
      specializationId: null,
      slotId: null,
      reason: '',
      notes: '',
      reasonForRejection: '',
      medicalRecordId: null,
    }),
  },
});

const emit = defineEmits(['cancel-appointment', 'delete-appointment']);

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

function viewMedicalRecord() {
  router.push({
    name: 'MyDetailMedicalRecord',
    params: { id: props.appointment.medicalRecordId },
  });
}

function cancelAppointment() {
  emit('cancel-appointment', props.appointment._id);
}

function deleteAppointment() {
  emit('delete-appointment', props.appointment._id);
}

function goBack() {
  router.back();
}
</script>

<style scoped>
.bg-gradient-to-br {
  background: linear-gradient(135deg, var(--tw-gradient-stops));
}

.from-yellow-400 {
  --tw-gradient-from: rgb(250, 204, 21);
  --tw-gradient-to: rgb(250, 204, 21 / 0);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-orange-500 {
  --tw-gradient-to: rgb(249, 115, 22);
}

.from-blue-400 {
  --tw-gradient-from: rgb(96, 165, 250);
  --tw-gradient-to: rgb(96, 165, 250 / 0);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-blue-600 {
  --tw-gradient-to: rgb(37, 99, 235);
}

.from-green-400 {
  --tw-gradient-from: rgb(74, 222, 128);
  --tw-gradient-to: rgb(74, 222, 128 / 0);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-green-600 {
  --tw-gradient-to: rgb(22, 163, 74);
}

.from-gray-400 {
  --tw-gradient-from: rgb(156, 163, 175);
  --tw-gradient-to: rgb(156, 163, 175 / 0);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-gray-600 {
  --tw-gradient-to: rgb(75, 85, 99);
}

.from-red-400 {
  --tw-gradient-from: rgb(248, 113, 113);
  --tw-gradient-to: rgb(248, 113, 113 / 0);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-red-600 {
  --tw-gradient-to: rgb(220, 38, 38);
}
</style>
