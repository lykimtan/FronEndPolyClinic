<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
    <!-- Image -->
    <div class="h-48 bg-gray-200 overflow-hidden relative">
      <img
        v-if="medication.imageUrl"
        :src="getImageUrl(medication.imageUrl)"
        :alt="medication.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
        <i class="fa-solid fa-image text-4xl text-gray-300"></i>
      </div>

      <!-- Action Buttons Overlay -->
      <div
        class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3"
      >
        <button
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
          @click="handleEdit"
        >
          <i class="fa-solid fa-edit"></i>
          Sửa
        </button>
        <button
          class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
          @click="handleDelete"
        >
          <i class="fa-solid fa-trash"></i>
          Xóa
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
        {{ medication.name }}
      </h3>

      <p v-if="medication.genericName" class="text-sm text-gray-600 mb-3">
        <span class="font-semibold">Chất:</span> {{ medication.genericName }}
      </p>

      <p v-if="medication.description" class="text-sm text-gray-600 mb-3 line-clamp-2">
        <span class="font-semibold">Mô tả:</span> {{ medication.description }}
      </p>

      <!-- Info Tags -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span class="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
          <i class="fa-solid fa-capsules mr-1"></i>{{ medication.form }}
        </span>
        <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
          <i class="fa-solid fa-cube mr-1"></i>{{ medication.unit }}
        </span>
      </div>

      <!-- Details Button -->
      <button
        class="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
        @click="handleViewDetails"
      >
        Xem Chi Tiết
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  medication: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['edit', 'delete', 'view-details']);

const handleEdit = () => {
  emit('edit', props.medication);
};

const handleDelete = () => {
  emit('delete', props.medication);
};

const handleViewDetails = () => {
  emit('view-details', props.medication);
};

const getImageUrl = image => {
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${image}`;
};
</script>
