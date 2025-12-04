<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
      <div class="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
        <h2 class="text-xl font-bold">Chỉnh sửa câu hỏi</h2>
        <button class="text-gray-500 hover:text-gray-700" @click="$emit('close')">
          <i class="fa-solid fa-times text-xl"></i>
        </button>
      </div>

      <form class="p-6 space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Câu hỏi</label>
          <textarea
            v-model="editingQuestion"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>

        <div>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="editingConfidential"
              type="checkbox"
              class="w-4 h-4 text-blue-600 rounded"
            />
            <span class="text-sm text-gray-700">Giữ bí mật</span>
          </label>
        </div>

        <div class="flex gap-3 justify-end">
          <button
            type="button"
            class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            @click="$emit('close')"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            <span v-if="!isLoading">Cập nhật</span>
            <span v-else>
              <i class="fa-solid fa-spinner animate-spin"></i>
              Đang cập nhật...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  fna: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'submit']);

const editingQuestion = ref('');
const editingConfidential = ref(true);
const isLoading = ref(false);

watch(
  () => props.fna,
  newVal => {
    if (newVal) {
      editingQuestion.value = newVal.question;
      editingConfidential.value = newVal.isConfidential;
    }
  }
);

const handleSubmit = async () => {
  if (!editingQuestion.value.trim()) {
    return;
  }

  isLoading.value = true;
  try {
    await emit('submit', {
      question: editingQuestion.value,
      isConfidential: editingConfidential.value,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
