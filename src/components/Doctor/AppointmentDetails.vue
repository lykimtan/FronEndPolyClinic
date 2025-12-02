<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Thông tin cuộc hẹn</h3>

    <div class="space-y-4">
      <div>
        <p class="text-xs text-gray-500 font-medium uppercase mb-1">Chuyên khoa</p>
        <p class="text-base font-semibold text-gray-800">
          {{ appointment?.specializationId?.name }}
        </p>
      </div>

      <div>
        <p class="text-xs text-gray-500 font-medium uppercase mb-1">Ngày khám</p>
        <p class="text-base font-semibold text-gray-800">
          {{ formatDate(appointment?.appointmentDate) }}
        </p>
      </div>

      <div>
        <p class="text-xs text-gray-500 font-medium uppercase mb-1">Khung giờ</p>
        <p class="text-base font-semibold text-gray-800">
          {{ appointment?.slotId?.time || 'N/A' }}
        </p>
      </div>

      <div>
        <p class="text-xs text-gray-500 font-medium uppercase mb-1">Lý do khám</p>
        <p class="text-sm text-gray-700">
          {{ appointment?.reason || 'Không có' }}
        </p>
      </div>

      <div>
        <p class="text-xs text-gray-500 font-medium uppercase mb-1">Ghi chú</p>
        <p class="text-sm text-gray-700 italic">
          {{ appointment?.notes || 'Không có ghi chú' }}
        </p>
      </div>

      <!-- Status Badge -->
      <div class="pt-4 border-t border-gray-100">
        <span
          class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
          :class="getStatusClass(appointment?.status)"
        >
          <span class="mr-2 h-2 w-2 rounded-full bg-current"></span>
          {{ translateStatus(appointment?.status) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  appointment: {
    type: Object,
    required: true,
  },
});

const formatDate = dateString => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const translateStatus = status => {
  const map = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    completed: 'Đã hoàn thành',
    cancelled: 'Đã hủy',
  };
  return map[status] || status;
};

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
</script>
