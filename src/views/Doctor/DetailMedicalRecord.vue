<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header với nút quay lại và edit -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-4xl font-bold text-gray-800 mb-2">Chi Tiết Hồ Sơ Y Tế</h1>
          <p v-if="medicalRecord" class="text-gray-600">
            Bệnh nhân: <span class="font-semibold">{{ medicalRecord.patientId?.fullName }}</span>
          </p>
        </div>
        <div class="flex gap-3">
          <button
            class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
            @click="goBack"
          >
            <i class="fa-solid fa-arrow-left"></i>
            Quay lại
          </button>
          <button
            class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            @click="goToEdit"
          >
            <i class="fa-solid fa-edit"></i>
            Chỉnh sửa
          </button>
        </div>
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

      <!-- Medical Record Content -->
      <div v-else-if="medicalRecord" class="space-y-6">
        <!-- Main Medical Record Card -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6 text-white">
            <h2 class="text-2xl font-bold flex items-center gap-3">
              <i class="fa-solid fa-file-medical"></i>
              Thông Tin Y Tế
            </h2>
          </div>

          <div class="p-8 space-y-6">
            <!-- Diagnosis -->
            <div class="border-b pb-6">
              <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-stethoscope text-blue-500"></i>
                Chẩn đoán
              </h3>
              <p class="text-gray-700 bg-blue-50 p-4 rounded-lg">
                {{ medicalRecord.diagnosis || 'Không có thông tin' }}
              </p>
            </div>

            <!-- Symptoms -->
            <div class="border-b pb-6">
              <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-heart-pulse text-red-500"></i>
                Triệu chứng
              </h3>
              <p class="text-gray-700 bg-red-50 p-4 rounded-lg">
                {{ medicalRecord.symptoms || 'Không có thông tin' }}
              </p>
            </div>

            <!-- Notes -->
            <div class="border-b pb-6">
              <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-note-sticky text-yellow-500"></i>
                Ghi chú thêm
              </h3>
              <p class="text-gray-700 bg-yellow-50 p-4 rounded-lg">
                {{ medicalRecord.notes || 'Không có ghi chú' }}
              </p>
            </div>

            <!-- Test Results -->
            <div class="border-b pb-6">
              <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-flask-vial text-purple-500"></i>
                Kết Quả Xét Nghiệm
              </h3>
              <div
                v-if="medicalRecord.testResults && medicalRecord.testResults.length > 0"
                class="space-y-3"
              >
                <div
                  v-for="(test, index) in medicalRecord.testResults"
                  :key="index"
                  class="border border-purple-200 rounded-lg p-4 bg-purple-50"
                >
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p class="text-sm text-gray-600 font-semibold">Tên xét nghiệm</p>
                      <p class="text-gray-800">{{ test.testName }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 font-semibold">Kết quả</p>
                      <p class="text-gray-800">{{ test.result }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 font-semibold">Khoảng bình thường</p>
                      <p class="text-gray-800">{{ test.normalRange }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-gray-500 italic">Không có kết quả xét nghiệm</div>
            </div>

            <!-- Follow-up -->
            <div>
              <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i class="fa-solid fa-calendar-check text-green-500"></i>
                Tái Khám
              </h3>
              <div class="bg-green-50 p-4 rounded-lg">
                <p class="text-gray-700">
                  <span class="font-semibold">Cần tái khám:</span>
                  <span class="ml-2">{{ medicalRecord.followUpRequire ? 'Có' : 'Không' }}</span>
                </p>
                <p
                  v-if="medicalRecord.followUpRequire && medicalRecord.followUpDate"
                  class="text-gray-700 mt-2"
                >
                  <span class="font-semibold">Ngày tái khám:</span>
                  <span class="ml-2">{{ formatDate(medicalRecord.followUpDate) }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Prescribed Medications Card -->
        <div
          v-if="prescribedMedications.length > 0"
          class="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div class="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-white">
            <h2 class="text-2xl font-bold flex items-center gap-3">
              <i class="fa-solid fa-pills"></i>
              Đơn Thuốc
            </h2>
          </div>

          <div class="p-8 space-y-6">
            <div
              v-for="(med, index) in prescribedMedications"
              :key="med._id"
              class="border border-green-200 rounded-lg p-6 bg-green-50"
            >
              <div class="mb-4">
                <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Đơn #{{ index + 1 }}
                </span>
              </div>

              <!-- Drugs List -->
              <div class="mb-6">
                <h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <i class="fa-solid fa-medication text-blue-500"></i>
                  Danh Sách Thuốc
                </h4>
                <div class="space-y-2">
                  <div
                    v-for="drug in med.drugs"
                    :key="drug._id"
                    class="flex items-center justify-between bg-white p-3 rounded-lg border border-green-200"
                  >
                    <span class="font-semibold text-gray-800">
                      {{ drug.drugId?.name || drug.drugId || 'Tên thuốc không xác định' }}
                    </span>
                    <span class="text-gray-600 text-sm">Liều lượng: {{ drug.dosage }}</span>
                  </div>
                </div>
              </div>

              <!-- Dosage and Frequency -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white p-4 rounded-lg border border-green-200">
                  <p class="text-sm text-gray-600 font-semibold mb-1">Liều lượng</p>
                  <p class="text-lg font-bold text-gray-800">{{ med.dosage }}</p>
                </div>
                <div class="bg-white p-4 rounded-lg border border-green-200">
                  <p class="text-sm text-gray-600 font-semibold mb-1">Tần suất</p>
                  <p class="text-lg font-bold text-gray-800">{{ med.frequency }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Prescribed Medications -->
        <div v-else class="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <p class="text-amber-800 flex items-center gap-2">
            <i class="fa-solid fa-info-circle"></i>
            Chưa có đơn thuốc cho hồ sơ y tế này
          </p>
        </div>
      </div>

      <!-- No Data -->
      <div v-else class="bg-gray-50 rounded-lg p-8 text-center">
        <p class="text-gray-600 text-lg">Không tìm thấy hồ sơ y tế</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMedicalRecordStore } from '@/stores/MedicalRecordStore';
import { usePrescribedMedicationStore } from '@/stores/PrescribedMedicationStore';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const medicalRecordStore = useMedicalRecordStore();
const prescribedMedicationStore = usePrescribedMedicationStore();

const medicalRecordId = route.params.id;
const medicalRecord = ref(null);
const prescribedMedications = ref([]);
const isLoading = ref(true);
const error = ref(null);

const formatDate = dateString => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const goBack = () => {
  router.back();
};

const goToEdit = () => {
  router.push({
    name: 'EditMedicalRecord',
    params: { id: medicalRecordId },
  });
};

onMounted(async () => {
  isLoading.value = true;
  error.value = null;

  try {
    medicalRecord.value = await medicalRecordStore.fetchMedicalRecordById(medicalRecordId);

    if (!medicalRecord.value) {
      error.value = 'Không tìm thấy hồ sơ y tế';
      return;
    }

    // Fetch prescribed medications nếu có
    prescribedMedications.value =
      await prescribedMedicationStore.fetchPrescribedMedicationsByMedicalRecordId(medicalRecordId);

    console.log('Loaded medical record:', medicalRecord.value);
    console.log('Loaded prescribed medications:', prescribedMedications.value);
  } catch (err) {
    console.error('Error loading data:', err);
    error.value = err.message || 'Có lỗi xảy ra khi tải dữ liệu';
    Swal.fire({
      title: 'Lỗi!',
      text: error.value,
      icon: 'error',
    });
  } finally {
    isLoading.value = false;
  }
});
</script>
