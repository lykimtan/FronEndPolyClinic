<template>
  <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
    <!-- Edit Mode -->
    <div v-if="isEditingLocal" class="space-y-4">
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

      <div class="flex gap-3">
        <button
          type="button"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
          :disabled="isUpdating"
          @click="handleUpdate"
        >
          <span v-if="!isUpdating">
            <i class="fa-solid fa-check"></i>
            Cập nhật
          </span>
          <span v-else>
            <i class="fa-solid fa-spinner animate-spin"></i>
            Đang cập nhật...
          </span>
        </button>
        <button
          type="button"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          @click="cancelEdit"
        >
          Hủy
        </button>
      </div>
    </div>

    <!-- View Mode -->
    <div v-else>
      <!-- Question Header -->
      <div class="flex justify-between items-start mb-4">
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
              Chờ trả lời
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

        <!-- Action Buttons (for user's own questions) -->
        <div v-if="isUserQuestion" class="ml-4 flex gap-2">
          <button
            v-if="fna.status !== 'answered'"
            title="Chỉnh sửa"
            class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            @click="startEdit"
          >
            <i class="fa-solid fa-pencil text-lg"></i>
          </button>
          <button
            v-if="fna.status !== 'answered'"
            title="Xóa"
            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            @click="$emit('delete', fna._id)"
          >
            <i class="fa-solid fa-trash text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Question Meta -->
      <div class="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <span>
          <i class="fa-solid fa-user text-gray-400 mr-2"></i>
          {{ fna.askerId?.firstName }} {{ fna.askerId?.lastName }}
        </span>
        <span>
          <i class="fa-solid fa-calendar text-gray-400 mr-2"></i>
          {{ formatDate(fna.createdAt) }}
        </span>
      </div>

      <!-- Answer Section -->
      <div v-if="fna.status === 'answered'" class="mt-6 pt-6 border-t">
        <div class="bg-blue-50 rounded-lg p-4">
          <div class="flex items-center gap-2 mb-4">
            <i class="fa-solid fa-stethoscope text-blue-600"></i>
            <span class="font-semibold text-blue-900">
              Trả lời từ {{ fna.doctorId?.firstName }} {{ fna.doctorId?.lastName }}
            </span>
          </div>

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
      </div>

      <!-- No Answer Yet -->
      <div v-else class="mt-4 text-center py-4 bg-gray-50 rounded-lg">
        <i class="fa-solid fa-hourglass-half text-gray-400 text-2xl mb-2"></i>
        <p class="text-gray-600 text-sm">Bác sĩ sẽ trả lời câu hỏi này sớm nhất</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useFnAStore } from '@/stores/FnAStore';
import { toast } from 'vue-sonner';
import Swal from 'sweetalert2';

const props = defineProps({
  fna: {
    type: Object,
    required: true,
  },
});

defineEmits(['delete', 'update']);

const userStore = useUserStore();
const fnAStore = useFnAStore();
const currentUser = computed(() => userStore.getUserInfo);

const isEditingLocal = ref(false);
const editingQuestion = ref('');
const editingConfidential = ref(true);
const isUpdating = ref(false);

const isUserQuestion = computed(() => props.fna.askerId?._id === currentUser.value?.id);

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

const startEdit = () => {
  editingQuestion.value = props.fna.question;
  editingConfidential.value = props.fna.isConfidential;
  isEditingLocal.value = true;
};

const cancelEdit = () => {
  isEditingLocal.value = false;
  editingQuestion.value = '';
  editingConfidential.value = true;
};

const handleUpdate = async () => {
  if (!editingQuestion.value.trim()) {
    toast.error('Vui lòng nhập câu hỏi');
    return;
  }

  isUpdating.value = true;
  try {
    await fnAStore.updateQuestion(props.fna._id, editingQuestion.value, editingConfidential.value);

    // Show SweetAlert success message
    await Swal.fire({
      title: 'Thành công!',
      text: 'Câu hỏi đã được cập nhật',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

    isEditingLocal.value = false;
  } catch (error) {
    console.error('Error updating question:', error);
    toast.error('Không thể cập nhật câu hỏi. Vui lòng thử lại');
  } finally {
    isUpdating.value = false;
  }
};
</script>
