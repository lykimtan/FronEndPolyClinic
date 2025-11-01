<template>
  <HeaderPart />
  <NavBar :user-info="userInfo" />
  <div>
    <h1 class="text-2xl text-center p-5 font-bold">Thông tin tài khoản</h1>
    <div class="container flex-col items-center justify-center mx-auto p-5 flex">
      <img
        :src="getAvatarUrl(userInfo?.avatar)"
        alt="User Avatar"
        class="w-90 h-90 rounded-full object-cover"
      />
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

  <div class="relative">
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
      <!-- Example history items -->
      <div
        v-for="n in 5"
        :key="n"
        :style="{ animationDelay: `${n * 0.5}s` }"
        class="relative group flex-shrink-0 text-center snap-center w-80 h-60 bg-white rounded-lg shadow-md p-4 bg-[url('../assets/images/medicalRecord.png')] bg-cover bg-center transform transition-all duration-700 ease-out opacity-0 translate-x-6 animate-fadeInLeft"
      >
        <h3 class="font-bold text-lg mb-2">Lịch sử khám bệnh {{ n }}</h3>
        <p class="text-gray-600">Chi tiết về lần khám bệnh thứ {{ n }} sẽ hiển thị ở đây.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import HeaderPart from '@/components/HeaderPart.vue';
import NavBar from '@/components/NavBar.vue';
import { useUserStore } from '@/stores/userStore';
import router from '@/router';
import { toast } from 'vue-sonner';

const userStore = useUserStore();
// Use computed to reactively get user info
const userInfo = computed(() => userStore.getUserInfo);
console.log('User Info in UserProfile:', userInfo.value);

// watch logged status
watch(
  userInfo,
  newValue => {
    if (!newValue || !newValue.id) {
      console.warn('User not authenticated, redirecting to login...');
      router.push('/login');
    }
  },
  { immediate: true } // Run immediately on component mount
);

// Helper to get full avatar URL
const getAvatarUrl = avatar => {
  if (!avatar) return '/src/assets/images/avartar.jpg';
  if (avatar.startsWith('http')) return avatar;
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
    label: '0',
  },
  { icon: 'fa-solid fa-comment', value: 'Lượt Feedback', label: 10 },
  {
    icon: 'fa-solid fa-award',
    value: 'Lần khám gần nhất',
    label: '10/01/2025',
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
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Đăng xuất thất bại, vui lòng thử lại');
  }
};
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
