<template>
  <div class="bg-white rounded-2xl shadow-lg p-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Tạo Hồ Sơ Y Tế</h2>

    <form class="space-y-6" @submit.prevent="submitMedicalRecord">
      <!-- Symptoms -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <i class="fa-solid fa-heart-pulse text-red-500 mr-2"></i>Triệu chứng
        </label>
        <textarea
          v-model="formData.symptoms"
          placeholder="Nhập các triệu chứng..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          rows="3"
        ></textarea>
      </div>
      <!-- Diagnosis -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <i class="fa-solid fa-stethoscope text-blue-500 mr-2"></i>Chẩn đoán
        </label>
        <textarea
          v-model="formData.diagnosis"
          placeholder="Nhập chẩn đoán của bạn..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          rows="3"
        ></textarea>
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <i class="fa-solid fa-note-sticky text-yellow-500 mr-2"></i>Ghi chú thêm
        </label>
        <textarea
          v-model="formData.notes"
          placeholder="Ghi chú thêm nếu cần..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          rows="2"
        ></textarea>
      </div>

      <!-- Test Results -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <i class="fa-solid fa-flask-vial text-purple-500 mr-2"></i>Kết quả xét nghiệm
        </label>
        <button
          type="button"
          class="mb-4 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          @click="addTestResult"
        >
          <i class="fa-solid fa-plus"></i>Thêm xét nghiệm
        </button>

        <div v-if="formData.testResults.length > 0" class="space-y-3">
          <div
            v-for="(test, index) in formData.testResults"
            :key="index"
            class="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <input
                v-model="test.testName"
                type="text"
                placeholder="Tên xét nghiệm"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                v-model="test.result"
                type="text"
                placeholder="Kết quả"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                v-model="test.normalRange"
                type="text"
                placeholder="Khoảng bình thường"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              class="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              @click="removeTestResult(index)"
            >
              <i class="fa-solid fa-trash-can"></i>Xóa
            </button>
          </div>
        </div>
      </div>

      <!-- Follow-up -->
      <div class="border-t border-gray-100 pt-6">
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            v-model="formData.followUpRequire"
            type="checkbox"
            class="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span class="text-sm font-medium text-gray-700">
            <i class="fa-solid fa-calendar-check text-blue-500 mr-2"></i>Cần tái khám
          </span>
        </label>

        <div v-if="formData.followUpRequire" class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Ngày tái khám</label>
          <input
            v-model="formData.followUpDate"
            type="date"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex gap-3 pt-6 border-t border-gray-100">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <i class="fa-solid fa-save"></i>
          <span>{{ isSubmitting ? 'Đang lưu...' : 'Lưu Hồ Sơ Y Tế' }}</span>
        </button>

        <button
          type="button"
          class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          @click="resetForm"
        >
          <i class="fa-solid fa-rotate-left"></i>
          <span>Làm lại</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMedicalRecordStore } from '@/stores/MedicalRecordStore';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const props = defineProps({
  appointment: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const medicalRecordStore = useMedicalRecordStore();
const appointmentStore = useAppointmentStore();
const isSubmitting = ref(false);

const formData = ref({
  diagnosis: '',
  symptoms: '',
  notes: '',
  testResults: [],
  followUpRequire: false,
  followUpDate: '',
});

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

const resetForm = () => {
  formData.value = {
    diagnosis: '',
    symptoms: '',
    notes: '',
    testResults: [],
    followUpRequire: false,
    followUpDate: '',
  };
};

const submitMedicalRecord = async () => {
  // Validation
  if (!formData.value.diagnosis.trim()) {
    Swal.fire({
      title: 'Lỗi!',
      text: 'Vui lòng nhập chẩn đoán',
      icon: 'error',
    });
    return;
  }

  if (formData.value.followUpRequire && !formData.value.followUpDate) {
    Swal.fire({
      title: 'Lỗi!',
      text: 'Vui lòng chọn ngày tái khám',
      icon: 'error',
    });
    return;
  }

  isSubmitting.value = true;

  try {
    const recordData = {
      appointmentId: props.appointment._id,
      doctorId: props.appointment.doctorId._id,
      patientId: props.appointment.patientId._id,
      diagnosis: formData.value.diagnosis,
      symptoms: formData.value.symptoms,
      notes: formData.value.notes,
      testResults: formData.value.testResults,
      followUpRequire: formData.value.followUpRequire,
      followUpDate: formData.value.followUpDate || undefined,
    };

    // 1. Tạo medical record
    const createdRecord = await medicalRecordStore.createMedicalRecord(recordData);
    console.log('Created Record:', createdRecord);

    // 2. Update appointment với medicalRecordId
    await appointmentStore.updateMedicalRecordForAppointment(props.appointment._id, {
      medicalRecordId: createdRecord._id,
    });

    // 3. Update status thành completed
    await appointmentStore.updateAppointmentStatus(props.appointment._id, 'completed');

    Swal.fire({
      title: 'Thành công!',
      text: 'Hồ sơ y tế đã được tạo thành công',
      icon: 'success',
      confirmButtonText: 'Đóng',
    }).then(() => {
      router.back();
    });
  } catch (error) {
    console.error('Error creating medical record:', error);
    Swal.fire({
      title: 'Lỗi!',
      text: error.message || 'Có lỗi xảy ra khi tạo hồ sơ y tế',
      icon: 'error',
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>
