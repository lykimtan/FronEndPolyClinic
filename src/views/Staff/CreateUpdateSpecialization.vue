<template>
  <div class="bg-white rounded shadow p-6">
    <h2 class="text-2xl font-semibold mb-4">
      {{ isEdit ? 'Cập nhật chuyên khoa' : 'Tạo chuyên khoa' }}
    </h2>

    <form
      class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-lg mx-auto space-y-6"
      @submit.prevent="onSubmit"
    >
      <!-- Tên chuyên khoa -->
      <div>
        <label class="block text-sm font-semibold text-gray-700">Tên chuyên khoa</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Ví dụ: Tim mạch"
          class="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
        <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
      </div>

      <!-- Mô tả -->
      <div>
        <label class="block text-sm font-semibold text-gray-700">Mô tả</label>
        <textarea
          v-model="form.description"
          rows="4"
          placeholder="Mô tả ngắn"
          class="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        ></textarea>
      </div>

      <!-- Triệu chứng -->
      <div>
        <label class="block text-sm font-semibold text-gray-700">Triệu chứng thường gặp</label>
        <input
          v-model="form.symptom"
          type="text"
          placeholder="Ví dụ: Đau ngực, khó thở"
          class="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
        <p v-if="errors.symptom" class="text-red-500 text-sm mt-1">{{ errors.symptom }}</p>
      </div>

      <!-- Ảnh chuyên khoa -->
      <div>
        <label class="block text-sm font-semibold text-gray-700">Ảnh chuyên khoa</label>
        <input
          class="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          type="file"
          accept="image/*"
          @change="onFileChange"
        />
        <p class="text-sm text-gray-500 mt-1">Kích thước tối ưu: vuông, PNG/JPG</p>

        <div v-if="previewUrl || form.image" class="mt-4">
          <p class="text-sm font-medium text-gray-700">Xem trước</p>
          <img
            :src="previewUrl || getImageUrl(form.image)"
            alt="preview"
            class="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm mt-2"
          />
        </div>
      </div>

      <!-- Nút hành động -->
      <div class="flex items-center gap-3 pt-2">
        <button
          class="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          :disabled="loading"
        >
          <span v-if="loading">Đang lưu...</span>
          <span v-else>{{ isEdit ? 'Cập nhật' : 'Tạo mới' }}</span>
        </button>

        <button
          class="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          type="button"
          @click="onCancel"
        >
          Hủy
        </button>

        <p v-if="successMessage" class="text-green-600 text-sm ml-3 font-medium">
          {{ successMessage }}
        </p>
        <p v-if="errorMessage" class="text-red-600 text-sm ml-3 font-medium">
          {{ errorMessage }}
        </p>
      </div>
    </form>
  </div>
  <Toaster position="top-right" />
</template>

<script setup>
//store
import { useUserStore } from '@/stores/userStore';
import { toast, Toaster } from 'vue-sonner';

import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import specializationService from '@/api/specializationService';

const userStore = useUserStore();

onMounted(async () => {
  await userStore.fetchUserProfile();
});

// --- Specialization form logic ---
const route = useRoute();
const router = useRouter();

const specId = route.params.id || null;
const isEdit = Boolean(specId);

const form = ref({
  name: '',
  description: '',
  symptom: '',
  image: '', // path returned from server
});

const imageFile = ref(null);
const previewUrl = ref('');
const loading = ref(false);
const errors = ref({});
const successMessage = ref('');
const errorMessage = ref('');

const validate = () => {
  errors.value = {};
  if (!form.value.name || !form.value.name.trim()) {
    errors.value.name = 'Tên chuyên khoa là bắt buộc.';
  }
  return Object.keys(errors.value).length === 0;
};

const getImageUrl = path => {
  if (!path) return '/src/assets/images/default-spec.png';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${path}`;
};

const loadSpecialization = async id => {
  try {
    const res = await specializationService.getSpecilizationById(id);
    // assume response contains { data: { ... } } or direct object
    const spec = res?.data || res;
    form.value.name = spec.name || '';
    form.value.description = spec.description || '';
    form.value.symptom = spec.symptom || '';
    form.value.image = spec.image || spec.specImage || '';
  } catch (err) {
    console.error('Failed to load specialization', err);
    errorMessage.value = err.message || 'Không thể tải chuyên khoa.';
  }
};

if (isEdit) {
  loadSpecialization(specId);
}

const onFileChange = e => {
  const file = e.target.files?.[0];
  if (!file) return;
  imageFile.value = file;
  // preview
  const reader = new FileReader();
  reader.onload = ev => {
    previewUrl.value = ev.target.result;
  };
  reader.readAsDataURL(file);
};

const onSubmit = async () => {
  successMessage.value = '';
  errorMessage.value = '';

  if (!validate()) return;

  loading.value = true;
  try {
    let imagePath = form.value.image;
    if (imageFile.value) {
      const uploadRes = await specializationService.uploadImage(imageFile.value);
      const normalizeImagePath = res => {
        if (!res) return '';
        if (typeof res === 'string') return res;
        if (typeof res === 'object') {
          return (
            res.imageUrl ||
            res.url ||
            res.path ||
            (res.data && (res.data.imageUrl || res.data.path || res.data)) ||
            ''
          );
        }
        return '';
      };

      imagePath = normalizeImagePath(uploadRes) || imagePath;
    }

    const payload = {
      name: form.value.name,
      symptom: form.value.symptom,
      description: form.value.description,
      image: imagePath,
    };

    if (isEdit) {
      await specializationService.updateSpecialization(specId, payload);
      successMessage.value = 'Cập nhật chuyên khoa thành công.';
    } else {
      await specializationService.createSpecialization(payload);
      successMessage.value = 'Tạo chuyên khoa thành công.';
      // reset form for new create
      form.value.name = '';
      form.value.symptom = '';
      form.value.description = '';
      form.value.image = '';
      previewUrl.value = '';
      imageFile.value = null;
    }
    toast.success(successMessage.value);

    // optional: navigate back to admin list after a short delay
    setTimeout(() => {
      router.push({ name: 'StaffDashboard' }).catch(() => {});
    }, 800);
  } catch (err) {
    console.error(err);
    errorMessage.value = err?.message || 'Lỗi khi lưu chuyên khoa';
  } finally {
    loading.value = false;
  }
};

const onCancel = () => {
  router.back();
};
</script>
