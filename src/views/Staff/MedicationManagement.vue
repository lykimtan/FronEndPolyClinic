<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex">
      <!-- Sidebar Filter Component -->
      <MedicationFilter
        :filters="filters"
        @update-filter="updateFilter"
        @clear-filters="clearFilters"
        @add-medication="goToAddMedication"
      />

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-800 mb-2">Danh Sách Thuốc</h1>
          <p class="text-gray-600">
            Tổng cộng:
            <span class="font-semibold text-blue-600">{{ filteredMedications.length }}</span> loại
            thuốc
          </p>
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

        <!-- Empty State -->
        <div
          v-else-if="filteredMedications.length === 0"
          class="bg-white rounded-lg p-12 text-center"
        >
          <i class="fa-solid fa-pills text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy thuốc</h3>
          <p class="text-gray-500">Hãy thử thay đổi bộ lọc hoặc thêm thuốc mới</p>
        </div>

        <!-- Medications Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MedicationCard
            v-for="medication in filteredMedications"
            :key="medication._id"
            :medication="medication"
            :api-base-url="apiBaseUrl"
            @edit="editMedication"
            @delete="deleteMedicationConfirm"
            @view-details="showMedicationDetail"
          />
        </div>
      </main>
    </div>

    <!-- Detail Dialog -->
    <DialogDetailMedication
      :is-open="showDetailDialog"
      :medication="selectedMedication"
      :api-base-url="apiBaseUrl"
      @close="closeMedicationDetail"
      @edit="handleEditFromDialog"
      @delete="handleDeleteFromDialog"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMedicationStore } from '@/stores/MedicationStore';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import MedicationFilter from '@/components/Staff/MedicationFilter.vue';
import MedicationCard from '@/components/Staff/MedicationCard.vue';
import DialogDetailMedication from '@/components/Dialog/DialogDetailMedication.vue';

const router = useRouter();
const medicationStore = useMedicationStore();

const isLoading = ref(true);
const error = ref(null);
const apiBaseUrl = ref(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');
const showDetailDialog = ref(false);
const selectedMedication = ref(null);

const filters = ref({
  searchName: '',
  form: '',
  unit: '',
});

const filteredMedications = computed(() => {
  return medicationStore.getAllMedications
    .filter(med => {
      const nameMatch =
        med.name.toLowerCase().includes(filters.value.searchName.toLowerCase()) ||
        (med.genericName &&
          med.genericName.toLowerCase().includes(filters.value.searchName.toLowerCase()));
      const formMatch = !filters.value.form || med.form === filters.value.form;
      const unitMatch = !filters.value.unit || med.unit === filters.value.unit;

      return nameMatch && formMatch && unitMatch;
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'vi'));
});

const updateFilter = ({ key, value }) => {
  filters.value[key] = value;
};

const goToAddMedication = () => {
  router.push({ name: 'MedicationForm' });
};

const showMedicationDetail = async medication => {
  try {
    await medicationStore.fetchMedicationById(medication._id);
    selectedMedication.value = medicationStore.getCurrentMedication;
    showDetailDialog.value = true;
  } catch {
    Swal.fire({
      title: 'Lỗi!',
      text: 'Không thể tải thông tin thuốc',
      icon: 'error',
    });
  }
};

const closeMedicationDetail = () => {
  showDetailDialog.value = false;
  selectedMedication.value = null;
};

const handleEditFromDialog = () => {
  if (selectedMedication.value) {
    closeMedicationDetail();
    router.push({
      name: 'MedicationForm',
      params: { id: selectedMedication.value._id },
    });
  }
};

const handleDeleteFromDialog = async medicationId => {
  try {
    await medicationStore.deleteMedication(medicationId);
    closeMedicationDetail();
    Swal.fire({
      title: 'Thành công!',
      text: 'Xóa thuốc thành công',
      icon: 'success',
    });
  } catch (err) {
    Swal.fire({
      title: 'Lỗi!',
      text: err.message || 'Có lỗi xảy ra khi xóa thuốc',
      icon: 'error',
    });
  }
};

const editMedication = medication => {
  router.push({
    name: 'MedicationForm',
    params: { id: medication._id },
  });
};

const deleteMedicationConfirm = medication => {
  Swal.fire({
    title: 'Xác nhận xóa?',
    text: `Bạn có chắc muốn xóa "${medication.name}" không?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
  }).then(result => {
    if (result.isConfirmed) {
      deleteMedication(medication._id);
    }
  });
};

const deleteMedication = async medicationId => {
  try {
    await medicationStore.deleteMedication(medicationId);
    Swal.fire({
      title: 'Thành công!',
      text: 'Xóa thuốc thành công',
      icon: 'success',
    });
  } catch (err) {
    Swal.fire({
      title: 'Lỗi!',
      text: err.message || 'Có lỗi xảy ra khi xóa thuốc',
      icon: 'error',
    });
  }
};

const clearFilters = () => {
  filters.value = {
    searchName: '',
    form: '',
    unit: '',
  };
};

onMounted(async () => {
  isLoading.value = true;
  error.value = null;

  try {
    await medicationStore.fetchAllMedications();
  } catch (err) {
    error.value = err.message || 'Có lỗi xảy ra khi tải danh sách thuốc';
    console.error('Error loading medications:', err);
  } finally {
    isLoading.value = false;
  }
});
</script>
