<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="$emit('update:modelValue', false)"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          <!-- Modal Header -->
          <div class="bg-blue-500 text-white p-6 flex items-center justify-between">
            <h3 class="text-xl font-bold flex items-center gap-2">
              <i class="fa-solid fa-pill"></i>
              Chi Tiết Thuốc
            </h3>
            <button
              class="hover:bg-blue-600 p-2 rounded transition-colors"
              @click="$emit('update:modelValue', false)"
            >
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <!-- Modal Content -->
          <div v-if="drug" class="p-6 space-y-4">
            <!-- Drug Image -->
            <div v-if="drug.imageUrl" class="flex justify-center mb-4">
              <img
                :src="getImageUrl(drug.imageUrl)"
                :alt="drug.name"
                class="h-48 object-cover rounded-lg shadow-md border-2 border-blue-200"
              />
            </div>

            <div>
              <p class="text-sm text-gray-600 font-semibold mb-1">Tên Thuốc</p>
              <p class="text-lg font-bold text-gray-800">{{ drug.name }}</p>
            </div>

            <div class="border-t pt-4">
              <p class="text-sm text-gray-600 font-semibold mb-1">Chất Hoạt Chất</p>
              <p class="text-gray-700">{{ drug.genericName || 'N/A' }}</p>
            </div>

            <div class="border-t pt-4">
              <p class="text-sm text-gray-600 font-semibold mb-1">Dạng Thuốc</p>
              <p class="text-gray-700">{{ drug.form || 'N/A' }}</p>
            </div>

            <div class="border-t pt-4">
              <p class="text-sm text-gray-600 font-semibold mb-1">Đơn Vị</p>
              <p class="text-gray-700">{{ drug.unit || 'N/A' }}</p>
            </div>

            <div class="border-t pt-4">
              <p class="text-sm text-gray-600 font-semibold mb-1">Mô Tả</p>
              <p class="text-gray-700">{{ drug.description || 'Không có mô tả' }}</p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 px-6 py-4 border-t text-right">
            <button
              class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors"
              @click="$emit('update:modelValue', false)"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  drug: {
    type: Object,
    default: null,
  },
});

defineEmits(['update:modelValue']);

const getImageUrl = image => {
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${image}`;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
