<template>
  <div class="mb-6">
    <div class="relative">
      <i
        class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
      ></i>
      <input
        type="text"
        :value="searchQuery"
        @input="$emit('search', $event.target.value)"
        placeholder="Tìm kiếm theo email, tên hoặc mã số nhân viên..."
        class="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
      />
      <button
        v-if="searchQuery"
        @click="$emit('search', '')"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <i class="fa-solid fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
});

defineEmits(['search']);
</script>
