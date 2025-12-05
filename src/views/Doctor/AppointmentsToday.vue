<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Today's Appointments</h1>
        <p class="text-gray-600">{{ formatDateHeader(today) }}</p>
      </div>

      <!-- Empty State -->
      <div
        v-if="appointmentsToday.length === 0"
        class="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-2xl shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-24 w-24 text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No Appointments Today</h3>
        <p class="text-gray-500 text-center max-w-md">
          Bạn không có lịch hẹn nào trong ngày hôm nay. Tận hưởng thời gian rảnh của bạn nào.
        </p>
      </div>

      <!-- Appointments List -->
      <div v-else class="space-y-4">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-gray-600">
            <span class="font-semibold text-indigo-600">{{ appointmentsToday.length }}</span>
            Lịch hẹn hôm nay. Chúc bạn có một ngày làm việc hiệu quả!
          </p>
        </div>

        <AppointmentItem
          v-for="appointment in appointmentsToday"
          :key="appointment._id"
          :appointment="appointment"
          @start-work="handleStartWork"
          @detail-medical-record="handleDetailMedicalRecord"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { useRouter } from 'vue-router';
import AppointmentItem from '@/components/Doctor/ApointmentItem.vue';

const appointmentStore = useAppointmentStore();
const appointmentsToday = ref([]);
const today = new Date().toLocaleDateString('en-CA');
const router = useRouter();
const formatDateHeader = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const handleStartWork = appointment => {
  router.push({ name: 'ExaminationRoom', params: { id: appointment._id } });
};

const handleDetailMedicalRecord = appointment => {
  router.push({ name: 'DetailMedicalRecord', params: { id: appointment.medicalRecordId } });
};

onMounted(async () => {
  try {
    appointmentsToday.value = await appointmentStore.fetchAllAppointmentsByDate(today);

    // Sắp xếp: non-completed ở trên (theo time), completed ở dưới (theo time)
    appointmentsToday.value.sort((a, b) => {
      const isCompletedA = a.status === 'completed';
      const isCompletedB = b.status === 'completed';

      // Nếu status khác nhau: non-completed trước (ở trên)
      if (isCompletedA !== isCompletedB) {
        return isCompletedA ? 1 : -1;
      }

      // Nếu status giống nhau: sắp xếp theo time tăng dần
      const timeA = a.slotId?.time || '';
      const timeB = b.slotId?.time || '';
      return timeA.localeCompare(timeB);
    });

    console.log("Today's appointments:", appointmentsToday.value);
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
  }
});
</script>
