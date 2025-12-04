<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <MedicalRecordHeader :medical-record="medicalRecord" @back="goBack" @edit="goToEdit" />

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
        <!-- Medical Record Info -->
        <MedicalRecordInfo :medical-record="medicalRecord" />

        <!-- Prescribed Medications -->
        <PrescribedMedicationList
          :prescribed-medications="prescribedMedications"
          @print="printPrescriptions"
          @drug-click="openDrugDetail"
          @create-prescription="goToPrescribedMedicationForm"
          @edit-prescription="goToEditPrescribedMedication"
        />
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
import MedicalRecordHeader from '@/components/Doctor/MedicalRecordHeader.vue';
import MedicalRecordInfo from '@/components/Doctor/MedicalRecordInfo.vue';
import PrescribedMedicationList from '@/components/Doctor/PrescribedMedicationList.vue';
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

const goToEdit = () => {
  router.push({
    name: 'EditMedicalRecord',
    params: { id: medicalRecordId },
  });
};

const goToPrescribedMedicationForm = () => {
  router.push({
    name: 'FormPrescribedMedication',
    params: { medicalRecordId },
  });
};

const goToEditPrescribedMedication = prescribedMedicationId => {
  router.push({
    name: 'EditPrescribedMedication',
    params: { prescribedMedicationId },
  });
};

const openDrugDetail = medication => {
  selectedDrug.value = medication;
  showDrugModal.value = true;
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
              <td style="border: 1px solid #ddd; padding: 8px;">${drug.dosage || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${drug.frequency || 'N/A'}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${drug.quantity || 'N/A'}</td>
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
