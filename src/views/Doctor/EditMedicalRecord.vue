<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <button
          class="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-semibold"
          @click="goBack"
        >
          <i class="fa-solid fa-chevron-left"></i>Quay Lại
        </button>
        <h1 class="text-4xl font-bold text-gray-800">Chỉnh Sửa Hồ Sơ Y Tế</h1>
        <p class="text-gray-600 mt-2">Cập nhật thông tin chẩn đoán và ghi chú bệnh nhân</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <i class="fa-solid fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p class="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <p class="text-red-800 font-semibold flex items-center gap-2">
          <i class="fa-solid fa-exclamation-circle"></i>
          {{ error }}
        </p>
      </div>

      <!-- Form -->
      <div v-else class="space-y-6">
        <!-- Patient Info Card -->
        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            <i class="fa-solid fa-user-md mr-2 text-blue-600"></i>Thông Tin Bệnh Nhân
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-600 font-semibold">Tên Bệnh Nhân</label>
              <p class="text-gray-800 font-semibold mt-1">
                {{ medicalRecord?.patientId?.firstName }} {{ medicalRecord?.patientId?.lastName }}
              </p>
            </div>
            <div>
              <label class="text-sm text-gray-600 font-semibold">Email</label>
              <p class="text-gray-800 mt-1">{{ medicalRecord?.patientId?.email }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600 font-semibold">Số Điện Thoại</label>
              <p class="text-gray-800 mt-1">{{ medicalRecord?.patientId?.phone || '-' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600 font-semibold">Ngày Tạo Hồ Sơ</label>
              <p class="text-gray-800 mt-1">{{ formatDate(medicalRecord?.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Medical Information Form -->
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Symptoms -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <label class="block text-lg font-semibold text-gray-800 mb-3">
              <i class="fa-solid fa-triangle-exclamation mr-2 text-yellow-600"></i>Triệu Chứng
            </label>
            <textarea
              v-model="formData.symptoms"
              placeholder="Mô tả triệu chứng bệnh nhân..."
              rows="4"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
            ></textarea>
            <p class="text-sm text-gray-500 mt-2">{{ formData.symptoms.length }}/500 ký tự</p>
          </div>

          <!-- Diagnosis -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <label class="block text-lg font-semibold text-gray-800 mb-3">
              <i class="fa-solid fa-clipboard-list mr-2 text-green-600"></i>Chẩn Đoán
            </label>
            <textarea
              v-model="formData.diagnosis"
              placeholder="Kết quả chẩn đoán..."
              rows="4"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
            ></textarea>
            <p class="text-sm text-gray-500 mt-2">{{ formData.diagnosis.length }}/500 ký tự</p>
          </div>

          <!-- Notes -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <label class="block text-lg font-semibold text-gray-800 mb-3">
              <i class="fa-solid fa-note-sticky mr-2 text-purple-600"></i>Ghi Chú
            </label>
            <textarea
              v-model="formData.notes"
              placeholder="Các ghi chú bổ sung..."
              rows="4"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
            ></textarea>
            <p class="text-sm text-gray-500 mt-2">{{ formData.notes.length }}/500 ký tự</p>
          </div>

          <!-- Test Results -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <label class="block text-lg font-semibold text-gray-800 mb-4">
              <i class="fa-solid fa-flask mr-2 text-blue-600"></i>Kết Quả Xét Nghiệm
            </label>
            <div class="space-y-4">
              <div
                v-for="(test, index) in formData.testResults"
                :key="index"
                class="border-2 border-gray-200 rounded-lg p-4"
              >
                <div class="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <label class="text-sm font-semibold text-gray-700">Tên Xét Nghiệm</label>
                    <input
                      v-model="test.testName"
                      type="text"
                      placeholder="VD: Xét nghiệm máu"
                      class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mt-1"
                    />
                  </div>
                  <div>
                    <label class="text-sm font-semibold text-gray-700">Kết Quả</label>
                    <input
                      v-model="test.result"
                      type="text"
                      placeholder="Kết quả"
                      class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mt-1"
                    />
                  </div>
                  <div>
                    <label class="text-sm font-semibold text-gray-700">Giá Trị Bình Thường</label>
                    <input
                      v-model="test.normalRange"
                      type="text"
                      placeholder="VD: 4.5 - 5.5"
                      class="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mt-1"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  class="text-red-600 hover:text-red-800 font-semibold text-sm"
                  @click="removeTestResult(index)"
                >
                  <i class="fa-solid fa-trash mr-1"></i>Xóa
                </button>
              </div>
              <button
                type="button"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
                @click="addTestResult"
              >
                <i class="fa-solid fa-plus mr-2"></i>Thêm Xét Nghiệm
              </button>
            </div>
          </div>

          <!-- Follow Up -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="mb-4">
              <label class="flex items-center gap-3 cursor-pointer">
                <input v-model="formData.followUpRequire" type="checkbox" class="w-5 h-5" />
                <span class="text-lg font-semibold text-gray-800">
                  <i class="fa-solid fa-calendar-check mr-2 text-orange-600"></i>Yêu Cầu Tái Khám
                </span>
              </label>
            </div>
            <div v-if="formData.followUpRequire" class="ml-8">
              <label class="text-sm font-semibold text-gray-700">Ngày Tái Khám</label>
              <input
                v-model="formData.followUpDate"
                type="date"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mt-2"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="isSaving"
              class="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              <i v-if="!isSaving" class="fa-solid fa-save mr-2"></i>
              <span v-if="isSaving" class="animate-spin mr-2">
                <i class="fa-solid fa-spinner"></i>
              </span>
              {{ isSaving ? 'Đang Lưu...' : 'Lưu Thay Đổi' }}
            </button>
            <button
              type="button"
              class="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
              @click="goBack"
            >
              <i class="fa-solid fa-times mr-2"></i>Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMedicalRecordStore } from '@/stores/MedicalRecordStore';
import { useUserStore } from '@/stores/userStore';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const medicalRecordStore = useMedicalRecordStore();
const userStore = useUserStore();

const medicalRecordId = route.params.id;
const medicalRecord = ref(null);
const isLoading = ref(true);
const isSaving = ref(false);
const error = ref(null);

const formData = ref({
  symptoms: '',
  diagnosis: '',
  notes: '',
  testResults: [],
  followUpRequire: false,
  followUpDate: '',
});

const formatDate = date => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const goBack = () => {
  router.back();
};

const addTestResult = () => {
  formData.value.testResults.push({
    testName: '',
    result: '',
    normalRange: '',
  });
};

const removeTestResult = index => {
  formData.value.testResults.splice(index, 1);
};

const handleSubmit = async () => {
  try {
    // Validation
    if (!formData.value.symptoms.trim() && !formData.value.diagnosis.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Thông Báo',
        text: 'Vui lòng điền ít nhất triệu chứng hoặc chẩn đoán',
      });
      return;
    }

    if (formData.value.followUpRequire && !formData.value.followUpDate) {
      await Swal.fire({
        icon: 'warning',
        title: 'Thông Báo',
        text: 'Vui lòng chọn ngày tái khám',
      });
      return;
    }

    isSaving.value = true;

    const updateData = {
      symptoms: formData.value.symptoms,
      diagnosis: formData.value.diagnosis,
      notes: formData.value.notes,
      testResults: formData.value.testResults,
      followUpRequire: formData.value.followUpRequire,
      followUpDate: formData.value.followUpRequire ? formData.value.followUpDate : null,
    };

    const doctorId = userStore.user?._id;
    await medicalRecordStore.updateMedicalRecord(medicalRecordId, updateData, doctorId);

    await Swal.fire({
      icon: 'success',
      title: 'Thành Công!',
      text: 'Cập nhật hồ sơ y tế thành công',
      confirmButtonText: 'OK',
    });

    goBack();
  } catch (err) {
    await Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: err?.message || 'Lỗi cập nhật hồ sơ y tế',
    });
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    // Fetch medical record
    const record = await medicalRecordStore.getMedicalRecordById(medicalRecordId);
    medicalRecord.value = record;

    // Populate form
    formData.value.symptoms = record.symptoms || '';
    formData.value.diagnosis = record.diagnosis || '';
    formData.value.notes = record.notes || '';
    formData.value.testResults = record.testResults || [];
    formData.value.followUpRequire = record.followUpRequire || false;
    formData.value.followUpDate = record.followUpDate
      ? new Date(record.followUpDate).toISOString().split('T')[0]
      : '';
  } catch (err) {
    error.value = err?.message || 'Lỗi tải hồ sơ y tế';
    console.error('Error loading medical record:', err);
  } finally {
    isLoading.value = false;
  }
});
</script>
