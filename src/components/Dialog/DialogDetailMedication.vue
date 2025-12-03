<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="closeDialog"
      >
        <div class="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div
            class="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <i class="fa-solid fa-capsules text-2xl"></i>
              <h2 class="text-2xl font-bold">Chi Tiết Thuốc</h2>
            </div>
            <button class="hover:bg-blue-700 p-2 rounded-lg transition-colors" @click="closeDialog">
              <i class="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <!-- Content -->
          <div v-if="medication" class="p-6 space-y-6">
            <!-- Image Section -->
            <div class="text-center">
              <img
                v-if="medication.imageUrl"
                :src="`${apiBaseUrl}${medication.imageUrl}`"
                :alt="medication.name"
                class="h-64 mx-auto rounded-lg object-cover shadow-md"
              />
              <div
                v-else
                class="h-64 mx-auto rounded-lg bg-gray-100 flex items-center justify-center"
              >
                <i class="fa-solid fa-image text-6xl text-gray-300"></i>
              </div>
            </div>

            <!-- Main Info -->
            <div class="space-y-4">
              <!-- Name -->
              <div class="border-b pb-4">
                <h3 class="text-3xl font-bold text-gray-800 mb-2">{{ medication.name }}</h3>
                <p class="text-gray-600">
                  <span class="font-semibold">Chất hoạt chất:</span> {{ medication.genericName }}
                </p>
              </div>

              <!-- Details Grid -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Form Type -->
                <div class="bg-green-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600 font-semibold mb-2">
                    <i class="fa-solid fa-capsules mr-2 text-green-500"></i>Dạng Thuốc
                  </p>
                  <p class="text-lg font-bold text-gray-800">
                    {{ getFormLabel(medication.form) }}
                  </p>
                </div>

                <!-- Unit -->
                <div class="bg-blue-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600 font-semibold mb-2">
                    <i class="fa-solid fa-cube mr-2 text-blue-500"></i>Đơn Vị
                  </p>
                  <p class="text-lg font-bold text-gray-800">{{ medication.unit }}</p>
                </div>
              </div>

              <!-- Description -->
              <div v-if="medication.description" class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-600 font-semibold mb-2">
                  <i class="fa-solid fa-file-lines mr-2 text-indigo-500"></i>Mô Tả
                </p>
                <p class="text-gray-700 leading-relaxed">{{ medication.description }}</p>
              </div>

              <!-- Info Tags -->
              <div class="flex flex-wrap gap-3 pt-4">
                <div class="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                  <i class="fa-solid fa-id-card text-gray-600"></i>
                  <span class="text-sm text-gray-700">ID: {{ medication._id }}</span>
                </div>
                <div class="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                  <i class="fa-solid fa-calendar text-gray-600"></i>
                  <span class="text-sm text-gray-700">
                    Tạo: {{ formatDate(medication.createdAt) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-else class="flex justify-center items-center py-12">
            <div class="text-center">
              <i class="fa-solid fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
              <p class="text-gray-600">Đang tải thông tin...</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="sticky bottom-0 bg-gray-50 border-t p-4 flex gap-3">
            <button
              class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              @click="handleEdit"
            >
              <i class="fa-solid fa-edit"></i>
              Sửa
            </button>
            <button
              class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              @click="handleDelete"
            >
              <i class="fa-solid fa-trash"></i>
              Xóa
            </button>
            <button
              class="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors"
              @click="closeDialog"
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
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useMedicationStore } from '@/stores/MedicationStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  medication: {
    type: Object,
    default: null,
  },
  apiBaseUrl: {
    type: String,
    default: 'http://localhost:8000',
  },
});

const emit = defineEmits(['close', 'edit', 'delete']);
const router = useRouter();
const medicationStore = useMedicationStore();

const closeDialog = () => {
  emit('close');
};

const handleEdit = () => {
  emit('close');
  if (props.medication) {
    router.push({
      name: 'MedicationForm',
      params: { id: props.medication._id },
    });
  }
};

const handleDelete = () => {
  if (!props.medication) return;

  Swal.fire({
    title: 'Xác nhận xóa?',
    text: `Bạn có chắc muốn xóa "${props.medication.name}" không?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
  }).then(result => {
    if (result.isConfirmed) {
      performDelete();
    }
  });
};

const performDelete = async () => {
  try {
    await medicationStore.deleteMedication(props.medication._id);
    Swal.fire({
      title: 'Thành công!',
      text: 'Xóa thuốc thành công',
      icon: 'success',
    }).then(() => {
      closeDialog();
    });
  } catch (err) {
    Swal.fire({
      title: 'Lỗi!',
      text: err.message || 'Có lỗi xảy ra khi xóa thuốc',
      icon: 'error',
    });
  }
};

const getFormLabel = form => {
  const labels = {
    tablet: 'Viên',
    capsule: 'Viên nang',
    syrup: 'Siro',
    injection: 'Tiêm',
    cream: 'Mỡ/Kem',
    powder: 'Bột',
  };
  return labels[form] || form;
};

const formatDate = dateString => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
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
