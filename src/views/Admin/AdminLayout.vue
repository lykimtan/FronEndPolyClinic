<template>
  <div class="min-h-screen text-gray-300 flex bg-gray-700">
    <!-- Sidebar -->
    <SideBar :current-user="userStore.getUserInfo" :get-avatar-url="getAvatarUrl" />

    <!-- Main Content -->
    <main class="flex-1 p-6 grid grid-rows-[250px_1fr] gap-6">
      <!-- Header Section -->
      <HeaderAdmin />

      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoleRequestedStore } from '@/stores/RoleRequestedStore';
import { useUserStore } from '@/stores/userStore';

//import components
import SideBar from '@/components/Admin/SideBar.vue';
import HeaderAdmin from '@/components/Admin/HeaderAdmin.vue';

const userStore = useUserStore();

// Gọi store
const roleStore = useRoleRequestedStore();

onMounted(async () => {
  await roleStore.fetchRoleRequests();
  // load current logged-in user's profile into the store
  await userStore.fetchUserProfile();
  console.log(
    'Fetched role requests:',
    roleStore.roleRequests,
    'current user:',
    userStore.getUserInfo
  );
});

const getAvatarUrl = avatar => {
  if (!avatar) return '/src/assets/images/avartar.jpg';
  if (avatar.startsWith('http')) return avatar;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${avatar}`;
};

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
</script>
