<template>
  <div class="w-64 bg-white shadow-lg rounded-lg p-4 h-fit sticky top-6">
    <!-- Header -->
    <div class="mb-4 pb-3 border-b-2 border-blue-500">
      <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
        <i class="fa-solid fa-hospital text-blue-500"></i>
        Danh Sách Khoa
      </h3>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="py-6 text-center">
      <i class="fa-solid fa-spinner fa-spin text-2xl text-blue-500 mb-2"></i>
      <p class="text-sm text-gray-600">Đang tải...</p>
    </div>

    <!-- All button -->
    <button
      v-else
      :class="[
        'w-full text-left px-4 py-3 rounded-lg mb-2 transition-all duration-200 font-medium flex items-center gap-2',
        selectedSpecializationId === null
          ? 'bg-blue-500 text-white shadow-md'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      ]"
      @click="selectSpecialization(null)"
    >
      <i class="fa-solid fa-list"></i>
      <span>Tất Cả Bác Sĩ</span>
      <span class="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
        {{ allDoctorsCount }}
      </span>
    </button>

    <!-- Specializations list -->
    <div class="space-y-1 max-h-96 overflow-y-auto">
      <button
        v-for="spec in specializations"
        :key="spec._id"
        :class="[
          'w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 relative group',
          selectedSpecializationId === spec._id
            ? 'bg-blue-500 text-white shadow-md'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        ]"
        @click="selectSpecialization(spec._id)"
      >
        <i class="fa-solid fa-stethoscope text-sm"></i>
        <span class="flex-1 truncate">{{ spec.name }}</span>
        <span
          :class="[
            'text-xs px-2 py-0.5 rounded-full',
            selectedSpecializationId === spec._id
              ? 'bg-white/20 text-white'
              : 'bg-blue-100 text-blue-700',
          ]"
        >
          {{ getDoctorCountBySpecialization(spec._id) }}
        </span>
      </button>
    </div>

    <!-- Stats -->
    <div v-if="!isLoading" class="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
      <div class="flex justify-between text-gray-600">
        <span>Tổng Khoa:</span>
        <span class="font-bold text-gray-800">{{ specializations.length }}</span>
      </div>
      <div class="flex justify-between text-gray-600">
        <span>Tổng Bác Sĩ:</span>
        <span class="font-bold text-blue-600">{{ allDoctorsCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSpecializationStore } from '@/stores/specializationStore';

const props = defineProps({
  doctors: {
    type: Array,
    default: () => [],
  },
  selectedSpecializationId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['specialization-selected']);

const specializationStore = useSpecializationStore();
const isLoading = ref(false);

const specializations = computed(() => specializationStore.getAll);

const allDoctorsCount = computed(() => props.doctors.length);

const getDoctorCountBySpecialization = specId => {
  return props.doctors.filter(doctor => {
    return (
      doctor.specializationIds &&
      doctor.specializationIds.some(spec => {
        const specIdValue = typeof spec === 'object' ? spec._id : spec;
        return specIdValue === specId;
      })
    );
  }).length;
};

const selectSpecialization = specId => {
  emit('specialization-selected', specId);
};

onMounted(async () => {
  if (specializations.value.length === 0) {
    isLoading.value = true;
    try {
      await specializationStore.fetchSpecializations();
    } catch (err) {
      console.error('Error loading specializations:', err);
    } finally {
      isLoading.value = false;
    }
  }
});
</script>

<style scoped>
/* Custom scrollbar for specializations list */
.max-h-96::-webkit-scrollbar {
  width: 6px;
}

.max-h-96::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
