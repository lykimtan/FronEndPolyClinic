<template>
  <div class="fixed inset-0 bg-opacity-10 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div
        class="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl"
      >
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">
            {{ isEditMode ? 'Cập nhật lịch định kỳ' : 'Tạo lịch định kỳ mới' }}
          </h2>
          <button
            class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            @click="$emit('close')"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <p v-if="doctorInfo" class="text-indigo-100 mt-2">
          Bác sĩ: {{ doctorInfo.fullName }} ({{ doctorInfo.employeeId }})
        </p>
      </div>

      <!-- Form -->
      <form class="p-6 space-y-6" @submit.prevent="handleSubmit">
        <!-- Day of Week Field -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Số ngày làm việc trong tuần <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="formData.dayOfWeek"
            type="number"
            min="1"
            max="7"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Nhập số ngày (1-7)"
            required
          />
          <p class="text-xs text-gray-500 mt-1">Nhập số ngày làm việc trong tuần (từ 1 đến 7)</p>
        </div>

        <!-- Shift Checkboxes -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            Ca làm việc <span class="text-red-500">*</span>
          </label>
          <div class="space-y-3">
            <!-- Morning Shift -->
            <label
              class="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-indigo-50"
              :class="
                formData.shift.includes('morning')
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200'
              "
            >
              <input
                v-model="formData.shift"
                type="checkbox"
                value="morning"
                class="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <div class="ml-3 flex items-center gap-2">
                <i class="fa-solid fa-sun"></i>
                <span class="font-medium text-gray-700">Ca Sáng</span>
                <span class="text-sm text-gray-500">(7:00 - 12:00)</span>
              </div>
            </label>

            <!-- Afternoon Shift -->
            <label
              class="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-orange-50"
              :class="
                formData.shift.includes('afternoon')
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200'
              "
            >
              <input
                v-model="formData.shift"
                type="checkbox"
                value="afternoon"
                class="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
              />
              <div class="ml-3 flex items-center gap-2">
                <i class="fa-solid fa-sun-plant-wilt"></i>
                <span class="font-medium text-gray-700">Ca Chiều</span>
                <span class="text-sm text-gray-500">(13:00 - 17:00)</span>
              </div>
            </label>

            <!-- Evening Shift -->
            <label
              class="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-purple-50"
              :class="
                formData.shift.includes('evening')
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200'
              "
            >
              <input
                v-model="formData.shift"
                type="checkbox"
                value="evening"
                class="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
              />
              <div class="ml-3 flex items-center gap-2">
                <i class="fa-solid fa-cloud-moon"></i>
                <span class="font-medium text-gray-700">Ca Tối</span>
                <span class="text-sm text-gray-500">(17:00 - 21:00)</span>
              </div>
            </label>
          </div>
          <p v-if="shiftError" class="text-xs text-red-500 mt-2">{{ shiftError }}</p>
          <p v-else class="text-xs text-gray-500 mt-2">Chọn ít nhất một ca làm việc</p>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
        >
          <div class="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
        </div>

        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl"
        >
          <div class="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ successMessage }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            @click="$emit('close')"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg
              v-if="isSubmitting"
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{{ isSubmitting ? 'Đang xử lý...' : isEditMode ? 'Cập nhật' : 'Tạo mới' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRecurringStore } from '@/stores/RecurringStore';

const props = defineProps({
  doctorInfo: {
    type: Object,
    required: true,
  },
  recurringData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'success']);

const recurringStore = useRecurringStore();

const isEditMode = computed(() => !!props.recurringData?.data?._id);
// hai dấu chấm than có nghĩa là ép kiểu biến sau nó thành boolean

const formData = reactive({
  dayOfWeek: 0,
  shift: [],
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const shiftError = ref('');

// Initialize form with existing data if in edit mode
onMounted(() => {
  if (isEditMode.value && props.recurringData?.data) {
    formData.dayOfWeek = props.recurringData.data.dayOfWeek || 0;
    formData.shift = Array.isArray(props.recurringData.data.shift)
      ? [...props.recurringData.data.shift]
      : [];
  }
});

const validateForm = () => {
  errorMessage.value = '';
  shiftError.value = '';

  if (!formData.dayOfWeek || formData.dayOfWeek < 1 || formData.dayOfWeek > 7) {
    errorMessage.value = 'Vui lòng nhập số ngày làm việc từ 1 đến 7';
    return false;
  }

  if (!formData.shift || formData.shift.length === 0) {
    shiftError.value = 'Vui lòng chọn ít nhất một ca làm việc';
    errorMessage.value = 'Vui lòng chọn ít nhất một ca làm việc';
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const scheduleData = {
      doctorId: props.doctorInfo._id,
      dayOfWeek: formData.dayOfWeek,
      shift: formData.shift,
    };

    if (isEditMode.value) {
      // Update existing schedule
      const scheduleId = props.recurringData?.data?._id;
      if (!scheduleId) {
        throw new Error('Không tìm thấy ID lịch định kỳ để cập nhật');
      }
      await recurringStore.updateRecurringSchedule(scheduleId, scheduleData);
      successMessage.value = 'Cập nhật lịch định kỳ thành công!';
    } else {
      // Create new schedule
      await recurringStore.createRecurringSchedule(scheduleData);
      successMessage.value = 'Tạo lịch định kỳ thành công!';
    }

    setTimeout(() => {
      emit('success');
      emit('close');
    }, 1500);
  } catch (error) {
    console.error('Error submitting form:', error);
    errorMessage.value = error.message || 'Có lỗi xảy ra, vui lòng thử lại';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Custom checkbox styling */
input[type='checkbox']:checked {
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
