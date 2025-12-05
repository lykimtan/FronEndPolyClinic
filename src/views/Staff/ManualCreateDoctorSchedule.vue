<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Tạo Lịch Làm Việc</h1>
        <p class="text-gray-600">Chọn bác sĩ từ danh sách để tạo lịch làm việc</p>
      </div>

      <!-- Grid Layout: Doctor List + Form -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Doctor List -->
        <div class="lg:col-span-1">
          <DoctorListSelector
            :doctors="doctors"
            :is-loading="isLoadingDoctors"
            :selected-doctor-id="selectedDoctorId"
            @select-doctor="handleSelectDoctor"
          />
        </div>

        <!-- Right: Form + Results -->
        <div class="lg:col-span-2 space-y-6">
          <ScheduleForm
            ref="scheduleFormRef"
            :selected-doctor="selectedDoctor"
            :is-loading="isLoading"
            @submit="handleFormSubmit"
            @reset="handleFormReset"
          />

          <!-- Created Schedules Preview -->
          <CreatedSchedulesList :created-schedules="createdSchedules" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Swal from 'sweetalert2';
import { useDoctorStore } from '@/stores/DoctorStore';
import { useDoctorScheduleStore } from '@/stores/DoctorScheduleStore';
import DoctorListSelector from '@/components/Staff/DoctorListSelector.vue';
import ScheduleForm from '@/components/Staff/ScheduleForm.vue';
import CreatedSchedulesList from '@/components/Staff/CreatedSchedulesList.vue';

const doctorStore = useDoctorStore();
const doctorScheduleStore = useDoctorScheduleStore();

const doctors = ref([]);
const isLoadingDoctors = ref(false);
const isLoading = ref(false);
const createdSchedules = ref([]);
const selectedDoctorId = ref('');
const scheduleFormRef = ref(null);

// Computed property for selected doctor
const selectedDoctor = computed(() => {
  if (!doctors.value || doctors.value.length === 0) return null;
  return doctors.value.find(d => d._id === selectedDoctorId.value) || null;
});

// Methods
const handleSelectDoctor = doctor => {
  selectedDoctorId.value = doctor._id;
};

const handleFormSubmit = async submitData => {
  try {
    if (!selectedDoctor.value) {
      submitData.setErrorMessage('Vui lòng chọn bác sĩ');
      return;
    }

    if (
      !selectedDoctor.value.specializationIds ||
      selectedDoctor.value.specializationIds.length === 0
    ) {
      submitData.setErrorMessage('Bác sĩ không có chuyên khoa được gán');
      return;
    }

    isLoading.value = true;

    // Get the first specialization ID
    const specializationId =
      selectedDoctor.value.specializationIds[0]._id || selectedDoctor.value.specializationIds[0];

    // Create schedules for each shift
    const promises = submitData.shifts.map(shift =>
      doctorScheduleStore.createDoctorSchedule({
        doctorId: selectedDoctor.value._id,
        specializationId: specializationId,
        date: submitData.date,
        shift: shift,
      })
    );

    const results = await Promise.all(promises);
    createdSchedules.value.unshift(...results);

    submitData.setSuccessMessage(`Tạo thành công ${submitData.shifts.length} lịch làm việc!`);

    // Reset form after success
    setTimeout(() => {
      scheduleFormRef.value?.resetForm();
    }, 2000);

    // Show success alert
    await Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: `Đã tạo ${submitData.shifts.length} lịch làm việc`,
      confirmButtonText: 'OK',
    });
  } catch (error) {
    console.error('Error creating schedule:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Lỗi tạo lịch';
    submitData.setErrorMessage(errorMessage);
    await Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: errorMessage,
      confirmButtonText: 'OK',
    });
  } finally {
    isLoading.value = false;
  }
};

const handleFormReset = () => {
  // Reset logic if needed
};

// Fetch doctors on mount
onMounted(async () => {
  try {
    isLoadingDoctors.value = true;
    await doctorStore.fetchDoctors();
    doctors.value = doctorStore.getAll;
  } catch (error) {
    console.error('Error fetching doctors:', error);
  } finally {
    isLoadingDoctors.value = false;
  }
});
</script>
