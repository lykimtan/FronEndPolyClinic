<template>
  <aside class="bg-gray-700 w-64 p-4 hidden lg:block">
    <!-- Sidebar content -->
    <h2 class="text-xl font-semibold text-center">Admin Menu</h2>
    <img
      class="w-30 h-30 rounded-full object-cover mt-10 mx-auto"
      :src="getAvatarUrl(currentUser?.avatar)"
      alt="User Avatar"
    />
    <h2 class="text-xl font-semibold text-center">{{ currentUser?.fullName || 'Admin' }}</h2>
    <div
      class="mt-6 flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-sm font-medium text-white bg-red-500 cursor-pointer hover:bg-red-600 hover:shadow-md hover:shadow-red-600/30 active:scale-95 transition-all duration-150 select-none"
    >
      <i class="fa-solid fa-arrow-right-from-bracket"></i>
      <span>Đăng xuất</span>
    </div>
    <div
      class="mt-6 flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-sm font-medium text-white bg-red-500 cursor-pointer hover:bg-red-600 hover:shadow-md hover:shadow-red-600/30 active:scale-95 transition-all duration-150 select-none"
      @click="handleLogout"
    >
      <i class="fa-solid fa-arrow-right-from-bracket"></i>
      <span>Đăng xuất</span>
    </div>
  </aside>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
defineProps({
  currentUser: {
    type: Object,
    required: false,
    default: null,
  },
  getAvatarUrl: {
    type: Function,
    required: true,
  },
});

const handleLogout = async () => {
  try {
    await userStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
</script>
