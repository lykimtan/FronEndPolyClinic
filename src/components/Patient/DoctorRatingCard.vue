<template>
  <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <i class="fa-solid fa-spinner fa-spin text-blue-500 text-2xl"></i>
      <p class="ml-3 text-gray-600">Đang tải đánh giá...</p>
    </div>

    <!-- Header -->
    <div v-else class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">Đánh giá chất lượng khám bệnh</h3>
      <div v-if="existingRating" class="flex gap-2">
        <button
          v-if="!isEditing"
          class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors duration-200 flex items-center gap-2"
          @click="startEditing"
        >
          <i class="fa-solid fa-pen-to-square"></i>
          Chỉnh sửa
        </button>
        <button
          v-if="!isEditing"
          class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors duration-200 flex items-center gap-2"
          @click="deleteRating"
        >
          <i class="fa-solid fa-trash"></i>
          Xóa
        </button>
        <button
          v-if="isEditing"
          class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded transition-colors duration-200"
          @click="cancelEdit"
        >
          Hủy
        </button>
      </div>
    </div>

    <!-- Existing Rating Display -->
    <div v-if="existingRating && !isEditing" class="space-y-4">
      <!-- Stars Display -->
      <div class="flex items-center gap-2">
        <div class="flex gap-1">
          <i
            v-for="i in 5"
            :key="i"
            :class="[
              'fa-solid fa-star text-lg',
              i <= existingRating.score ? 'text-yellow-400' : 'text-gray-300',
            ]"
          ></i>
        </div>
        <span class="text-lg font-semibold text-gray-700">{{ existingRating.score }}/5</span>
      </div>

      <!-- Comment Display -->
      <div v-if="existingRating.comment" class="bg-gray-50 p-4 rounded-lg">
        <p class="text-gray-700 leading-relaxed">{{ existingRating.comment }}</p>
      </div>

      <!-- Rating Date -->
      <div class="text-sm text-gray-500">
        Đánh giá lúc: {{ formatDate(existingRating.createdAt) }}
      </div>
    </div>

    <!-- Rating Form (Create or Edit) -->
    <div v-if="isEditing || !existingRating" class="space-y-6">
      <!-- Star Rating -->
      <div class="space-y-3">
        <label class="block text-sm font-medium text-gray-700">Đánh giá sao</label>
        <div class="flex gap-2 items-center">
          <div class="flex gap-2">
            <button
              v-for="i in 5"
              :key="i"
              class="transition-transform duration-200 hover:scale-110 focus:outline-none"
              @click="formData.score = i"
              @mouseover="hoveredRating = i"
              @mouseleave="hoveredRating = null"
            >
              <i
                :class="[
                  'fa-solid fa-star text-4xl',
                  i <= (hoveredRating || formData.score) ? 'text-yellow-400' : 'text-gray-300',
                ]"
              ></i>
            </button>
          </div>
          <span class="text-lg font-semibold text-gray-700 min-w-16">
            {{ formData.score || 0 }}/5
          </span>
        </div>
      </div>

      <!-- Comment Input -->
      <div class="space-y-3">
        <label class="block text-sm font-medium text-gray-700">Bình luận (tùy chọn)</label>
        <textarea
          v-model="formData.comment"
          placeholder="Chia sẻ trải nghiệm khám bệnh của bạn..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows="4"
        ></textarea>
        <p class="text-xs text-gray-500">{{ formData.comment.length }}/500 ký tự</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p class="flex items-center gap-2">
          <i class="fa-solid fa-circle-exclamation"></i>
          {{ error }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 justify-end">
        <button
          v-if="isEditing"
          class="px-6 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium transition-colors duration-200"
          @click="cancelEdit"
        >
          Hủy
        </button>
        <button
          class="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          :disabled="!formData.score || isSubmitting"
          @click="submitRating"
        >
          <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin"></i>
          <i v-else class="fa-solid fa-paper-plane"></i>
          {{ isEditing ? 'Cập nhật đánh giá' : 'Gửi đánh giá' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRatingStore } from '@/stores/RatingStore';
import Swal from 'sweetalert2';

const props = defineProps({
  appointment: {
    type: Object,
    required: true,
  },
});

const ratingStore = useRatingStore();

const existingRating = ref(null);
const isEditing = ref(false);
const isSubmitting = ref(false);
const error = ref(null);
const hoveredRating = ref(null);
const isLoading = ref(true);

const formData = ref({
  score: 0,
  comment: '',
});

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function fetchExistingRating() {
  try {
    isLoading.value = true;
    if (props.appointment?.doctorId?._id) {
      await ratingStore.fetchRatingsByDoctor(props.appointment.doctorId._id);
      const rating = ratingStore.allRatings.find(
        r =>
          r.appointmentId === props.appointment._id ||
          r.appointmentId?._id === props.appointment._id
      );

      if (rating) {
        existingRating.value = rating;
      }
    }
  } catch (err) {
    console.error('Error fetching rating:', err);
  } finally {
    isLoading.value = false;
  }
}

function startEditing() {
  if (existingRating.value) {
    formData.value.score = existingRating.value.score;
    formData.value.comment = existingRating.value.comment || '';
  }
  isEditing.value = true;
  error.value = null;
}

function cancelEdit() {
  isEditing.value = false;
  formData.value.score = 0;
  formData.value.comment = '';
  error.value = null;
}

async function submitRating() {
  if (!formData.value.score) {
    error.value = 'Vui lòng chọn số sao để đánh giá';
    return;
  }

  if (formData.value.comment.length > 500) {
    error.value = 'Bình luận không được vượt quá 500 ký tự';
    return;
  }

  try {
    isSubmitting.value = true;
    error.value = null;

    if (isEditing.value && existingRating.value) {
      const updated = await ratingStore.updateRating(
        existingRating.value._id,
        formData.value.score,
        formData.value.comment
      );
      existingRating.value = updated;

      Swal.fire({
        title: 'Thành công!',
        text: 'Đánh giá đã được cập nhật.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      // Create new rating
      const rating = await ratingStore.createRating(
        props.appointment.patientId,
        props.appointment.doctorId._id,
        props.appointment._id,
        formData.value.score,
        formData.value.comment
      );
      existingRating.value = rating;

      Swal.fire({
        title: 'Thành công!',
        text: 'Đánh giá của bạn đã được gửi.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    }

    isEditing.value = false;
    formData.value.score = 0;
    formData.value.comment = '';
  } catch (err) {
    error.value = err.message || 'Có lỗi xảy ra khi gửi đánh giá';
    console.error('Error submitting rating:', err);
  } finally {
    isSubmitting.value = false;
  }
}

async function deleteRating() {
  if (!existingRating.value) return;

  const result = await Swal.fire({
    title: 'Xóa đánh giá?',
    text: 'Hành động này không thể hoàn tác. Đánh giá sẽ bị xóa vĩnh viễn.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Vâng, xóa!',
    cancelButtonText: 'Hủy bỏ',
  });

  if (!result.isConfirmed) return;

  try {
    await ratingStore.deleteRating(existingRating.value._id);

    Swal.fire({
      title: 'Đã xóa!',
      text: 'Đánh giá đã được xóa thành công.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });

    existingRating.value = null;
    isEditing.value = false;
    formData.value.score = 0;
    formData.value.comment = '';
  } catch (err) {
    Swal.fire({
      title: 'Lỗi!',
      text: err.message || 'Có lỗi xảy ra khi xóa đánh giá.',
      icon: 'error',
      confirmButtonText: 'Đóng',
    });
  }
}

onMounted(() => {
  fetchExistingRating();
});
</script>
