<template>
  <h2 class="pl-5 p-5 font-bold text-xl">Yêu cầu cấp quyền đã gửi</h2>
  <!-- Debug: show raw data to help diagnose rendering issues -->

  <div
    v-for="req in roleRequests"
    :key="req._id"
    class="relative group flex-shrink-0 text-center snap-center w-80 h-60 bg-white rounded-lg shadow-md p-4 bg-cover bg-center transform transition-all"
  >
    <h3 class="font-bold text-lg mb-2">
      Yêu cầu cấp quyền: <span class="text-blue-700">{{ getRoleName(req.requestedRole) }}</span>
    </h3>
    <p class="text-gray-600">
      Trạng thái: <b class="text-blue-300">{{ getStatus(req.status) }}</b>
    </p>
    <p v-if="req.status !== 'pending'" class="text-gray-600">
      Ngày duyệt:
      <b class="text-blue-300">{{ new Date(req.updatedAt).toLocaleDateString('vi-VN') }}</b>
    </p>
    <p v-if="req.status == 'rejected'" class="text-gray-600">
      Lí do bị từ chối:
      <b class="text-red-300">{{ req.note }}</b>
    </p>

    <p class="text-gray-600">Ngày tạo: {{ new Date(req.createdAt).toLocaleDateString('vi-VN') }}</p>
    <div class="mt-4 flex justify-center gap-2">
      <button
        class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        @click="handleDelete(req._id)"
      >
        Xóa
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  getRoleName: {
    type: Function,
    required: true,
  },
  getStatus: {
    type: Function,
    required: true,
  },
  handleDelete: {
    type: Function,
    required: true,
  },
  roleRequests: {
    type: Array,
    required: true,
  },
});

console.log('UserProfileRequestCard roleRequests:', props.roleRequests);
onMounted(() => {
  console.log('UserProfileRequestCard mounted with roleRequests:', props.roleRequests);
});
</script>
