<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h2 class="text-4xl text-center text-blue-500 font-extrabold p-5 mb-6">
      Quản lý lịch làm việc bác sĩ
    </h2>

    <!-- Search Bar -->
    <div class="max-w-7xl mx-auto mb-6">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm theo tên bác sĩ hoặc mã số nhân viên..."
          class="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          @input="handleSearch"
        />
        <i
          class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        ></i>
        <!-- Clear button -->
        <button
          v-if="searchQuery"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          @click="clearSearch"
        >
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>

      <!-- Search Results Info -->
      <div v-if="searchQuery" class="mt-2 text-sm text-gray-600">
        Tìm thấy <span class="font-bold text-blue-600">{{ filteredDoctors.length }}</span> kết quả
      </div>
    </div>

    <!-- Doctor Schedule Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      <!-- Loading state -->
      <div v-if="!doctors || doctors.length === 0" class="col-span-full text-center py-10">
        <p class="text-gray-500 text-lg">Đang tải danh sách bác sĩ...</p>
      </div>

      <!-- No results -->
      <div
        v-else-if="searchQuery && filteredDoctors.length === 0"
        class="col-span-full text-center py-10"
      >
        <i class="fa-solid fa-user-doctor text-gray-300 text-6xl mb-4"></i>
        <h3 class="text-xl font-bold text-gray-600 mb-2">Không tìm thấy bác sĩ</h3>
        <p class="text-gray-500">Không có bác sĩ nào phù hợp với từ khóa "{{ searchQuery }}"</p>
      </div>

      <!-- Doctor Cards -->
      <InforScheduleItem
        v-for="doctor in filteredDoctors"
        :key="doctor._id || doctor.id"
        :doctor="doctor"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useDoctorStore } from '@/stores/DoctorStore';
import InforScheduleItem from '@/components/Staff/InforScheduleItem.vue';

const doctorStore = useDoctorStore();
const searchQuery = ref('');

// Computed để lấy danh sách bác sĩ từ store
const doctors = computed(() => doctorStore.getAll);

// Computed để filter doctors based on search query
const filteredDoctors = computed(() => {
  if (!searchQuery.value.trim()) {
    return doctors.value;
  }

  const query = searchQuery.value.toLowerCase().trim();

  return doctors.value.filter(doctor => {
    // Search by fullName
    const fullName = doctor.fullName?.toLowerCase() || '';
    const firstName = doctor.firstName?.toLowerCase() || '';
    const lastName = doctor.lastName?.toLowerCase() || '';
    const combinedName = `${firstName} ${lastName}`.toLowerCase();

    // Search by employeeId
    const employeeId = doctor.employeeId?.toLowerCase() || '';

    return fullName.includes(query) || combinedName.includes(query) || employeeId.includes(query);
  });
});

const handleSearch = () => {};

const clearSearch = () => {
  searchQuery.value = '';
};

onMounted(async () => {
  await doctorStore.fetchDoctors();
});
</script>

<style scoped>
/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
