<script setup>
import { ref, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'vue-sonner';
//import router

const router = useRouter();
const userStore = useUserStore();
const isDrawerOpen = ref(false);

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
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

const props = defineProps({
  userInfo: {
    type: Object,
    default: null,
  },
});

const getAvatarUrl = avatar => {
  if (!avatar) return '/src/assets/images/avartar.jpg';
  if (avatar.startsWith('http')) return avatar;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${avatar}`;
};
</script>

<template>
  <nav class="flex justify-between items-center bg-white shadow-sm py-3 px-8 sticky top-0 z-10">
    <!-- Logo -->
    <router-link to="/">
      <div class="flex items-center space-x-3">
        <img src="../assets/HealthCare.png" alt="HealthMate Logo" class="w-20 h-20" />
        <span class="text-xl font-semibold text-gray-800">HealthMate</span>
      </div>
    </router-link>

    <!-- Hamburger Menu Button  -->
    <button
      class="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition"
      aria-label="Toggle menu"
      @click="toggleDrawer"
    >
      <i class="fa-solid fa-bars"></i>
    </button>

    <!-- Navigation Buttons  -->
    <div class="hidden md:flex space-x-4">
      <button
        class="flex items-center bg-sky-500 text-white font-medium rounded-full px-5 py-2 hover:bg-sky-600 transition"
      >
        <i class="fa-solid fa-stethoscope mr-2"></i>
        Schedule Appointment
      </button>

      <button
        class="flex items-center bg-sky-500 text-white font-medium rounded-full px-5 py-2 hover:bg-sky-600 transition"
      >
        <i class="fa-regular fa-clock mr-2"></i>
        My Appointment
      </button>

      <button
        class="flex items-center bg-sky-500 text-white font-medium rounded-full px-5 py-2 hover:bg-sky-600 transition"
      >
        <i class="fa-solid fa-notes-medical mr-2"></i>
        Medical Record
      </button>
      <router-link to="/userProfile">
        <button
          class="flex items-center bg-sky-500 text-white font-medium rounded-full px-5 py-2 hover:bg-sky-600 transition"
        >
          <img
            :src="getAvatarUrl(userInfo?.avatar)"
            alt="User Avatar"
            class="w-12 h-12 rounded-full mr-2 object-cover object-center"
          />
          {{ props.userInfo?.fullName || props.userInfo?.firstName || 'My Account' }}
        </button>
      </router-link>
    </div>
  </nav>

  <!-- Overlay  -->
  <transition name="fade">
    <div
      v-if="isDrawerOpen"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
      @click="closeDrawer"
    ></div>
  </transition>

  <!-- Mobile Drawer -->
  <transition name="slide">
    <div
      v-if="isDrawerOpen"
      class="fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 md:hidden overflow-y-auto"
    >
      <!-- Drawer Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <div class="flex items-center space-x-2">
          <img src="../assets/HealthCare.png" alt="HealthMate Logo" class="w-12 h-12" />
          <span class="text-lg font-semibold text-gray-800">Menu</span>
        </div>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
          aria-label="Close menu"
          @click="closeDrawer"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Drawer Navigation Items -->
      <div class="flex flex-col p-4 space-y-3">
        <button
          class="flex items-center w-full bg-sky-500 text-white font-medium rounded-lg px-4 py-3 hover:bg-sky-600 text-left"
          @click="closeDrawer"
        >
          <i class="fa-solid fa-stethoscope mr-3"></i>
          Schedule Appointment
        </button>

        <button
          class="flex items-center w-full bg-sky-500 text-white font-medium rounded-lg px-4 py-3 hover:bg-sky-600 transition text-left"
          @click="closeDrawer"
        >
          <i class="fa-regular fa-clock mr-3"></i>
          My Appointment
        </button>

        <button
          class="flex items-center w-full bg-sky-500 text-white font-medium rounded-lg px-4 py-3 hover:bg-sky-600 transition text-left"
          @click="closeDrawer"
        >
          <i class="fa-solid fa-notes-medical mr-3"></i>
          Medical Record
        </button>
        <router-link to="/userProfile">
          <button
            class="flex items-center w-full bg-sky-500 text-white font-medium rounded-lg px-4 py-3 hover:bg-sky-600 transition text-left"
            @click="closeDrawer"
          >
            <img
              :src="getAvatarUrl(userInfo?.avatar)"
              alt="User Avatar"
              class="w-6 h-6 rounded-full mr-3 object-cover"
            />
            {{ props.userInfo?.fullName || props.userInfo?.firstName || 'My Account' }}
          </button>
        </router-link>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transition for drawer */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
