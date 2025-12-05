<template>
  <div>
    <h1 class="text-2xl text-center p-5 font-bold">Thông tin tài khoản</h1>
    <div class="container flex-col items-center justify-center mx-auto p-5 flex">
      <div class="relative">
        <img
          :src="getAvatarUrl(userInfo?.avatar)"
          alt="User Avatar"
          class="w-90 h-90 rounded-full object-cover border-20 border-blue-500 shadow-lg"
        />
        <i
          v-if="userInfo?.role === 'admin'"
          class="fa-solid fa-user-tie absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-white rounded-full text-2xl shadow-lg"
        ></i>
        <i
          v-if="userInfo?.role === 'staff'"
          class="fa-solid fa-user-nurse absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-white rounded-full text-2xl shadow-lg"
        ></i>
        <i
          v-if="userInfo?.role === 'doctor'"
          class="fa-solid fa-stethoscope absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-white rounded-full text-2xl shadow-lg"
        ></i>
        <i
          v-if="userInfo?.role === 'patient'"
          class="fa-solid fa-bed-pulse absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-white rounded-full text-2xl shadow-lg"
        ></i>
      </div>
      <h2 class="text-2xl font-semibold mt-4">
        {{ userInfo?.fullName || userInfo?.firstName || 'User' }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div
          v-for="(item, index) in userStats"
          :key="index"
          class="bg-[#EAF3F6] p-6 rounded-xl shadow-sm text-center transform transition-all duration-700 ease-out opacity-0 translate-y-6 animate-fadeIn"
          :style="{ animationDelay: `${index * 0.25}s` }"
        >
          <i :class="item.icon" class="text-red-600 text-3xl mb-2"></i>
          <h3 class="text-red-600 text-4xl font-extrabold">{{ item.value }}</h3>
          <p class="text-gray-700 font-medium mt-2">{{ item.label }}</p>
        </div>
      </div>

      <div class="md:flex justify-around w-full mt-6 space-y-4 md:space-y-0 md:space-x-6 pt-5">
        <router-link to="/editProfile">
          <div class="text-center">
            <p class="font-bold bg-blue-500 text-white mt-4 p-2 rounded-lg md:w-80 p-4">
              Cập nhật thông tin tài khoản
            </p>
          </div>
        </router-link>
        <router-link to="/changePassword">
          <div class="text-center">
            <p class="font-bold mt-4 bg-black text-white p-2 rounded-lg md:w-80 p-4">
              Đổi mật khẩu
            </p>
          </div>
        </router-link>
        <button
          class="flex items-center bg-red-500 text-white font-medium rounded-full px-5 py-2 hover:bg-red-600 transition"
          @click="handleLogout"
        >
          <i class="fa-solid fa-right-from-bracket mr-2"></i>
          Logout
        </button>
      </div>
    </div>
  </div>
  <div class="p-10">
    <UserProfileRequestCard
      v-if="roleRequests && roleRequests.length"
      :role-requests="roleRequests"
      :get-role-name="getRoleName"
      :handle-delete="handleDelete"
      :get-status="getStatus"
    />
  </div>

  <div v-if="userInfo.role == 'patient'" class="relative">
    <div class="absolute right-5 top-5 flex gap-2 z-10">
      <button
        class="w-10 h-10 rounded-full bg-white shadow-lg hover:bg-gray-100 transition flex items-center justify-center"
        aria-label="Scroll left"
        @click="scrollLeft"
      >
        <i class="fa-solid fa-chevron-left text-gray-700"></i>
      </button>
      <button
        class="w-10 h-10 rounded-full bg-white shadow-lg hover:bg-gray-100 transition flex items-center justify-center"
        aria-label="Scroll right"
        @click="scrollRight"
      >
        <i class="fa-solid fa-chevron-right text-gray-700"></i>
      </button>
    </div>
    <h2 class="pl-5 pt-5 font-bold text-xl">Lịch sử khám bệnh</h2>
    <div
      ref="scrollContainer"
      class="flex flex-nowrap p-5 bg-gray-100 snap-x gap-4 overflow-x-auto scroll-smooth"
    >
      <!-- Loading state -->
      <div
        v-if="medicalRecordStore.getIsLoading"
        class="flex items-center justify-center w-full py-8"
      >
        <div class="text-center">
          <i class="fa-solid fa-spinner animate-spin text-3xl text-blue-500 mb-3"></i>
          <p class="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="!medicalRecords || medicalRecords.length === 0"
        class="w-full flex items-center justify-center py-8"
      >
        <p class="text-gray-600">Chưa có bản ghi y khoa nào</p>
      </div>

      <!-- Medical records list -->
      <div
        v-for="(record, index) in medicalRecords"
        :key="record._id || index"
        :style="{ animationDelay: `${index * 0.1}s` }"
        class="relative group flex-shrink-0 text-center snap-center w-80 h-60 bg-white rounded-lg shadow-md p-4 cursor-pointer transform transition-all duration-700 ease-out opacity-0 translate-x-6 animate-fadeInLeft hover:shadow-lg hover:scale-105"
        @click="goToDetailRecord(record._id)"
      >
        <!-- Record info -->
        <div
          class="h-full flex flex-col justify-between bg-[url('src/assets/images/medicalRecord.png')] bg-cover bg-center rounded-lg p-4"
        >
          <div>
            <h3 class="font-bold text-lg mb-2 text-blue-600">Lần khám thứ {{ index + 1 }}</h3>
            <p class="text-gray-700 text-sm mb-2">
              <span class="font-bold">Bác sĩ:</span>
              {{ record.doctorId?.firstName }} {{ record.doctorId?.lastName }}
            </p>
            <p class="text-gray-700 text-sm mb-2 font-bold">
              <span class="font-bold">Chuyên khoa:</span>
              {{ record.appointmentId?.specializationId?.name || 'N/A' }}
            </p>
            <p class="text-gray-600 text-xs mb-2">
              <span class="font-semibold">Ngày:</span>
              {{ formatDate(record.appointmentId?.appointmentDate) }}
            </p>
          </div>
          <div class="mt-2 pt-3 border-t border-gray-300">
            <p class="text-gray-600 text-sm truncate">
              {{ record.diagnosis || 'Chưa có chẩn đoán' }}
            </p>
            <div
              class="mt-2 text-blue-500 font-medium text-sm flex items-center justify-center gap-1"
            >
              <span>Xem chi tiết</span>
              <i class="fa-solid fa-arrow-right text-xs"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import UserProfileRequestCard from '@/components/UserProfileRequestCard.vue';
import { useUserStore } from '@/stores/userStore';
import { useRoleRequestedStore } from '@/stores/RoleRequestedStore';
import { useMedicalRecordStore } from '@/stores/MedicalRecordStore';
import router from '@/router';
import { toast } from 'vue-sonner';

const userStore = useUserStore();
const roleStore = useRoleRequestedStore();
const medicalRecordStore = useMedicalRecordStore();
// Use computed to reactively get user info
const userInfo = computed(() => userStore.getUserInfo);

onMounted(async () => {
  await roleStore.getMyRequests(); // gọi API và lưu vào state
  console.log('Fetched role requests in UserProfile:', roleStore.roleRequests);

  // Fetch medical record count
  if (userInfo.value?.id) {
    await medicalRecordStore.fetchRecordCountByPatient(userInfo.value.id);
    // Fetch all medical records for the patient
    await medicalRecordStore.fetchRecordsByPatient(userInfo.value.id);
  }
});
const roleRequests = computed(() => roleStore.roleRequests);

console.log('User Info in UserProfile:', userInfo.value);

// watch logged status
watch(
  userInfo,
  newValue => {
    if (!newValue || !newValue.id) {
      router.push('/login');
    }
  },
  { immediate: true } // Run immediately on component mount
);

// Helper to get full avatar URL
const getAvatarUrl = avatar => {
  if (!avatar) return '/src/assets/images/avartar.jpg';
  if (avatar.startsWith('http') || avatar.startsWith('https')) return avatar;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${avatar}`;
};

const formatDate = dateStr => {
  if (!dateStr) return 'Chưa cập nhật';
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Get medical records list from store
const medicalRecords = computed(() => medicalRecordStore.getRecordsList);

// Navigate to medical record detail page
const goToDetailRecord = recordId => {
  router.push({ name: 'MyDetailMedicalRecord', params: { id: recordId } });
};

// Use computed for reactive userStats
const userStats = computed(() => [
  { icon: 'fa-solid fa-envelope', value: 'Email', label: userInfo.value?.email || 'Chưa cập nhật' },
  { icon: 'fa-solid fa-phone', value: 'Phone', label: userInfo.value?.phone || 'Chưa cập nhật' },
  {
    icon: 'fa-solid fa-calendar',
    value: 'Năm sinh',
    label: formatDate(userInfo.value?.dateOfBirth),
  },
  {
    icon: 'fa-solid fa-notes-medical',
    value: 'Bản ghi y khoa',
    label: medicalRecordStore.getRecordCount,
  },
  {
    icon: 'fa-solid fa-house',
    value: 'Địa chỉ',
    label: userInfo.value?.address || 'Chưa cập nhật',
  },
  {
    icon: 'fa-solid fa-stethoscope',
    value: 'Lần khám gần nhất',
    label:
      medicalRecords.value.length > 0 && medicalRecords.value[0].appointmentId?.appointmentDate
        ? formatDate(medicalRecords.value[0].appointmentId?.appointmentDate)
        : 'Chưa có',
  },
]);
console.log('User Info in UserProfile:', userInfo.value);

const scrollContainer = ref(null);
const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: -300,
      behavior: 'smooth',
    });
  }
};

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({
      left: 300,
      behavior: 'smooth',
    });
  }
};

const handleLogout = async () => {
  try {
    await userStore.logout();
    toast.success('Đăng xuất thành công!');
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Đăng xuất thất bại, vui lòng thử lại');
  }
};

// Delete handler for user's own role request
const handleDelete = async id => {
  if (!confirm('Bạn có chắc muốn xóa yêu cầu này?')) return;
  try {
    await roleStore.deleteRequest(id);
    toast.success('Đã xóa yêu cầu thành công');
    // Refresh the list after deletion
    await roleStore.getMyRequests();
  } catch (error) {
    console.error('Delete request error:', error);
    toast.error('Xóa yêu cầu thất bại. Vui lòng thử lại');
  }
};
function getStatus(status) {
  switch (status) {
    case 'pending':
      return 'Đang chờ duyệt';
    case 'approved':
      return 'Đã được phê duyệt';
    case 'rejected':
      return 'Đã bị từ chối';
    default:
      return 'Không xác định';
  }
}

function getRoleName(role) {
  switch (role) {
    case 'admin':
      return 'Quản trị viên';
    case 'staff':
      return 'Nhân viên';
    case 'doctor':
      return 'Bác sĩ';
    case 'patient':
      return 'Bệnh nhân';
    default:
      return 'Chưa xác định';
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(24px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translateX(-24px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fadeInLeft {
  animation: fadeInLeft 0.8s ease-out forwards;
}
</style>
