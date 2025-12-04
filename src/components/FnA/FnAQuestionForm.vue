<template>
  <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
    <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
      <i class="fa-solid fa-message text-blue-600"></i>
      Đặt câu hỏi mới
    </h2>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Câu hỏi của bạn</label>
        <textarea
          v-model="question"
          placeholder="Hãy đặt câu hỏi chi tiết để có thể nhận được câu trả lời tốt nhất..."
          rows="4"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        ></textarea>
      </div>

      <div>
        <label class="flex items-center gap-3 cursor-pointer">
          <input v-model="isConfidential" type="checkbox" class="w-4 h-4 text-blue-600 rounded" />
          <span class="text-sm text-gray-700">
            <i class="fa-solid fa-lock text-gray-500 mr-1"></i>
            Giữ bí mật (chỉ bác sĩ và bạn thấy được)
          </span>
        </label>
      </div>

      <div class="flex gap-3">
        <button
          type="submit"
          :disabled="!question.trim() || isLoading"
          class="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium flex items-center justify-center gap-2"
        >
          <span v-if="!isLoading">
            <i class="fa-solid fa-paper-plane"></i>
            Gửi câu hỏi
          </span>
          <span v-else>
            <i class="fa-solid fa-spinner animate-spin"></i>
            Đang gửi...
          </span>
        </button>
        <button
          type="button"
          class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          @click="resetForm"
        >
          Xóa
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useFnAStore } from '@/stores/FnAStore';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'vue-sonner';

const fnAStore = useFnAStore();
const userStore = useUserStore();

const question = ref('');
const isConfidential = ref(true);
const isLoading = ref(false);

const currentUser = userStore.getUserInfo;

const handleSubmit = async () => {
  if (!question.value.trim()) {
    toast.error('Vui lòng nhập câu hỏi');
    return;
  }

  isLoading.value = true;
  try {
    await fnAStore.createQuestion(currentUser.id, question.value, isConfidential.value);
    toast.success('Câu hỏi của bạn đã được gửi!');
    resetForm();
  } catch (error) {
    console.error('Error creating question:', error);
    toast.error('Không thể gửi câu hỏi. Vui lòng thử lại');
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  question.value = '';
  isConfidential.value = true;
};
</script>
