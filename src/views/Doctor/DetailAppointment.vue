<template>
  <div class="min-h-screen bg-gray-50/50 p-4 md:p-8">
    <div v-if="!appointment" class="flex h-64 items-center justify-center">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
      ></div>
    </div>

    <div v-else class="mx-auto max-w-6xl">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-800">Chi Tiết Cuộc Hẹn</h1>
        <button
          class="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-50"
          @click="$router.back()"
        >
          Quay lại
        </button>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-1">
          <div class="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div class="h-24 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

            <div class="px-6 pb-6">
              <div class="relative -mt-12 mb-4 flex justify-center">
                <img
                  :src="getAvatarUrl(appointment.patientId?.avatar)"
                  alt="Patient Avatar"
                  class="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
                />
              </div>

              <div class="text-center">
                <h2 class="text-xl font-bold text-gray-900">
                  {{ appointment.patientId?.fullName }}
                </h2>
                <p class="text-sm text-gray-500">Bệnh nhân</p>
              </div>

              <div class="mt-6 space-y-4 border-t border-gray-100 pt-6">
                <div class="flex items-center gap-3 text-sm">
                  <span
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600"
                  >
                    <i class="fa-solid fa-phone"></i>
                  </span>
                  <span class="text-gray-600">{{
                    appointment.patientId?.phone || 'Chưa cập nhật'
                  }}</span>
                </div>

                <div class="flex items-center gap-3 text-sm">
                  <span
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600"
                  >
                    <i class="fa-solid fa-envelope"></i>
                  </span>
                  <span class="text-gray-600 truncate" :title="appointment.patientId?.email">{{
                    appointment.patientId?.email
                  }}</span>
                </div>
                <div class="flex items-center gap-3 text-sm">
                  <span
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600"
                  >
                    <i class="fa-solid fa-mars-and-venus"></i>
                  </span>
                  <span class="text-gray-600">{{
                    getGender(appointment.patientId?.gender) || 'Chưa có giới tính'
                  }}</span>
                </div>

                <div class="flex items-center gap-3 text-sm">
                  <span
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600"
                  >
                    <i class="fa-solid fa-map"></i>
                  </span>
                  <span class="text-gray-600">{{
                    appointment.patientId?.address || 'Chưa có địa chỉ'
                  }}</span>
                </div>

                <div class="flex items-center gap-3 text-sm">
                  <span
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600"
                  >
                    <i class="fa-solid fa-cake-candles"></i>
                  </span>
                  <span class="text-gray-600">
                    {{ formatDate(appointment.patientId?.dateOfBirth) }}
                    ({{ calculateAge(appointment.patientId?.dateOfBirth) }} tuổi)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2">
          <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <div
              class="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4"
            >
              <div>
                <h3 class="text-lg font-bold text-gray-900">Thông tin buổi khám</h3>
                <p class="text-sm text-gray-500">
                  Mã: #{{ appointment._id.slice(-6).toUpperCase() }}
                </p>
              </div>

              <span
                class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                :class="getStatusClass(appointment.status)"
              >
                <span class="mr-1.5 h-2 w-2 rounded-full bg-current"></span>
                {{ translateStatus(appointment.status) }}
              </span>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div class="rounded-lg bg-gray-50 p-4">
                <p class="text-xs font-medium uppercase text-gray-400">Chuyên khoa</p>
                <p class="mt-1 font-semibold text-gray-900">
                  {{ appointment.specializationId?.name }}
                </p>
              </div>

              <div class="rounded-lg bg-gray-50 p-4">
                <p class="text-xs font-medium uppercase text-gray-400">Bác sĩ phụ trách</p>
                <div class="mt-1 flex items-center gap-2">
                  <div
                    class="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600"
                  >
                    DR
                  </div>
                  <p class="font-semibold text-gray-900">
                    Bs. {{ appointment.doctorId?.firstName }}
                    {{ appointment.doctorId?.lastName }}
                  </p>
                </div>
              </div>

              <div class="rounded-lg bg-gray-50 p-4">
                <p class="text-xs font-medium uppercase text-gray-400">Ngày khám</p>
                <p class="mt-1 font-semibold text-gray-900">
                  {{ formatDate(appointment.appointmentDate) }}
                </p>
              </div>

              <div class="rounded-lg bg-gray-50 p-4">
                <p class="text-xs font-medium uppercase text-gray-400">Khung giờ</p>
                <p class="mt-1 font-semibold text-gray-900">
                  {{ appointment.slotId?.time || 'N/A' }}
                </p>
              </div>
            </div>

            <div class="mt-6 space-y-6">
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Lý do khám</label>
                <div class="rounded-lg border border-gray-200 bg-white p-4 text-gray-700">
                  {{ appointment.reason }}
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">Ghi chú thêm</label>
                <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-600 italic">
                  {{ appointment.notes || 'Không có ghi chú nào.' }}
                </div>
              </div>
              <div class="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
                <template v-if="appointment.status === 'pending'">
                  <button
                    class="group flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 font-medium text-white transition-all duration-300 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30"
                    @click.stop="approveAppointment(appointment._id)"
                  >
                    <i class="fa-solid fa-check transition-transform group-hover:scale-125"></i>
                    Duyệt lịch
                  </button>

                  <button
                    class="group flex items-center gap-2 rounded-lg bg-rose-500 px-5 py-2.5 font-medium text-white transition-all duration-300 hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30"
                    @click.stop="rejectAppointment(appointment._id)"
                  >
                    <i class="fa-solid fa-xmark transition-transform group-hover:rotate-90"></i>
                    Từ chối
                  </button>
                </template>

                <button
                  v-if="appointment.status === 'completed' && appointment.medicalRecordId"
                  class="flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2.5 font-medium text-white transition-all duration-300 hover:bg-indigo-600"
                  @click.stop="viewMedicalRecord(appointment.medicalRecordId)"
                >
                  <i class="fa-solid fa-file-medical"></i>
                  Hồ sơ bệnh án
                </button>
              </div>
              <h3 class="text-lg font-bold text-gray-900">Thông tin khác</h3>
              <div class="flex items-center gap-3 text-sm">
                <span
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600"
                >
                  <i class="fa-solid fa-hand-dots"></i>
                </span>
                <span class="text-gray-600">
                  Dị ứng:
                  {{
                    appointment.patientId.allergies?.length > 0
                      ? appointment.patientId.allergies.join(', ')
                      : 'Chưa có thông tin'
                  }}
                </span>
              </div>
              <div
                v-if="hasEmergencyInfo"
                class="mt-6 overflow-hidden rounded-xl border border-rose-100 bg-rose-50"
              >
                <div
                  class="flex items-center gap-2 border-b border-rose-100 px-4 py-3 text-rose-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="h-5 w-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <h3 class="text-sm font-bold">Liên hệ khẩn cấp</h3>
                </div>

                <div class="p-4">
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-xs text-rose-600/70">Người liên hệ</span>
                      <span class="text-sm font-semibold text-gray-800">
                        {{ emergencyContact.name }}
                      </span>
                    </div>

                    <div class="flex justify-between">
                      <span class="text-xs text-rose-600/70">Mối quan hệ</span>
                      <span class="text-sm font-medium text-gray-700">
                        {{ emergencyContact.relationship || 'Không rõ' }}
                      </span>
                    </div>

                    <div v-if="emergencyContact.phone" class="pt-2">
                      <a
                        :href="`tel:${emergencyContact.phone}`"
                        class="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2 text-sm font-bold text-rose-600 shadow-sm ring-1 ring-rose-200 transition hover:bg-rose-600 hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          class="h-4 w-4"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        {{ emergencyContact.phone }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="mt-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center"
              >
                <p class="text-xs text-gray-400">Chưa có thông tin liên hệ khẩn cấp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppointmentStore } from '@/stores/appointmentStore';
import Swal from 'sweetalert2';

const route = useRoute();
const appointmentStore = useAppointmentStore();
const appointment = ref(null);

// Hàm format ngày tháng (DD/MM/YYYY)
const formatDate = dateString => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Hàm tính tuổi
const calculateAge = dateString => {
  if (!dateString) return 0;
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

//getter avatar
const getAvatarUrl = avatar => {
  if (!avatar) return '/src/assets/images/avartar.jpg';
  if (avatar.startsWith('http')) return avatar;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${avatar}`;
};

const getGender = gender => {
  switch (gender) {
    case 'male': {
      return 'Nam';
    }
    case 'female': {
      return 'Nữ';
    }
    default: {
      return 'Khác';
    }
  }
};

const emergencyContact = computed(() => {
  return appointment.value?.patientId?.emergencyContact || {};
});

// Kiểm tra xem có dữ liệu hợp lệ không (có tên hoặc sđt)
const hasEmergencyInfo = computed(() => {
  const contact = emergencyContact.value;
  return (
    (contact.name && contact.name.trim() !== '') || (contact.phone && contact.phone.trim() !== '')
  );
});

// Hàm dịch trạng thái
const translateStatus = status => {
  const map = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    completed: 'Đã hoàn thành',
    cancelled: 'Đã hủy',
    rejected: 'Đã từ chối',
  };
  return map[status] || status;
};

// Hàm lấy màu sắc theo trạng thái
const getStatusClass = status => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'confirmed':
      return 'bg-blue-100 text-blue-700';
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const fetchAppointmentDetails = async () => {
  const appointmentId = route.params.id;
  try {
    const response = await appointmentStore.fetchAppointmentById(appointmentId);
    appointment.value = response;
    // Log để kiểm tra
    console.log('Appointment Details loaded:', appointment.value);
  } catch (error) {
    console.error('Error fetching appointment details:', error);
  }
};

async function approveAppointment(appointmentId) {
  const result = await Swal.fire({
    title: 'Xác nhận duyệt lịch?',
    text: 'Bạn có chắc chắn muốn duyệt lịch hẹn này không?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10B981',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Đồng ý duyệt',
    cancelButtonText: 'Hủy bỏ',
  });

  if (!result.isConfirmed) return;

  try {
    // Hiện loading trong lúc chờ API
    Swal.fire({
      title: 'Đang xử lý...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    await appointmentStore.updateAppointmentStatus(appointmentId, 'confirmed');
    await fetchAppointmentDetails();

    // Thông báo thành công
    Swal.fire({
      title: 'Thành công!',
      text: 'Đã duyệt lịch hẹn thành công.',
      icon: 'success',
      confirmButtonColor: '#10B981',
      timer: 2000,
    });
  } catch (error) {
    console.error('Lỗi khi duyệt lịch:', error);
    Swal.fire({
      title: 'Lỗi!',
      text: 'Có lỗi xảy ra, vui lòng thử lại.',
      icon: 'error',
    });
  }
}

async function rejectAppointment(appointmentId) {
  // 1. Hiển thị popup nhập lý do
  const result = await Swal.fire({
    title: 'Từ chối lịch hẹn',
    input: 'textarea',
    inputLabel: 'Lý do từ chối',
    inputPlaceholder: 'Nhập lý do tại đây...',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#F43F5E',
    inputValidator: value => {
      if (!value) return 'Vui lòng nhập lý do!';
    },
  });

  if (!result.isConfirmed) return;

  const reason = result.value; // Lấy lý do người dùng nhập

  try {
    await appointmentStore.updateAppointmentStatus(appointmentId, 'rejected', reason);

    // 3. Refresh lại giao diện
    await fetchAppointmentDetails();

    Swal.fire('Đã từ chối', 'Lịch hẹn đã được cập nhật.', 'success');
  } catch (error) {
    console.error(error);
    Swal.fire('Lỗi', 'Không thể hủy lịch hẹn.', 'error');
  }
}

onMounted(() => {
  fetchAppointmentDetails();
});
</script>
