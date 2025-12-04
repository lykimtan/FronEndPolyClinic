<template>
  <aside class="lg:col-span-1">
    <div class="bg-white rounded-lg shadow-sm p-6 sticky top-6">
      <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
        <i class="fa-solid fa-filter text-blue-600"></i>
        Lọc & Sắp xếp
      </h2>

      <!-- Filter Section -->
      <div class="mb-6">
        <h3 class="font-semibold text-gray-700 mb-3">Danh mục</h3>
        <label class="flex items-center gap-3 mb-3 cursor-pointer group">
          <input
            :checked="filterType === 'all'"
            type="radio"
            value="all"
            class="w-4 h-4 text-blue-600"
            @change="$emit('update:filter-type', 'all')"
          />
          <span class="text-gray-700 group-hover:text-blue-600">Tất cả câu hỏi</span>
        </label>
        <label class="flex items-center gap-3 mb-3 cursor-pointer group">
          <input
            :checked="filterType === 'mine'"
            type="radio"
            value="mine"
            class="w-4 h-4 text-blue-600"
            @change="$emit('update:filter-type', 'mine')"
          />
          <span class="text-gray-700 group-hover:text-blue-600">Câu hỏi của tôi</span>
        </label>
        <label class="flex items-center gap-3 cursor-pointer group">
          <input
            :checked="filterType === 'answered'"
            type="radio"
            value="answered"
            class="w-4 h-4 text-blue-600"
            @change="$emit('update:filter-type', 'answered')"
          />
          <span class="text-gray-700 group-hover:text-blue-600">Đã được trả lời</span>
        </label>
      </div>

      <!-- Sort Section -->
      <div class="pt-4 border-t">
        <h3 class="font-semibold text-gray-700 mb-3">Sắp xếp theo</h3>
        <select
          :value="sortBy"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="$emit('update:sort-by', $event.target.value)"
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>

      <!-- Stats -->
      <div class="mt-6 pt-6 border-t space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Tổng câu hỏi:</span>
          <span class="font-bold text-lg text-blue-600">{{ totalCount }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Của bạn:</span>
          <span class="font-bold text-lg text-blue-600">{{ userCount }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  filterType: {
    type: String,
    required: true,
  },
  sortBy: {
    type: String,
    required: true,
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  userCount: {
    type: Number,
    default: 0,
  },
});

defineEmits(['update:filter-type', 'update:sort-by']);
</script>
