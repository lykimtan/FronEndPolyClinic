<template>
  <div
    class="bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 mb-5"
  >
    <!-- Card Content -->
    <div class="grid grid-cols-2 h-full">
      <!-- Left: Avatar Section -->
      <div class="bg-white flex flex-col items-center justify-center p-6">
        <div class="relative">
          <img
            :src="getAvatarUrl(doctor.avatar)"
            :alt="doctor.fullName"
            class="w-32 h-32 rounded-full object-cover border-4 border-gray-300 shadow-lg"
          />
          <!-- ID Badge -->
          <div
            class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md"
          >
            <p class="text-xs text-gray-600 font-medium">
              {{ doctor.employeeId }}
            </p>
          </div>
        </div>
      </div>

      <!-- Right: Info Section -->
      <div class="flex flex-col justify-between p-6">
        <div>
          <h3 class="text-xl font-bold text-gray-800 mb-1">Bác sĩ: {{ doctor.fullName }}</h3>
          <p class="text-sm text-gray-600 mb-3">MSNV: {{ doctor.employeeId }}</p>
        </div>

        <!-- Schedule Info -->
        <div class="space-y-2">
          <!-- If recurring schedule exists -->
          <div v-if="recurring?.data" class="text-center">
            <h4 class="text-lg font-semibold text-gray-800 mb-2">Lịch làm việc</h4>
            <p class="text-sm text-gray-600">
              Ngày làm việc:
              <span class="font-bold">{{ recurring?.data?.dayOfWeek }} ngày / Tuần</span>
            </p>
            <p class="text-sm text-gray-600 mt-1">
              Ca làm việc:
              <span class="font-bold">{{ formatShifts(recurring?.data?.shift) }}</span>
            </p>

            <!-- Update Button -->
            <button
              class="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 shadow-md"
              @click="handleUpdate"
            >
              Cập nhật
            </button>
          </div>

          <!-- If no recurring schedule -->
          <div v-else class="text-center">
            <h4 class="text-lg font-semibold text-gray-800 mb-2">Lịch làm việc</h4>
            <p class="text-sm text-gray-500 mb-4">Chưa có lịch định kỳ</p>

            <!-- Create Button -->
            <button
              class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
              @click="handleCreate"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              Tạo lịch
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Form Modal -->
  <FormRecurringSchedule
    v-if="showForm"
    :doctor-info="doctor"
    :recurring-data="recurring"
    @close="showForm = false"
    @success="handleFormSuccess"
  />
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';
import { useRecurringStore } from '@/stores/RecurringStore';
import FormRecurringSchedule from '@/views/Staff/FormRecurringSchedule.vue';

const recurringStore = useRecurringStore();
const recurring = ref(null);
const showForm = ref(false);

const props = defineProps({
  doctor: {
    type: Object,
    required: true,
  },
});

onMounted(async () => {
  try {
    const data = await recurringStore.fetchRecurringByDoctorId(props.doctor._id);
    recurring.value = data;
    console.log('=== Recurring Schedule Data ===');
    console.log('Doctor:', props.doctor.fullName);
    console.log('Full Recurring Object:', recurring.value);
    console.log('Data nested:', recurring.value?.data);
    console.log('Day of Week:', recurring.value?.data?.dayOfWeek);
    console.log('Shifts:', recurring.value?.data?.shift);
  } catch (error) {
    console.error('Error loading recurring schedule:', error);
  }
});

const getAvatarUrl = avatar => {
  if (!avatar) return '/src/assets/images/avartar.jpg';
  if (avatar.startsWith('http') || avatar.startsWith('https')) return avatar;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${avatar}`;
};

// Format shifts array to readable text
const formatShifts = shifts => {
  if (!shifts || !Array.isArray(shifts) || shifts.length === 0) {
    return 'Chưa có';
  }

  const shiftMap = {
    morning: 'Sáng',
    afternoon: 'Chiều',
    evening: 'Tối',
  };

  return shifts.map(shift => shiftMap[shift] || shift).join(', ');
};

const handleUpdate = () => {
  console.log('Update schedule for doctor:', props.doctor._id);
  console.log('Current recurring:', recurring.value);
  showForm.value = true;
};

const handleCreate = () => {
  console.log('Create schedule for doctor:', props.doctor._id);
  console.log('Doctor info:', props.doctor);
  showForm.value = true;
};

const handleFormSuccess = async () => {
  try {
    const data = await recurringStore.fetchRecurringByDoctorId(props.doctor._id);
    recurring.value = data;
    console.log('Refreshed recurring schedule:', recurring.value);
  } catch (error) {
    console.error('Error refreshing recurring schedule:', error);
  }
};
</script>
