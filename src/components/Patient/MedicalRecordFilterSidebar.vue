<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-4 h-fit">
    <!-- Header -->
    <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
      <i class="fa-solid fa-filter text-blue-500"></i>
      Bộ Lọc
    </h3>

    <!-- Divider -->
    <div class="border-t border-gray-200 mb-6"></div>

    <!-- Sort By -->
    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-3">
        <i class="fa-solid fa-arrow-down-up text-purple-500 mr-2"></i>Sắp xếp theo
      </label>
      <select
        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        :value="filters.sortBy"
        @change="emit('update-filter', { sortBy: $event.target.value })"
      >
        <option value="newest">Mới nhất</option>
        <option value="oldest">Cũ nhất</option>
        <option value="doctor">Theo bác sĩ</option>
      </select>
    </div>

    <!-- Status Filter -->
    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-3">
        <i class="fa-solid fa-circle-check text-green-500 mr-2"></i>Tình trạng
      </label>
      <div class="space-y-2">
        <label
          class="flex items-center gap-3 cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors"
        >
          <input
            class="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
            type="checkbox"
            :checked="filters.showFollowUp"
            @change="emit('update-filter', { showFollowUp: !filters.showFollowUp })"
          />
          <span class="text-sm text-gray-700">Cần tái khám</span>
        </label>
      </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-gray-200 my-6"></div>

    <!-- Doctor Filter -->
    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-3">
        <i class="fa-solid fa-user-doctor text-blue-500 mr-2"></i>Bác sĩ
      </label>
      <div class="space-y-2 max-h-48 overflow-y-auto">
        <label
          class="flex items-center gap-3 cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors"
        >
          <input
            class="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-500"
            type="radio"
            name="doctor"
            value=""
            :checked="filters.doctorId === ''"
            @change="emit('update-filter', { doctorId: '' })"
          />
          <span class="text-sm text-gray-700">Tất cả bác sĩ</span>
        </label>
        <label
          v-for="doctor in uniqueDoctors"
          :key="doctor._id"
          class="flex items-center gap-3 cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors"
        >
          <input
            class="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-500"
            type="radio"
            name="doctor"
            :value="doctor._id"
            :checked="filters.doctorId === doctor._id"
            @change="emit('update-filter', { doctorId: doctor._id })"
          />
          <span class="text-sm text-gray-700">{{ doctor.fullName }}</span>
        </label>
      </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-gray-200 my-6"></div>

    <!-- Reset Button -->
    <button
      class="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      @click="emit('reset-filter')"
    >
      <i class="fa-solid fa-rotate-left"></i>
      Đặt lại bộ lọc
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      sortBy: 'newest',
      showWithPrescription: false,
      showFollowUp: false,
      doctorId: '',
    }),
  },
  medicalRecords: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update-filter', 'reset-filter']);

const uniqueDoctors = computed(() => {
  const doctorsMap = new Map();
  props.medicalRecords.forEach(record => {
    if (record.doctorId && !doctorsMap.has(record.doctorId._id)) {
      doctorsMap.set(record.doctorId._id, record.doctorId);
    }
  });
  return Array.from(doctorsMap.values());
});
</script>
