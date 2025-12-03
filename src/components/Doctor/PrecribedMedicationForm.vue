<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <form @submit.prevent="handleSubmit">
      <!-- Header -->
      <div class="mb-6 border-b pb-4">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fa-solid fa-prescription text-blue-500"></i>
          {{ isEdit ? 'Cập Nhật Đơn Thuốc' : 'Thêm Đơn Thuốc' }}
        </h2>
        <p class="text-gray-600 text-sm mt-2">
          {{ isEdit ? 'Sửa đổi thông tin đơn thuốc' : 'Kê đơn thuốc cho bệnh nhân' }}
        </p>
      </div>

      <!-- Medications List Section -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <label class="block text-sm font-semibold text-gray-700">
            <i class="fa-solid fa-pills mr-2 text-blue-500"></i>Danh Sách Thuốc
            <span class="text-red-500">*</span>
          </label>
          <button
            type="button"
            class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
            @click="showMedicationModal = true"
          >
            <i class="fa-solid fa-plus"></i>
            Thêm Thuốc
          </button>
        </div>

        <!-- Medications Table -->
        <div v-if="formData.drugs.length > 0" class="overflow-x-auto mb-4">
          <table class="w-full text-sm">
            <thead class="bg-gray-100 border-b">
              <tr>
                <th class="px-4 py-2 text-left font-semibold text-gray-700">Tên Thuốc</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-700">Chất Hoạt Chất</th>
                <th class="px-4 py-2 text-center font-semibold text-gray-700">Dạng</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-700">Liều Lượng</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-700">Tần Suất</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-700">Số Lượng</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-700">Ghi Chú</th>
                <th class="px-4 py-2 text-right font-semibold text-gray-700">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(drug, index) in formData.drugs"
                :key="index"
                class="border-b hover:bg-gray-50"
              >
                <td class="px-4 py-2 text-gray-800">{{ drug.medicationName }}</td>
                <td class="px-4 py-2 text-gray-700">{{ drug.medicationGeneric }}</td>
                <td class="px-4 py-2 text-center text-gray-600">{{ drug.medicationForm }}</td>
                <td class="px-4 py-2">
                  <input
                    v-model="drug.dosage"
                    type="text"
                    placeholder="2 viên/lần"
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td class="px-4 py-2">
                  <input
                    v-model="drug.frequency"
                    type="text"
                    placeholder="3 lần/ngày"
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td class="px-4 py-2">
                  <input
                    v-model.number="drug.quantity"
                    type="number"
                    placeholder="0"
                    min="0"
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td class="px-4 py-2">
                  <input
                    v-model="drug.note"
                    type="text"
                    placeholder="Ghi chú (tùy chọn)"
                    class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td class="px-4 py-2 text-right">
                  <button
                    type="button"
                    class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-semibold transition-colors"
                    @click="removeDrug(index)"
                  >
                    <i class="fa-solid fa-trash mr-1"></i>Xóa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="bg-gray-50 rounded-lg p-6 text-center">
          <i class="fa-solid fa-inbox text-4xl text-gray-300 mb-3"></i>
          <p class="text-gray-600">Chưa có thuốc nào. Nhấn "Thêm Thuốc" để bắt đầu</p>
        </div>

        <p v-if="errors.drugs" class="text-red-500 text-sm mt-2">
          <i class="fa-solid fa-exclamation-circle mr-1"></i>{{ errors.drugs }}
        </p>
      </div>

      <!-- Buttons -->
      <div class="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <i class="fa-solid fa-save"></i>
          {{ isSubmitting ? 'Đang xử lý...' : isEdit ? 'Cập Nhật' : 'Tạo Đơn' }}
        </button>
        <button
          type="button"
          class="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          @click="resetForm"
        >
          <i class="fa-solid fa-rotate-left"></i>
          Xóa
        </button>
      </div>
    </form>

    <!-- Medication Selection Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="showMedicationModal"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          @click.self="showMedicationModal = false"
        >
          <div class="bg-white rounded-lg shadow-2xl max-w-md w-full">
            <!-- Modal Header -->
            <div class="bg-blue-500 text-white p-4 flex items-center justify-between">
              <h3 class="text-lg font-bold flex items-center gap-2">
                <i class="fa-solid fa-pills"></i>
                Chọn Thuốc
              </h3>
              <button
                class="hover:bg-blue-600 p-2 rounded transition-colors"
                @click="showMedicationModal = false"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <!-- Search -->
            <div class="p-4 border-b">
              <input
                v-model="medicationSearch"
                type="text"
                placeholder="Tìm thuốc..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <!-- Medications List -->
            <div class="max-h-96 overflow-y-auto">
              <div v-if="filteredMedications.length === 0" class="p-6 text-center text-gray-600">
                <i class="fa-solid fa-inbox text-3xl text-gray-300 mb-2"></i>
                <p>Không tìm thấy thuốc</p>
              </div>
              <button
                v-for="medication in filteredMedications"
                :key="medication._id"
                type="button"
                class="w-full px-4 py-3 text-left hover:bg-blue-50 border-b transition-colors"
                @click="addDrug(medication)"
              >
                <div class="font-semibold text-gray-800">{{ medication.name }}</div>
                <div class="text-sm text-gray-600">{{ medication.genericName }}</div>
                <div class="text-xs text-gray-500">
                  {{ medication.form }} - {{ medication.unit }}
                </div>
              </button>
            </div>

            <!-- Modal Footer -->
            <div class="p-4 border-t text-right">
              <button
                type="button"
                class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors"
                @click="showMedicationModal = false"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMedicalRecordStore } from '@/stores/MedicalRecordStore';
import { useMedicationStore } from '@/stores/MedicationStore';
import { usePrescribedMedicationStore } from '@/stores/PrescribedMedicationStore';
import Swal from 'sweetalert2';

const props = defineProps({
  medicalRecordId: {
    type: String,
    default: null,
  },
  prescribedMedicationId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['success', 'error']);

const medicalRecordStore = useMedicalRecordStore();
const medicationStore = useMedicationStore();
const prescribedMedicationStore = usePrescribedMedicationStore();

const isSubmitting = ref(false);
const isEdit = ref(false);
const showMedicationModal = ref(false);
const medicationSearch = ref('');

const formData = ref({
  drugs: [],
});

const errors = ref({
  drugs: '',
});

const filteredMedications = computed(() => {
  const medications = medicationStore.getAllMedications;
  if (!medicationSearch.value) return medications;

  const search = medicationSearch.value.toLowerCase();
  return medications.filter(
    med => med.name.toLowerCase().includes(search) || med.genericName.toLowerCase().includes(search)
  );
});

onMounted(async () => {
  try {
    await medicationStore.fetchAllMedications();

    // Nếu là edit mode, load dữ liệu đơn thuốc
    if (props.prescribedMedicationId) {
      isEdit.value = true;
      const prescription = await prescribedMedicationStore.fetchPrescribedMedicationById(
        props.prescribedMedicationId
      );

      if (prescription && prescription.drugs) {
        formData.value.drugs = prescription.drugs.map(drug => ({
          drugId: drug.drugId._id,
          medicationName: drug.drugId.name,
          medicationGeneric: drug.drugId.genericName,
          medicationForm: drug.drugId.form,
          dosage: drug.dosage,
          frequency: drug.frequency,
          quantity: drug.quantity,
          note: drug.note,
        }));
      }
    }
  } catch (err) {
    console.error('Error loading medications:', err);
  }
});

const addDrug = medication => {
  const exists = formData.value.drugs.some(d => d.drugId === medication._id);
  if (exists) {
    Swal.fire({
      title: 'Cảnh báo!',
      text: 'Thuốc này đã được thêm vào đơn',
      icon: 'warning',
    });
    return;
  }

  formData.value.drugs.push({
    drugId: medication._id,
    medicationName: medication.name,
    medicationGeneric: medication.genericName,
    medicationForm: medication.form,
    dosage: '',
    frequency: '',
    quantity: 0,
    note: '',
  });

  medicationSearch.value = '';
  showMedicationModal.value = false;
};

const removeDrug = index => {
  formData.value.drugs.splice(index, 1);
};

const validateForm = () => {
  errors.value = {
    drugs: formData.value.drugs.length === 0 ? 'Phải thêm ít nhất một loại thuốc' : '',
  };

  // Kiểm tra mỗi drug có dosage và frequency
  for (let i = 0; i < formData.value.drugs.length; i++) {
    const drug = formData.value.drugs[i];
    if (!drug.dosage.trim()) {
      errors.value.drugs = `Liều lượng không được để trống cho "${drug.medicationName}"`;
      return false;
    }
    if (!drug.frequency.trim()) {
      errors.value.drugs = `Tần suất không được để trống cho "${drug.medicationName}"`;
      return false;
    }
  }

  return !errors.value.drugs;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    Swal.fire({
      title: 'Lỗi!',
      text: errors.value.drugs || 'Vui lòng điền đầy đủ thông tin',
      icon: 'error',
    });
    return;
  }

  isSubmitting.value = true;

  try {
    const medicationData = {
      drugs: formData.value.drugs.map(d => ({
        drugId: d.drugId,
        dosage: d.dosage,
        frequency: d.frequency,
        quantity: d.quantity,
        note: d.note,
      })),
    };

    let result;

    if (isEdit.value && props.prescribedMedicationId) {
      // Cập nhật đơn thuốc
      result = await prescribedMedicationStore.updatePrescribedMedication(
        props.prescribedMedicationId,
        medicationData
      );

      Swal.fire({
        title: 'Thành công!',
        text: 'Cập nhật đơn thuốc thành công',
        icon: 'success',
      });
    } else {
      // Tạo mới đơn thuốc
      medicationData.medicalRecordId = props.medicalRecordId;
      result = await prescribedMedicationStore.createPrescribedMedication(medicationData);

      // Update medical record với prescribed medication ID
      const medicalRecord = medicalRecordStore.getCurrentMedicalRecord;
      if (medicalRecord) {
        if (!medicalRecord.prescribedMedications) {
          medicalRecord.prescribedMedications = [];
        }
        medicalRecord.prescribedMedications.push(result._id);
        // Cập nhật store
        medicalRecordStore.setCurrentMedicalRecord(medicalRecord);
      }

      Swal.fire({
        title: 'Thành công!',
        text: 'Tạo đơn thuốc thành công',
        icon: 'success',
      });
    }

    resetForm();
    emit('success', result);
  } catch (err) {
    Swal.fire({
      title: 'Lỗi!',
      text: err.message || 'Có lỗi xảy ra khi xử lý đơn thuốc',
      icon: 'error',
    });
    emit('error', err);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    drugs: [],
  };
  errors.value = {
    drugs: '',
  };
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
