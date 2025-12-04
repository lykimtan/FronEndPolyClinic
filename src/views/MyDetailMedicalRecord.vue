<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <button
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors flex items-center gap-2 mb-4"
          @click="goBack"
        >
          <i class="fa-solid fa-arrow-left"></i>
          Quay lại
        </button>
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Chi Tiết Hồ Sơ Y Tế</h1>
        <p class="text-gray-600">Xem thông tin chi tiết về khám bệnh của bạn</p>
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
        <!-- Header Info Card -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6 text-white">
            <h2 class="text-2xl font-bold mb-4">Thông Tin Cuộc Khám</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Bác sĩ -->
              <div>
                <p class="text-blue-100 text-sm font-semibold mb-1">Bác Sĩ Khám</p>
                <p class="text-lg font-bold">{{ medicalRecord.doctorId?.fullName || 'N/A' }}</p>
              </div>

              <!-- Ngày khám -->
              <div>
                <p class="text-blue-100 text-sm font-semibold mb-1">Ngày Khám</p>
                <p class="text-lg font-bold">{{ formatDate(medicalRecord.createdAt) }}</p>
              </div>

              <!-- Cuộc hẹn -->
              <div>
                <p class="text-blue-100 text-sm font-semibold mb-1">Cuộc Hẹn</p>
                <p class="text-lg font-bold">
                  {{
                    medicalRecord.appointmentId?._id
                      ? 'ID: ' + truncateId(medicalRecord.appointmentId._id)
                      : 'N/A'
                  }}
                </p>
              </div>

              <!-- Trạng thái -->
              <div>
                <p class="text-blue-100 text-sm font-semibold mb-1">Trạng Thái</p>
                <span
                  class="inline-block px-3 py-1 bg-green-400 text-green-900 rounded-full text-sm font-semibold"
                >
                  Đã Hoàn Thành
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Medical Information Card -->
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
          <div
            class="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-white flex items-center justify-between"
          >
            <h2 class="text-2xl font-bold flex items-center gap-3">
              <i class="fa-solid fa-pills"></i>
              Đơn Thuốc
            </h2>
            <button
              class="px-4 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
              @click="printPrescriptions"
            >
              <i class="fa-solid fa-print"></i>
              In Đơn
            </button>
          </div>

          <div class="p-8 space-y-6">
            <div
              v-for="(med, index) in prescribedMedications"
              :key="med._id"
              class="border border-green-200 rounded-lg p-6 bg-green-50"
            >
              <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Đơn #{{ index + 1 }}
              </span>

              <!-- Drugs List -->
              <div class="mt-6">
                <h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <i class="fa-solid fa-medication text-blue-500"></i>
                  Danh Sách Thuốc
                </h4>
                <div v-if="med.drugs && med.drugs.length > 0" class="space-y-3">
                  <div
                    v-for="(drug, idx) in med.drugs"
                    :key="idx"
                    class="bg-white p-4 rounded-lg border border-green-200 hover:shadow-md transition-shadow"
                  >
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div>
                        <p class="text-xs text-gray-500 font-semibold uppercase mb-1">Tên Thuốc</p>
                        <button
                          class="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                          @click="openDrugDetail(drug.drugId)"
                        >
                          {{ drug.drugId?.name || 'Tên thuốc không xác định' }}
                        </button>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 font-semibold uppercase mb-1">Liều Lượng</p>
                        <p class="text-gray-700">{{ drug.dosage || 'N/A' }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 font-semibold uppercase mb-1">Tần Suất</p>
                        <p class="text-gray-700">{{ drug.frequency || 'N/A' }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 font-semibold uppercase mb-1">Số Lượng</p>
                        <p class="text-gray-700 font-semibold">{{ drug.quantity || 0 }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 font-semibold uppercase mb-1">Ghi Chú</p>
                        <p class="text-gray-700">{{ drug.note || '-' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-gray-500 italic">Không có thuốc nào trong đơn</div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Prescribed Medications -->
        <div v-else class="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div class="text-center">
            <p class="text-amber-800 flex items-center justify-center gap-2">
              <i class="fa-solid fa-info-circle"></i>
              Chưa có đơn thuốc cho hồ sơ y tế này
            </p>
          </div>
        </div>
      </div>

      <!-- No Data -->
      <div v-else class="bg-gray-50 rounded-lg p-8 text-center">
        <p class="text-gray-600 text-lg">Không tìm thấy hồ sơ y tế</p>
      </div>
    </div>

    <!-- Drug Detail Modal -->
    <DrugDetailModal v-model="showDrugModal" :drug="selectedDrug" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMedicalRecordStore } from '@/stores/MedicalRecordStore';
import { usePrescribedMedicationStore } from '@/stores/PrescribedMedicationStore';
import DrugDetailModal from '@/components/Doctor/DrugDetailModal.vue';
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
const showDrugModal = ref(false);
const selectedDrug = ref(null);

const goBack = () => {
  router.back();
};

const openDrugDetail = medication => {
  selectedDrug.value = medication;
  showDrugModal.value = true;
};

const formatDate = dateString => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const truncateId = id => {
  return id ? id.substring(0, 8) + '...' : 'N/A';
};

const printPrescriptions = () => {
  const printWindow = window.open('', '', 'height=600,width=800');

  const prescriptionsHTML = prescribedMedications.value
    .map((med, index) => {
      const drugsTable = med.drugs
        .map(
          drug => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${drug.drugId?.name || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${drug.dosage || 'N/A'} / 1 lần uống</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${drug.frequency || 'N/A'} / ngày</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${drug.quantity || 0}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${drug.note || '-'}</td>
            </tr>
          `
        )
        .join('');

      return `
    <div style="page-break-after: always; padding: 20px; border: 1px solid #ccc; margin-bottom: 20px;">
      <h2 style="text-align: center; font-size: 20px; margin-bottom: 20px;">ĐƠN THUỐC #${index + 1}</h2>

      <div style="margin-bottom: 20px;">
        <strong>Bệnh nhân:</strong> ${medicalRecord.value?.patientId?.fullName || 'N/A'}<br>
        <strong>Bác sĩ:</strong> ${medicalRecord.value?.doctorId?.fullName || 'N/A'}<br>
        <strong>Chẩn đoán:</strong> ${medicalRecord.value?.diagnosis || 'N/A'}<br>
        <strong>Ngày kê:</strong> ${new Date().toLocaleDateString('vi-VN')}<br>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Tên Thuốc</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Liều Lượng</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Tần Suất</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Số Lượng</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Ghi Chú</th>
          </tr>
        </thead>
        <tbody>
          ${drugsTable}
        </tbody>
      </table>

      <div style="margin-top: 40px; display: flex; justify-content: space-between;">
        <div style="text-align: center; width: 40%;">
          <p style="margin-bottom: 50px;">Ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}</p>
          <p style="font-weight: bold;">Bác sĩ kê đơn</p>
          <p style="margin-top: 80px">${medicalRecord.value?.doctorId?.fullName || 'N/A'}</p>
        </div>
      </div>
    </div>
      `;
    })
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>In Đơn Thuốc</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        ${prescriptionsHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
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
