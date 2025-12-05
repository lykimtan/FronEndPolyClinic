<template>
  <aside
    class="bg-slate-900 w-64 p-5 hidden lg:flex flex-col border-r border-slate-800 shadow-[4px_0_24px_rgba(0,0,0,0.4)] z-10 relative"
  >
    <h2 class="text-xl font-bold text-center text-slate-100 uppercase tracking-wider">
      Admin Menu
    </h2>

    <img
      class="w-24 h-24 rounded-full object-cover mt-8 mx-auto border-4 border-slate-800 shadow-lg"
      :src="getAvatarUrl(currentUser?.avatar)"
      alt="User Avatar"
    />
    <h2 class="text-lg font-medium text-center mt-3 text-slate-300">
      {{ currentUser?.fullName || 'Admin' }}
    </h2>

    <div class="mt-8 space-y-3">
      <router-link to="/admin/user-management">
        <div
          class="group flex items-center gap-3 w-full py-3 px-4 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-transparent hover:bg-blue-600 cursor-pointer transition-all duration-200"
        >
          <i
            class="fa-solid fa-users-gear w-6 text-center group-hover:scale-110 transition-transform"
          ></i>
          <span>Quản lý người dùng</span>
        </div>
      </router-link>

      <div
        class="group flex items-center gap-3 w-full py-3 px-4 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-transparent hover:bg-red-600 cursor-pointer transition-all duration-200"
        @click="handleLogout"
      >
        <i
          class="fa-solid fa-arrow-right-from-bracket w-6 text-center group-hover:scale-110 transition-transform"
        ></i>
        <span>Đăng xuất</span>
      </div>
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
