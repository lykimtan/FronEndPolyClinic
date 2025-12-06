<template>
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
      <div class="border-b pb-6">
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

      <!-- Record Timeline -->
      <div>
        <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <i class="fa-solid fa-clock text-indigo-500"></i>
          Lịch Sử Hồ Sơ
        </h3>
        <div class="space-y-3">
          <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <p class="text-gray-700 flex justify-between items-center">
              <span class="font-semibold">Ngày tạo:</span>
              <span class="text-indigo-600 font-medium">{{
                formatDateTime(medicalRecord.createdAt)
              }}</span>
            </p>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p class="text-gray-700 flex justify-between items-center">
              <span class="font-semibold">Cập nhật lần cuối:</span>
              <span class="text-blue-600 font-medium">{{
                formatDateTime(medicalRecord.updatedAt)
              }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  medicalRecord: {
    type: Object,
    required: true,
  },
});

const formatDate = dateString => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatDateTime = dateString => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const dateStr = date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const timeStr = date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${dateStr} ${timeStr}`;
};
</script>
