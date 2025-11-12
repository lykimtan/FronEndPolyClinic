<template>
  <div
    class="flex items-center rounded-xl p-2 shadow mb-4"
    :class="{
      'bg-[#c8beaa]': roleRequest.requestedRole === 'doctor',
      'bg-[#a8d5ba]': roleRequest.requestedRole === 'staff',
      'bg-[#a8c1e0]': roleRequest.requestedRole === 'admin',
    }"
  >
    <img
      :src="getAvatarUrl(roleRequest.userId.avatar)"
      alt="profile"
      class="rounded-4xl object-cover mr-10 w-30 h-30"
    />
    <div class="flex flex-col space-y-3 text-sm text-black">
      <p>
        <span class="font-semibold">Role requested:</span>
        {{ getRoleName(roleRequest.requestedRole) }}
      </p>
      <p><span class="font-semibold">Email:</span> {{ roleRequest.userId.email }}</p>
      <p><span class="font-semibold">Full Name:</span> {{ roleRequest.userId.fullName }}</p>
      <p>
        <span class="font-semibold">Created time:</span>
        {{ formatDate(roleRequest.createdAt) }}
      </p>
    </div>
    <!-- slot for actions (e.g., detail link, buttons) passed from parent -->
    <div class="ml-auto">
      <slot />
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';

defineProps({
  roleRequest: {
    type: Object,
    required: true,
  },
  // accept a function prop from parent to compute avatar URL
  getAvatarUrl: {
    type: Function,
    required: true,
  },
  // helper functions passed from parent (optional)

  formatDate: {
    type: Function,
    default: d => d,
  },
});

function getRoleName(role) {
  switch (role) {
    case 'doctor':
      return 'Bác sĩ';
    case 'staff':
      return 'Nhân viên y tế';
    case 'admin':
      return 'Quản trị viên';
    default:
      return role;
  }
}
</script>
