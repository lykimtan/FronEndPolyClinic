<template>
  <div>
    <h1 class="text-3xl font-bold mb-4 text-center text-gray-700">Chi tiết yêu cầu cấp quyền</h1>

    <div v-if="request" class="grid md:grid-cols-2 gap-6">
      <!-- Cột trái: thông tin người dùng -->
      <div class="space-y-4 bg-blue-200 text-gray-800 p-6 rounded-lg">
        <h2 class="text-xl font-semibold">Thông tin người gửi</h2>
        <div class="bg-gray-200 p-4 rounded-lg space-y-2">
          <p>
            <span class="font-semibold">Họ tên:</span>
            {{ request.userId.fullName }}
          </p>
          <p><span class="font-semibold">Email:</span> {{ request.userId.email }}</p>
          <p><span class="font-semibold">Vai trò hiện tại:</span> {{ request.userId.role }}</p>
          <p><span class="font-semibold">Số giấy phép:</span> {{ request.licenseNumber }}</p>
          <p>
            <span class="font-semibold">Trạng thái: </span>
            <span
              :class="{
                'text-yellow-500': request.status === 'pending',
                'text-green-400': request.status === 'approved',
                'text-red-400': request.status === 'rejected',
              }"
            >
              {{ getStatus(request.status) }}
            </span>
          </p>
          <p><span class="font-semibold">Ngày tạo:</span> {{ formatDate(request.createdAt) }}</p>
        </div>
        <button
          class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 shadow-md mr-2"
          @click="handleApprove(request._id)"
        >
          Duyệt yêu cầu
        </button>
        <button
          class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 shadow-md"
          @click="showInputReason = true"
        >
          Từ chối yêu cầu
        </button>
        <!-- Input lý do từ chối -->
        <div v-if="showInputReason" class="mt-4">
          <textarea
            v-model="request.rejectionReason"
            placeholder="Nhập lý do từ chối..."
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            rows="4"
          ></textarea>
          <button
            class="mt-2 px-5 py-2 bg-red-600 hover:bg-red -700 text-white font-semibold rounded-lg transition duration-200 shadow-md"
            @click="handleReject(request._id, request.rejectionReason)"
          >
            Gửi lý do từ chối
          </button>
        </div>
      </div>

      <!-- Cột phải: tài liệu chứng minh -->
      <div>
        <h2 class="text-xl font-semibold mb-3">Tài liệu chứng minh</h2>
        <img
          :src="getProofUrl(request.documentProof)"
          alt="Document Proof"
          class="rounded-lg w-full max-h-[400px] object-contain border border-gray-600 cursor-pointer"
          @click="showProofModal = true"
        />

        <!-- Modal: full-size preview -->
        <div
          v-if="showProofModal"
          class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          @click.self="showProofModal = false"
        >
          <div class="relative max-w-[90%] max-h-[90%]">
            <button
              class="absolute top-2 right-2 bg-white/80 rounded-full p-2 text-gray-800 z-60"
              @click="showProofModal = false"
            >
              ✕
            </button>
            <img
              :src="getProofUrl(request.documentProof)"
              alt="Document Proof Large"
              class="rounded-lg max-h-[90vh] object-contain shadow-lg bg-white"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-400">
      <p>Đang tải dữ liệu...</p>
    </div>
  </div>
  <Toaster position="top-right" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { toast, Toaster } from 'vue-sonner';
import { useRoleRequestedStore } from '@/stores/RoleRequestedStore';
import { useUserStore } from '@/stores/userStore';
//import api

// Components

import router from '@/router';

const request = ref(null);
const route = useRoute();
const roleStore = useRoleRequestedStore();
const userStore = useUserStore();
const showProofModal = ref(false);
const showInputReason = ref(false);

// ✅ Hàm xử lý URL tài liệu
const getProofUrl = proof => {
  if (!proof) return '/src/assets/images/no-proof.png';
  if (proof.startsWith('http')) return proof;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${proof}`;
};

// ✅ Hàm định dạng ngày
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getStatus(status) {
  switch (status) {
    case 'pending':
      return 'Đang chờ duyệt';
    case 'approved':
      return 'Đã duyệt';
    case 'rejected':
      return 'Đã từ chối';
    default:
      return 'Không xác định';
  }
}

const handleApprove = async id => {
  try {
    await roleStore.approveRequest(id);
    toast.success('Yêu cầu đã được duyệt thành công!');
    //chuyen ve dashboard
    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 1500);
  } catch (error) {
    toast.error('Đã xảy ra lỗi khi duyệt yêu cầu.');
    console.error('Error approving role request:', error);
  }
};

const handleReject = async (id, reason) => {
  if (!reason || reason.trim() === '') {
    toast.error('Vui lòng nhập lý do từ chối trước khi gửi.');
    return;
  }
  try {
    await roleStore.rejectRequest(id, reason);
    toast.success('Yêu cầu đã được từ chối thành công!');
    //chuyen ve dashboard
    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 1500);
  } catch (error) {
    toast.error('Đã xảy ra lỗi khi từ chối yêu cầu.');
    console.error('Error rejecting role request:', error);
  }
};

onMounted(async () => {
  const id = route.params.id;
  console.log('🆔 Role Request ID:', id);

  // Lấy thông tin user hiện tại
  await userStore.fetchUserProfile();

  // Lấy yêu cầu trong store
  let roleRequest = roleStore.getRequestById(id);

  // Nếu store chưa có dữ liệu thì fetch lại
  if (!roleRequest) {
    await roleStore.fetchRoleRequests();
    roleRequest = roleStore.getRequestById(id);
  }

  // ✅ Gán giá trị vào ref để hiển thị
  request.value = roleRequest;

  console.log('📄 Fetched role request detail:', request.value);
});
</script>
