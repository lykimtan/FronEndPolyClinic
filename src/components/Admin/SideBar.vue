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
  </aside>
</template>

<script setup>
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
</script>
