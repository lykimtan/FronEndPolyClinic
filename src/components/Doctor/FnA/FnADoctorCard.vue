<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Question Header -->
    <div class="mb-4">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <span
              v-if="fna.status === 'answered'"
              class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
            >
              <i class="fa-solid fa-check-circle"></i>
              Đã trả lời
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
            >
              <i class="fa-solid fa-clock"></i>
              Chưa trả lời
            </span>
            <span
              v-if="fna.isConfidential"
              class="inline-flex items-center gap-1 px-2 py-1 text-gray-600 text-xs"
            >
              <i class="fa-solid fa-lock"></i>
              Riêng tư
            </span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">{{ fna.question }}</h3>
        </div>
      </div>

      <!-- Question Meta -->
      <div class="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
        <span>
          <i class="fa-solid fa-user text-gray-400 mr-2"></i>
          {{ fna.askerId?.firstName }} {{ fna.askerId?.lastName }}
        </span>
        <span>
          <i class="fa-solid fa-envelope text-gray-400 mr-2"></i>
          {{ fna.askerId?.email }}
        </span>
        <span>
          <i class="fa-solid fa-calendar text-gray-400 mr-2"></i>
          {{ formatDate(fna.createdAt) }}
        </span>
      </div>
    </div>

    <hr class="my-4" />

    <!-- Answer Section -->
    <div v-if="fna.status === 'answered'" class="space-y-4">
      <div class="bg-blue-50 rounded-lg p-4">
        <h4 class="font-semibold text-blue-900 mb-4">
          <i class="fa-solid fa-stethoscope mr-2"></i>
          Câu trả lời
        </h4>

        <!-- Answer Content Layout: Image Left, Text Right -->
        <div class="flex gap-4 mb-4">
          <!-- Image Left -->
          <div v-if="fna.img" class="flex-shrink-0">
            <img
              :src="getFullImageUrl(fna.img)"
              :alt="fna.question"
              class="rounded-lg w-48 h-48 object-cover"
            />
          </div>

          <!-- Text Right -->
          <div class="flex-1">
            <p class="text-gray-800 leading-relaxed">{{ fna.answer }}</p>
          </div>
        </div>

        <!-- If no image, just show text -->
        <div v-if="!fna.img" class="mb-4">
          <p class="text-gray-800 leading-relaxed">{{ fna.answer }}</p>
        </div>

        <p class="text-xs text-gray-500">
          <i class="fa-solid fa-calendar text-gray-400 mr-1"></i>
          Ngày trả lời: {{ formatDate(fna.updatedAt) }}
        </p>
      </div>

      <!-- Edit/Delete Buttons for Answered Questions -->
      <div class="flex gap-2">
        <button
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
          @click="toggleEditMode"
        >
          <i class="fa-solid fa-pencil"></i>
          Chỉnh sửa
        </button>
        <button
          class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
          @click="handleDeleteAnswer"
        >
          <i class="fa-solid fa-trash"></i>
          Xóa
        </button>
      </div>
    </div>

    <!-- Answer Form (for pending or editing) -->
    <div v-if="!fna.status || fna.status === 'pending' || isEditing" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Câu trả lời</label>
        <textarea
          v-model="answerText"
          rows="4"
          placeholder="Nhập câu trả lời của bạn..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        ></textarea>
      </div>

      <!-- Image Upload -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Tải ảnh (tùy chọn)</label>
        <div class="flex items-center gap-3">
          <label
            class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition"
          >
            <i class="fa-solid fa-image"></i>
            <span>Chọn ảnh</span>
            <input type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
          </label>
          <span v-if="selectedFile" class="text-sm text-gray-600">
            {{ selectedFile.name }}
          </span>
        </div>

        <!-- Image Preview -->
        <img
          v-if="previewUrl"
          :src="previewUrl"
          :alt="'Preview'"
          class="mt-3 rounded-lg max-h-48 object-cover"
        />
      </div>

      <!-- Buttons -->
      <div class="flex gap-3">
        <button
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
          :disabled="isSubmitting || !answerText.trim()"
          @click="handleSubmitAnswer"
        >
          <span v-if="!isSubmitting">
            <i class="fa-solid fa-paper-plane"></i>
            {{ isEditing ? 'Cập nhật' : 'Trả lời' }}
          </span>
          <span v-else>
            <i class="fa-solid fa-spinner animate-spin"></i>
            Đang gửi...
          </span>
        </button>
        <button
          v-if="isEditing"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          @click="cancelEdit"
        >
          Hủy
        </button>
      </div>
    </div>

    <!-- No Answer Yet -->
    <div
      v-if="!fna.status || (fna.status === 'pending' && !isEditing)"
      class="text-center py-4 bg-gray-50 rounded-lg"
    >
      <i class="fa-solid fa-hourglass-half text-gray-400 text-2xl mb-2"></i>
      <p class="text-gray-600 text-sm">Hãy là người trả lời câu hỏi này</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useFnAStore } from '@/stores/FnAStore';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'vue-sonner';
import Swal from 'sweetalert2';

const props = defineProps({
  fna: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['updated', 'deleted']);

const fnAStore = useFnAStore();
const userStore = useUserStore();
const currentUser = computed(() => userStore.getUserInfo);

const answerText = ref('');
const selectedFile = ref(null);
const previewUrl = ref('');
const isEditing = ref(false);
const isSubmitting = ref(false);

const formatDate = dateStr => {
  if (!dateStr) return 'Chưa cập nhật';
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getFullImageUrl = image => {
  if (image.startsWith('http')) return image;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${image}`;
};

const handleFileSelect = event => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = e => {
      previewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const toggleEditMode = () => {
  isEditing.value = true;
  answerText.value = props.fna.answer;
  selectedFile.value = null;
  previewUrl.value = '';
};

const cancelEdit = () => {
  isEditing.value = false;
  answerText.value = '';
  selectedFile.value = null;
  previewUrl.value = '';
};

const handleSubmitAnswer = async () => {
  if (!answerText.value.trim()) {
    toast.error('Vui lòng nhập câu trả lời');
    return;
  }

  isSubmitting.value = true;
  try {
    await fnAStore.updateFnA(
      props.fna._id,
      currentUser.value?.id,
      answerText.value,
      selectedFile.value,
      false // isPublished
    );

    await Swal.fire({
      title: 'Thành công!',
      text: isEditing.value ? 'Câu trả lời đã được cập nhật' : 'Câu trả lời đã được gửi',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    // Reset form
    answerText.value = '';
    selectedFile.value = null;
    previewUrl.value = '';
    isEditing.value = false;

    emit('updated');
  } catch (error) {
    console.error('Error submitting answer:', error);
    toast.error('Không thể gửi câu trả lời. Vui lòng thử lại');
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteAnswer = async () => {
  const result = await Swal.fire({
    title: 'Xóa câu trả lời?',
    text: 'Bạn có chắc muốn xóa câu trả lời này không?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
  });

  if (!result.isConfirmed) return;

  try {
    // Call API to delete answer
    // For now, we'll just reset the FnA to pending status
    await fnAStore.deleteAnswer(props.fna._id);

    await Swal.fire({
      title: 'Thành công!',
      text: 'Câu trả lời đã được xóa',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    emit('deleted');
  } catch (error) {
    console.error('Error deleting answer:', error);
    toast.error('Không thể xóa câu trả lời. Vui lòng thử lại');
  }
};
</script>
