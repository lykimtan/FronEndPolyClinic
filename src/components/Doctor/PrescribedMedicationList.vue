<template>
  <div>
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
          @click="$emit('print')"
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
          <div class="mb-4 flex items-center justify-between">
            <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Đơn #{{ index + 1 }}
            </span>
            <button
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
              @click="$emit('edit-prescription', med._id)"
            >
              <i class="fa-solid fa-edit"></i>
              Cập nhật
            </button>
          </div>

          <!-- Drugs List -->
          <div class="mb-6">
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
                      @click="$emit('drug-click', drug.drugId)"
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
        <p class="text-amber-800 flex items-center justify-center gap-2 mb-4">
          <i class="fa-solid fa-info-circle"></i>
          Chưa có đơn thuốc cho hồ sơ y tế này
        </p>
        <button
          class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
          @click="$emit('create-prescription')"
        >
          <i class="fa-solid fa-plus"></i>
          Tạo Đơn Thuốc
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  prescribedMedications: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['print', 'drug-click', 'create-prescription', 'edit-prescription']);
</script>
