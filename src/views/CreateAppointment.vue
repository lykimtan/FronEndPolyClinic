<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          <i class="fa-solid fa-calendar-check text-indigo-600"></i>
          Đặt lịch khám
        </h1>
        <p class="text-gray-600">Vui lòng điền thông tin để đặt lịch khám bệnh</p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Doctor Info Section -->
        <div v-if="doctorInfo" class="mb-6 p-4 bg-indigo-50 rounded-xl">
          <h3 class="text-lg font-semibold text-indigo-900 mb-2 flex items-center gap-2">
            <i class="fa-solid fa-user-doctor"></i>
            Thông tin bác sĩ
          </h3>
          <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Bác sĩ:</span>
              <span class="font-semibold text-gray-800 ml-2">{{ doctorInfo.fullName }}</span>
            </div>
            <div>
              <span class="text-gray-600">Chuyên khoa:</span>
              <span class="font-semibold text-gray-800 ml-2">{{
                doctorInfo.specializationIds?.map(s => s.name).join(', ') || 'N/A'
              }}</span>
            </div>
          </div>
        </div>

        <!-- Schedule Info Section -->
        <div v-if="scheduleInfo" class="mb-6 p-4 bg-green-50 rounded-xl">
          <h3 class="text-lg font-semibold text-green-900 mb-2 flex items-center gap-2">
            <i class="fa-solid fa-clock"></i>
            Thông tin lịch khám
          </h3>
          <div class="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Ngày:</span>
              <span class="font-semibold text-gray-800 ml-2">{{
                formatDate(scheduleInfo.date)
              }}</span>
            </div>
            <div>
              <span class="text-gray-600">Giờ:</span>
              <span class="font-semibold text-gray-800 ml-2">{{
                selectedSlot?.time || 'N/A'
              }}</span>
            </div>
            <div>
              <span class="text-gray-600">Ca:</span>
              <span class="font-semibold text-gray-800 ml-2">{{
                formatShift(scheduleInfo.shift)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Reason Field -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fa-solid fa-notes-medical mr-1"></i>
              Lý do khám <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formData.reason"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              placeholder="Mô tả triệu chứng, lý do khám..."
              required
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Vui lòng mô tả chi tiết triệu chứng để bác sĩ chuẩn bị tốt hơn
            </p>
          </div>

          <!-- Notes Field (Optional) -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fa-solid fa-comment mr-1"></i>
              Ghi chú thêm (không bắt buộc)
            </label>
            <textarea
              v-model="formData.notes"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              placeholder="Ghi chú thêm (nếu có)..."
            ></textarea>
          </div>

          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2"
          >
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Success Message -->
          <div
            v-if="successMessage"
            class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2"
          >
            <i class="fa-solid fa-circle-check"></i>
            <span>{{ successMessage }}</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-4">
            <button
              type="button"
              class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              @click="goBack"
            >
              <i class="fa-solid fa-arrow-left mr-2"></i>
              Quay lại
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-calendar-check"></i>
              <span>{{ isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt lịch' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Info Notice -->
      <div class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div class="flex items-start gap-3">
          <i class="fa-solid fa-info-circle text-blue-600 text-xl mt-0.5"></i>
          <div class="text-sm text-blue-800">
            <p class="font-semibold mb-1">Lưu ý quan trọng:</p>
            <ul class="list-disc list-inside space-y-1 text-blue-700">
              <li>Vui lòng đến phòng khám trước 15 phút so với giờ hẹn</li>
              <li>Mang theo CMND/CCCD và sổ khám bệnh (nếu có)</li>
              <li>Nếu cần hủy lịch, vui lòng liên hệ trước 24 giờ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Toaster position="top-right" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { useDoctorStore } from '@/stores/DoctorStore';
import { useDoctorScheduleStore } from '@/stores/DoctorScheduleStore';
import { useRoute, useRouter } from 'vue-router';
import { toast, Toaster } from 'vue-sonner';

const appointmentStore = useAppointmentStore();
const doctorStore = useDoctorStore();
const scheduleStore = useDoctorScheduleStore();
const route = useRoute();
const router = useRouter();

// Query params
const doctorId = ref(route.query.doctorId);
const scheduleId = ref(route.query.scheduleId);
const slotId = ref(route.query.slotId);

// Form data
const formData = ref({
  reason: '',
  notes: '',
});

// State
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Doctor & Schedule info
const doctorInfo = ref(null);
const scheduleInfo = ref(null);
const selectedSlot = ref(null);

// Load data on mount
onMounted(async () => {
  console.log('Query params:', route.query);

  if (!doctorId.value || !scheduleId.value || !slotId.value) {
    errorMessage.value = 'Thiếu thông tin đặt lịch. Vui lòng chọn lại.';
    toast.error('Thiếu thông tin đặt lịch');
    return;
  }

  try {
    // Fetch doctor info
    await doctorStore.fetchDoctors();
    doctorInfo.value = doctorStore.getAll.find(d => d._id === doctorId.value);

    // Fetch schedule info
    const schedules = await scheduleStore.fetchSchedulesByDoctorId(doctorId.value);
    scheduleInfo.value = schedules.find(s => s._id === scheduleId.value);

    // Find selected slot
    if (scheduleInfo.value?.availableSlots) {
      selectedSlot.value = scheduleInfo.value.availableSlots.find(
        slot => slot._id === slotId.value
      );
    }

    console.log('Doctor info:', doctorInfo.value);
    console.log(' Schedule info:', scheduleInfo.value);
    console.log(' Selected slot:', selectedSlot.value);
  } catch (error) {
    console.error('Error loading data:', error);
    errorMessage.value = 'Không thể tải thông tin. Vui lòng thử lại.';
  }
});

// Helper functions
const formatDate = dateString => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatShift = shift => {
  const shiftMap = {
    morning: 'Sáng',
    afternoon: 'Chiều',
    evening: 'Tối',
  };
  return shiftMap[shift] || shift;
};

const goBack = () => {
  router.back();
};

const handleSubmit = async () => {
  if (!formData.value.reason.trim()) {
    errorMessage.value = 'Vui lòng nhập lý do khám';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const appointmentData = {
      doctorId: doctorId.value,
      scheduleId: scheduleId.value,
      slotId: slotId.value,
      appointmentDate: scheduleInfo.value?.date || route.query.date,
      specializationId:
        doctorInfo.value?.specializationIds?.[0]?._id || doctorInfo.value?.specializationIds?.[0],
      reason: formData.value.reason.trim(),
      notes: formData.value.notes.trim(),
    };

    console.log('Submitting appointment:', appointmentData);

    const result = await appointmentStore.createAppointment(appointmentData);

    console.log('Appointment created:', result);

    successMessage.value = 'Đặt lịch thành công!';
    toast.success('Đặt lịch khám thành công!');

    // Redirect after 2 seconds
    setTimeout(() => {
      router.push({ name: 'MyAppointments' });
    }, 2000);
  } catch (error) {
    console.error('Error creating appointment:', error);
    errorMessage.value = error.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
    toast.error('Bạn đã có lịch khám vào thời gian này. Vui lòng chọn thời gian khác.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
