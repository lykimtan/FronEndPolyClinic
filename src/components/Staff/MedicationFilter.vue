<template>
  <aside class="w-64 bg-white shadow-lg p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-8">Quản Lý Thuốc</h2>

    <!-- Add New Medication Button -->
    <button
      class="w-full mb-6 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
      @click="goToAddMedication"
    >
      <i class="fa-solid fa-plus"></i>
      Thêm Thuốc Mới
    </button>

    <hr class="mb-6" />

    <!-- Filters Section -->
    <div class="space-y-6">
      <!-- Search by Name -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          <i class="fa-solid fa-search mr-2 text-blue-500"></i>Tìm theo tên
        </label>
        <input
          :value="filters.searchName"
          type="text"
          placeholder="Nhập tên thuốc..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="updateFilter('searchName', $event.target.value)"
        />
      </div>

      <!-- Filter by Form -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          <i class="fa-solid fa-capsules mr-2 text-green-500"></i>Dạng thuốc
        </label>
        <select
          :value="filters.form"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="updateFilter('form', $event.target.value)"
        >
          <option value="">Tất cả</option>
          <option value="tablet">Viên</option>
          <option value="capsule">Viên nang</option>
          <option value="syrup">Siro</option>
          <option value="injection">Tiêm</option>
          <option value="cream">Mỡ/Kem</option>
          <option value="powder">Bột</option>
        </select>
      </div>

      <!-- Filter by Unit -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          <i class="fa-solid fa-cube mr-2 text-purple-500"></i>Đơn vị
        </label>
        <select
          :value="filters.unit"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="updateFilter('unit', $event.target.value)"
        >
          <option value="">Tất cả</option>
          <option value="mg">mg</option>
          <option value="ml">ml</option>
          <option value="g">g</option>
          <option value="box">hộp</option>
          <option value="vial">lọ</option>
        </select>
      </div>

      <!-- Clear Filters -->
      <button
        class="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        @click="clearAllFilters"
      >
        <i class="fa-solid fa-rotate-left"></i>
        Xóa bộ lọc
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  filters: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update-filter', 'clear-filters']);

const updateFilter = (key, value) => {
  emit('update-filter', { key, value });
};

const clearAllFilters = () => {
  emit('clear-filters');
};

const goToAddMedication = () => {
  router.push({ name: 'MedicationForm' });
};
</script>
