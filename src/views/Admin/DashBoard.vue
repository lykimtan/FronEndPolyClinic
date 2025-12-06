<template>
  <!-- Cards Section (2x2 responsive) -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-gray-800 row-span-3 rounded-xl p-4 shadow-lg">
      <h2 class="text-center font-bold p-4">Yêu cầu cấp quyền</h2>
      <div class="container overflow-y-auto h-96">
        <RoleCard
          v-for="roleRequest in roleStore.roleRequests"
          :key="roleRequest.id"
          :role-request="roleRequest"
          :get-avatar-url="getAvatarUrl"
          :format-date="formatDate"
        >
          <RouterLink
            class="text-blue-400 hover:underline"
            :to="`/admin/role-request/${roleRequest._id}`"
          >
            Xem chi tiết
          </RouterLink>
        </RoleCard>
      </div>
    </div>
    <router-link
      to="/admin/user-management"
      class="group block bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700/50 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-750 hover:border-indigo-500/50 hover:shadow-indigo-500/20 hover:shadow-xl hover:-translate-y-1 active:scale-95"
    >
      <div class="flex flex-col items-center gap-3">
        <div
          class="p-3 rounded-full bg-gray-700/50 group-hover:bg-indigo-500 text-indigo-400 group-hover:text-white transition-colors duration-300"
        >
          <i class="fa-solid fa-users-gear text-xl"></i>
        </div>

        <div class="text-center">
          <h3 class="text-gray-100 font-semibold text-lg group-hover:text-white">
            Quản lý người dùng
          </h3>
          <p class="text-gray-400 text-xs mt-1 group-hover:text-gray-300">
            Xem và chỉnh sửa tài khoản
          </p>
        </div>
      </div>
    </router-link>
  </div>

  <!-- Appointment Statistics Section -->
  <div class="mt-8">
    <AdminAppointmentStatistics />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoleRequestedStore } from '@/stores/RoleRequestedStore';
import { useUserStore } from '@/stores/userStore';

//import components
import RoleCard from '@/components/Admin/RoleCard.vue';
import AdminAppointmentStatistics from '@/components/Admin/AdminAppointmentStatistics.vue';

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
