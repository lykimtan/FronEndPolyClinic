<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">Hồ Sơ Y Tế Của Tôi</h1>
      <p class="text-gray-600">Quản lý và theo dõi các hồ sơ khám bệnh của bạn</p>
    </div>

    <!-- Main Content with Sidebar -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Left Column: Filter Sidebar -->
      <div class="lg:col-span-1">
        <MedicalRecordFilterSidebar
          :filters="filters"
          :medical-records="medicalRecords"
          @update-filter="updateFilter"
          @reset-filter="resetFilter"
        />
      </div>

      <!-- Right Column: Medical Records Grid -->
      <div class="lg:col-span-3">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <i class="fa-solid fa-spinner fa-spin text-blue-500 text-5xl mb-4"></i>
            <p class="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>

        <!-- Records Grid -->
        <div v-else-if="filteredRecords.length > 0">
          <!-- Results Info -->
          <div class="mb-6 flex items-center justify-between">
            <p class="text-gray-600">
              Hiển thị <span class="font-bold">{{ filteredRecords.length }}</span> hồ sơ
              <span v-if="hasActiveFilters" class="text-blue-500 ml-2">
                <i class="fa-solid fa-filter"></i> (Có bộ lọc)
              </span>
            </p>
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-600">Sắp xếp:</span>
              <select
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                :value="filters.sortBy"
                @change="updateFilter({ sortBy: $event.target.value })"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="doctor">Theo bác sĩ</option>
              </select>
            </div>
          </div>

          <!-- Records Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MedicalRecordCard
              v-for="record in filteredRecords"
              :key="record._id"
              :medical-record="record"
              @view-detail="handleViewDetail"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <i class="fa-solid fa-file-medical text-gray-300 text-6xl mb-4"></i>
          <p class="text-xl text-gray-500 font-medium mb-2">Không có hồ sơ y tế</p>
          <p class="text-sm text-gray-400 mb-6">
            {{
              hasActiveFilters
                ? 'Không tìm thấy hồ sơ phù hợp với bộ lọc'
                : 'Bạn chưa có hồ sơ y tế nào'
            }}
          </p>
          <button
            v-if="hasActiveFilters"
            class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            @click="resetFilter"
          >
            <i class="fa-solid fa-rotate-left mr-2"></i>
            Đặt lại bộ lọc
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMedicalRecordStore } from '@/stores/MedicalRecordStore';
import { useUserStore } from '@/stores/userStore';
import MedicalRecordFilterSidebar from '@/components/Patient/MedicalRecordFilterSidebar.vue';
import MedicalRecordCard from '@/components/Patient/MedicalRecordCard.vue';
import Swal from 'sweetalert2';

const medicalRecordStore = useMedicalRecordStore();
const userStore = useUserStore();

const medicalRecords = ref([]);
const loading = ref(true);
const currentUser = ref(null);

const filters = ref({
  sortBy: 'newest',
  showWithPrescription: false,
  showFollowUp: false,
  doctorId: '',
});

const filteredRecords = computed(() => {
  let records = [...medicalRecords.value];

  // Filter by follow-up
  if (filters.value.showFollowUp) {
    records = records.filter(r => r.followUpRequire === true);
  }

  // Filter by doctor
  if (filters.value.doctorId) {
    records = records.filter(r => r.doctorId?._id === filters.value.doctorId);
  }

  // Sort
  switch (filters.value.sortBy) {
    case 'oldest':
      records.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case 'doctor':
      records.sort((a, b) =>
        (a.doctorId?.fullName || '').localeCompare(b.doctorId?.fullName || '')
      );
      break;
    case 'newest':
    default:
      records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return records;
});

const hasActiveFilters = computed(() => {
  return (
    filters.value.showWithPrescription ||
    filters.value.showFollowUp ||
    filters.value.doctorId !== ''
  );
});

async function fetchMedicalRecords() {
  try {
    loading.value = true;
    const patientId = currentUser.value;
    medicalRecords.value = await medicalRecordStore.fetchRecordsByPatient(patientId);
    console.log('Fetched medical records:', medicalRecords.value);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    Swal.fire({
      title: 'Lỗi!',
      text: error.message || 'Không thể tải hồ sơ y tế',
      icon: 'error',
      confirmButtonText: 'Đóng',
    });
  } finally {
    loading.value = false;
  }
}

function updateFilter(newFilter) {
  filters.value = { ...filters.value, ...newFilter };
}

function resetFilter() {
  filters.value = {
    sortBy: 'newest',
    showWithPrescription: false,
    showFollowUp: false,
    doctorId: '',
  };
}

function handleViewDetail(recordId) {
  console.log('View detail for record:', recordId);
}

onMounted(async () => {
  currentUser.value = userStore.getUserInfo.id;
  console.log('Current User ID:', currentUser.value);
  await fetchMedicalRecords();
});
</script>
