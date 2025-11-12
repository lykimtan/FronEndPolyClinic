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
    <div class="bg-gray-800 rounded-xl p-4 shadow-lg">Card 2</div>
    <div class="bg-gray-800 rounded-xl p-4 shadow-lg">Card 3</div>
    <div class="bg-gray-800 rounded-xl p-4 shadow-lg">Card 4</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoleRequestedStore } from '@/stores/RoleRequestedStore';
import { useUserStore } from '@/stores/userStore';

//import components
import RoleCard from '@/components/Admin/RoleCard.vue';

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
