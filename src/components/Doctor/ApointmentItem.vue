<template>
  <div
    class="bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 rounded-3xl p-6 mb-4 shadow-xl text-white transition-transform hover:-translate-y-1"
  >
    <!-- Time and Status -->
    <div class="flex justify-between items-center mb-5">
      <div
        class="flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full text-xl font-bold"
      >
        <i class="fa-solid fa-clock"></i>
        {{ formatTime(appointment.slotId?.time) }}
      </div>
      <div
        class="px-5 py-2 rounded-full font-semibold text-sm capitalize"
        :class="getStatusClass(appointment.status)"
      >
        {{ getStatusText(appointment.status) }}
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      <!-- Patient Info (Left Column) -->
      <div class="bg-white/15 backdrop-blur-md rounded-2xl p-5">
        <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
          <i class="fa-solid fa-user-injured"></i>
          Thông tin bệnh nhân
        </h3>

        <div class="flex items-center gap-2.5 mb-3 text-[15px]">
          <i class="fa-solid fa-bed"></i>
          <span class="font-semibold opacity-95">Patient:</span>
          <span class="opacity-90">{{ appointment.patientId?.fullName }}</span>
        </div>

        <div class="flex items-center gap-2.5 mb-3 text-[15px]">
          <i class="fa-solid fa-venus-mars"></i>
          <span class="font-semibold opacity-95">Giới tính:</span>
          <span class="opacity-90">{{
            appointment.patientId?.gender === 'male' ? 'Nam' : 'Nữ'
          }}</span>
        </div>

        <div class="flex items-center gap-2.5 mb-3 text-[15px]">
          <i class="fa-solid fa-calendar-days"></i>
          <span class="font-semibold opacity-95">Năm sinh:</span>
          <span class="opacity-90">{{ formatDate(appointment.patientId?.dateOfBirth) }}</span>
        </div>

        <div class="flex items-center gap-2.5 mb-2 text-[15px]">
          <i class="fa-solid fa-address-book"></i>
          <span class="font-semibold opacity-95">Thông tin liên lạc:</span>
        </div>
        <div class="ml-7 flex flex-col gap-1 text-sm opacity-90">
          <span><i class="fa-solid fa-phone w-4"></i> {{ appointment.patientId?.phone }}</span>
          <span><i class="fa-solid fa-envelope w-4"></i> {{ appointment.patientId?.email }}</span>
        </div>
      </div>

      <!-- Reason & Notes (Right Column) -->
      <div class="bg-white/15 backdrop-blur-md rounded-2xl p-5">
        <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
          <i class="fa-solid fa-clipboard-list"></i>
          Chi tiết cuộc hẹn
        </h3>

        <div v-if="appointment.reason" class="mb-4">
          <div class="flex items-start gap-2.5 mb-2 text-[15px]">
            <i class="fa-solid fa-stethoscope mt-0.5"></i>
            <span class="font-semibold opacity-95">Lí do khám bệnh:</span>
          </div>
          <div class="ml-7 p-3 bg-white/10 rounded-lg text-sm opacity-90">
            {{ appointment.reason }}
          </div>
        </div>

        <div v-if="appointment.notes" class="mb-0">
          <div class="flex items-start gap-2.5 mb-2 text-[15px]">
            <i class="fa-solid fa-note-sticky mt-0.5"></i>
            <span class="font-semibold opacity-95">Ghi chú:</span>
          </div>
          <div class="ml-7 p-3 bg-white/10 rounded-lg text-sm opacity-90">
            {{ appointment.notes }}
          </div>
        </div>

        <div
          v-if="!appointment.reason && !appointment.notes"
          class="flex items-center justify-center h-full text-sm opacity-70 italic"
        >
          <i class="fa-solid fa-inbox mr-2"></i>
          Không có thông tin bổ sung
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <button
      class="w-full py-3.5 bg-white/95 text-indigo-600 rounded-xl text-base font-bold shadow-lg transition-all hover:bg-white hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
      @click="handleStartWork"
    >
      Bắt đầu ca khám bệnh
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  appointment: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['start-work']);

const formatTime = time => {
  if (!time) return 'N/A';
  return time;
};

const formatDate = dateString => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const getStatusClass = status => {
  const statusMap = {
    pending: 'bg-yellow-400/90 text-gray-800',
    confirmed: 'bg-white/95 text-indigo-600',
    completed: 'bg-green-500/90 text-white',
    cancelled: 'bg-red-500/90 text-white',
  };
  return statusMap[status] || 'bg-yellow-400/90 text-gray-800';
};

const getStatusText = status => {
  const statusMap = {
    pending: 'Pending',
    confirmed: 'Approved',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return statusMap[status] || 'Pending';
};

const handleStartWork = () => {
  emit('start-work', props.appointment);
};
</script>
