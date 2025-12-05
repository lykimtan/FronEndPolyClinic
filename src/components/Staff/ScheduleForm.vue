<template>
  <div class="bg-white rounded-lg shadow-lg p-8">
    <form @submit.prevent="handleSubmit">
      <!-- Selected Doctor Info -->
      <div v-if="selectedDoctor" class="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
        <p class="text-gray-700">
          <span class="font-semibold">Bác sĩ được chọn:</span>
          <span class="text-green-700 font-bold ml-2">{{ selectedDoctor.fullName }}</span>
        </p>
        <p class="text-gray-600 mt-1">
          <span>Chuyên khoa:</span>
          <span class="font-semibold text-green-700 ml-2">
            {{
              selectedDoctor.specializationIds && selectedDoctor.specializationIds.length > 0
                ? selectedDoctor.specializationIds[0]?.name
                : 'N/A'
            }}
          </span>
        </p>
      </div>

      <div
        v-else
        class="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg text-yellow-700"
      >
        <i class="fa-solid fa-exclamation-circle mr-2"></i>
        Vui lòng chọn một bác sĩ từ danh sách bên trái
      </div>

      <!-- Date Selection -->
      <div class="mb-6">
        <label class="block text-gray-700 font-semibold mb-3">
          <i class="fa-solid fa-calendar text-blue-600 mr-2"></i>Ngày Làm Việc
        </label>
        <input
          v-model="formData.date"
          type="date"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
          required
        />
      </div>

      <!-- Multiple Shifts Selection -->
      <div class="mb-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <p class="text-gray-700 font-semibold mb-4">
          <i class="fa-solid fa-info-circle text-blue-600 mr-2"></i>Tạo cho nhiều ca trong cùng
          ngày?
        </p>
        <div class="grid grid-cols-1 gap-3">
          <label
            v-for="shift in shifts"
            :key="`multi-${shift.value}`"
            class="flex items-center p-3 bg-white border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition"
          >
            <input
              :checked="formData.multipleShifts.includes(shift.value)"
              type="checkbox"
              class="w-4 h-4 cursor-pointer"
              @change="toggleMultipleShift(shift.value)"
            />
            <span class="ml-3 text-gray-700 font-medium">{{ shift.label }}</span>
          </label>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex gap-4">
        <button
          type="submit"
          :disabled="isLoading || !selectedDoctor"
          class="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <i v-if="!isLoading" class="fa-solid fa-plus mr-2"></i>
          <span v-if="isLoading" class="animate-spin mr-2">
            <i class="fa-solid fa-spinner"></i>
          </span>
          {{ isLoading ? 'Đang tạo...' : 'Tạo Lịch Làm Việc' }}
        </button>
        <button
          type="reset"
          class="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
          @click="resetForm"
        >
          <i class="fa-solid fa-redo mr-2"></i>Reset
        </button>
      </div>
    </form>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="mt-6 p-4 bg-green-100 border-2 border-green-500 text-green-700 rounded-lg flex items-start"
    >
      <i class="fa-solid fa-check-circle mr-3 text-xl mt-1"></i>
      <div>
        <p class="font-semibold">Thành công!</p>
        <p>{{ successMessage }}</p>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="mt-6 p-4 bg-red-100 border-2 border-red-500 text-red-700 rounded-lg flex items-start"
    >
      <i class="fa-solid fa-exclamation-circle mr-3 text-xl mt-1"></i>
      <div>
        <p class="font-semibold">Lỗi!</p>
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

defineProps({
  selectedDoctor: {
    type: Object,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['submit', 'reset']);

const formData = ref({
  date: '',
  multipleShifts: [],
});

const successMessage = ref('');
const errorMessage = ref('');

const shifts = [
  {
    value: 'morning',
    label: 'Buổi Sáng',
    time: '8:00 - 12:00',
  },
  {
    value: 'afternoon',
    label: ' Buổi Chiều',
    time: '13:00 - 17:00',
  },
  {
    value: 'evening',
    label: 'Buổi Tối',
    time: '18:00 - 21:00',
  },
];

const toggleMultipleShift = value => {
  const index = formData.value.multipleShifts.indexOf(value);
  if (index > -1) {
    formData.value.multipleShifts.splice(index, 1);
  } else {
    formData.value.multipleShifts.push(value);
  }
};

const handleSubmit = async () => {
  // Validate form
  if (!formData.value.date || formData.value.multipleShifts.length === 0) {
    errorMessage.value = 'Vui lòng chọn ngày và ít nhất một ca làm việc';
    return;
  }

  errorMessage.value = '';
  successMessage.value = '';

  emit('submit', {
    date: formData.value.date,
    shifts: formData.value.multipleShifts,
    setSuccessMessage: msg => (successMessage.value = msg),
    setErrorMessage: msg => (errorMessage.value = msg),
  });
};

const resetForm = () => {
  formData.value = {
    date: '',
    multipleShifts: [],
  };
  successMessage.value = '';
  errorMessage.value = '';
  emit('reset');
};

defineExpose({
  successMessage,
  errorMessage,
  resetForm,
});
</script>
