<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-2xl mx-auto py-8 px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          {{ isEdit ? 'Cập Nhật Thuốc' : 'Thêm Thuốc Mới' }}
        </h1>
        <p class="text-gray-600">
          {{ isEdit ? 'Sửa đổi thông tin thuốc' : 'Nhập thông tin thuốc mới vào hệ thống' }}
        </p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <form @submit.prevent="handleSubmit">
          <!-- Row 1: Name and Generic Name -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Name -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fa-solid fa-pills mr-2 text-blue-500"></i>
                Tên Thuốc <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                placeholder="Nhập tên thuốc..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p v-if="errors.name" class="text-red-500 text-sm mt-1">
                <i class="fa-solid fa-exclamation-circle mr-1"></i>{{ errors.name }}
              </p>
            </div>

            <!-- Generic Name -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fa-solid fa-flask mr-2 text-green-500"></i>
                Tên Chất <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.genericName"
                type="text"
                placeholder="Nhập tên chất hoạt chất..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p v-if="errors.genericName" class="text-red-500 text-sm mt-1">
                <i class="fa-solid fa-exclamation-circle mr-1"></i>{{ errors.genericName }}
              </p>
            </div>
          </div>

          <!-- Row 2: Form Type and Unit -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Form Type -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fa-solid fa-capsules mr-2 text-purple-500"></i>
                Dạng Thuốc <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.form"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Chọn dạng thuốc --</option>
                <option value="tablet">Viên</option>
                <option value="capsule">Viên nang</option>
                <option value="syrup">Siro</option>
                <option value="injection">Tiêm</option>
                <option value="powder">Bột</option>
                <option value="lozenge">Viên sủi</option>
              </select>
              <p v-if="errors.form" class="text-red-500 text-sm mt-1">
                <i class="fa-solid fa-exclamation-circle mr-1"></i>{{ errors.form }}
              </p>
            </div>

            <!-- Unit -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fa-solid fa-cube mr-2 text-orange-500"></i>
                Đơn Vị <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.unit"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Chọn đơn vị --</option>
                <option value="mg">mg</option>
                <option value="ml">ml</option>
                <option value="g">g</option>
                <option value="box">hộp</option>
                <option value="vial">lọ</option>
              </select>
              <p v-if="errors.unit" class="text-red-500 text-sm mt-1">
                <i class="fa-solid fa-exclamation-circle mr-1"></i>{{ errors.unit }}
              </p>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fa-solid fa-file-lines mr-2 text-indigo-500"></i>Mô Tả
            </label>
            <textarea
              v-model="formData.description"
              placeholder="Nhập mô tả về thuốc..."
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <!-- Image Upload -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fa-solid fa-image mr-2 text-pink-500"></i>Hình Ảnh Thuốc
            </label>
            <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
              @click="triggerImageInput"
            >
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageChange"
              />

              <div v-if="imagePreview">
                <img
                  :src="imagePreview"
                  alt="Preview"
                  class="h-48 mx-auto mb-4 rounded-lg object-cover"
                />
                <p class="text-sm text-gray-600 mb-2">{{ formData.medicationImage?.name }}</p>
                <button
                  type="button"
                  class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                  @click.stop="removeImage"
                >
                  <i class="fa-solid fa-trash mr-2"></i>Xóa Hình
                </button>
              </div>
              <div v-else>
                <i class="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600 font-semibold mb-2">Kéo và thả hình ảnh vào đây</p>
                <p class="text-gray-500 text-sm">hoặc nhấn để chọn từ máy tính</p>
                <p class="text-gray-400 text-xs mt-2">PNG, JPG, GIF, WebP (tối đa 5MB)</p>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <i class="fa-solid fa-floppy-disk"></i>
              {{ isSubmitting ? 'Đang xử lý...' : isEdit ? 'Cập Nhật' : 'Tạo Thuốc' }}
            </button>
            <button
              type="button"
              class="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              @click="goBack"
            >
              <i class="fa-solid fa-xmark"></i>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMedicationStore } from '@/stores/MedicationStore';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const medicationStore = useMedicationStore();

const imageInput = ref(null);
const isSubmitting = ref(false);
const imagePreview = ref(null);

const formData = reactive({
  name: '',
  genericName: '',
  form: '',
  unit: '',
  description: '',
  medicationImage: null,
});

const errors = reactive({
  name: '',
  genericName: '',
  form: '',
  unit: '',
});

const isEdit = computed(() => !!route.params.id);
const medicationId = computed(() => route.params.id);

// Load medication data if editing
onMounted(async () => {
  if (isEdit.value) {
    try {
      await medicationStore.fetchMedicationById(medicationId.value);
      const medication = medicationStore.getCurrentMedication;

      if (medication) {
        formData.name = medication.name;
        formData.genericName = medication.genericName;
        formData.form = medication.form;
        formData.unit = medication.unit;
        formData.description = medication.description || '';

        // Load image preview for edit
        if (medication.imageUrl) {
          imagePreview.value = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${medication.imageUrl}`;
        }
      }
    } catch (err) {
      console.error('Error loading medication:', err);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể tải thông tin thuốc',
        icon: 'error',
      });
    }
  }
});

const triggerImageInput = () => {
  imageInput.value.click();
};

const handleImageChange = e => {
  const file = e.target.files[0];
  if (file) {
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Chỉ chấp nhận các định dạng: PNG, JPG, GIF, WebP',
        icon: 'error',
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Kích thước file không được vượt quá 5MB',
        icon: 'error',
      });
      return;
    }

    formData.medicationImage = file;
    const reader = new FileReader();
    reader.onload = e => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  formData.medicationImage = null;
  imagePreview.value = null;
  imageInput.value.value = '';
};

const validateForm = () => {
  errors.name = !formData.name ? 'Tên thuốc không được để trống' : '';
  errors.genericName = !formData.genericName ? 'Tên chất không được để trống' : '';
  errors.form = !formData.form ? 'Vui lòng chọn dạng thuốc' : '';
  errors.unit = !formData.unit ? 'Vui lòng chọn đơn vị' : '';

  return !errors.name && !errors.genericName && !errors.form && !errors.unit;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    Swal.fire({
      title: 'Lỗi!',
      text: 'Vui lòng điền đầy đủ thông tin bắt buộc',
      icon: 'error',
    });
    return;
  }

  isSubmitting.value = true;

  try {
    const medicationFormData = new FormData();
    medicationFormData.append('name', formData.name);
    medicationFormData.append('genericName', formData.genericName);
    medicationFormData.append('form', formData.form);
    medicationFormData.append('unit', formData.unit);
    medicationFormData.append('description', formData.description);

    if (formData.medicationImage) {
      medicationFormData.append('medicationImage', formData.medicationImage);
    }

    if (isEdit.value) {
      await medicationStore.updateMedication(medicationId.value, medicationFormData);
      Swal.fire({
        title: 'Thành công!',
        text: 'Cập nhật thuốc thành công',
        icon: 'success',
      }).then(() => {
        router.push({ name: 'MedicationManagement' });
      });
    } else {
      await medicationStore.createMedication(medicationFormData);
      Swal.fire({
        title: 'Thành công!',
        text: 'Tạo thuốc mới thành công',
        icon: 'success',
      }).then(() => {
        router.push({ name: 'MedicationManagement' });
      });
    }
  } catch (err) {
    Swal.fire({
      title: 'Lỗi!',
      text: err.message || 'Có lỗi xảy ra',
      icon: 'error',
    });
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.push({ name: 'MedicationManagement' });
};
</script>
