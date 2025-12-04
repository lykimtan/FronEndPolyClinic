<template>
  <aside class="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-4">
    <!-- Header -->
    <h2 class="text-lg font-semibold text-gray-900 mb-6">
      <i class="fa-solid fa-sliders mr-2 text-blue-600"></i>
      Bộ lọc và sắp xếp
    </h2>

    <!-- Filter Section -->
    <div class="mb-8">
      <h3 class="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Bộ lọc</h3>
      <div class="space-y-3">
        <label class="flex items-center gap-3 cursor-pointer group">
          <input
            v-model="localFilterType"
            type="radio"
            value="all"
            class="w-4 h-4 text-blue-600 cursor-pointer"
          />
          <span class="text-gray-700 group-hover:text-blue-600 transition">Tất cả câu hỏi</span>
        </label>

        <label class="flex items-center gap-3 cursor-pointer group">
          <input
            v-model="localFilterType"
            type="radio"
            value="pending"
            class="w-4 h-4 text-blue-600 cursor-pointer"
          />
          <span class="text-gray-700 group-hover:text-blue-600 transition">Chưa trả lời</span>
        </label>

        <label class="flex items-center gap-3 cursor-pointer group">
          <input
            v-model="localFilterType"
            type="radio"
            value="answered"
            class="w-4 h-4 text-blue-600 cursor-pointer"
          />
          <span class="text-gray-700 group-hover:text-blue-600 transition">Đã trả lời</span>
        </label>
      </div>
    </div>

    <!-- Sort Section -->
    <div class="mb-8 pb-8 border-b">
      <h3 class="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Sắp xếp</h3>
      <select
        v-model="localSortBy"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        <option value="newest">Mới nhất trước</option>
        <option value="oldest">Cũ nhất trước</option>
      </select>
    </div>

    <!-- Statistics -->
    <div class="space-y-3">
      <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Thống kê</h3>
      <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
        <i class="fa-solid fa-comments text-blue-600 text-lg"></i>
        <div>
          <p class="text-xs text-gray-600">Tất cả câu hỏi</p>
          <p class="text-lg font-bold text-blue-600">{{ totalCount }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
        <i class="fa-solid fa-clock text-yellow-600 text-lg"></i>
        <div>
          <p class="text-xs text-gray-600">Chưa trả lời</p>
          <p class="text-lg font-bold text-yellow-600">{{ pendingCount }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
        <i class="fa-solid fa-check-circle text-green-600 text-lg"></i>
        <div>
          <p class="text-xs text-gray-600">Đã trả lời</p>
          <p class="text-lg font-bold text-green-600">{{ answeredCount }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  filterType: {
    type: String,
    default: 'all',
  },
  sortBy: {
    type: String,
    default: 'newest',
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  pendingCount: {
    type: Number,
    default: 0,
  },
  answeredCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['update:filter-type', 'update:sort-by']);

const localFilterType = ref(props.filterType);
const localSortBy = ref(props.sortBy);

watch(localFilterType, newValue => {
  emit('update:filter-type', newValue);
});

watch(localSortBy, newValue => {
  emit('update:sort-by', newValue);
});
</script>
