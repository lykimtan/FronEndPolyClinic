<template>
  <div class="flex flex-wrap gap-3 mb-6">
    <button
      v-for="role in roles"
      :key="role.value"
      class="px-6 py-2 rounded-lg font-semibold transition"
      :class="[
        'px-6 py-2 rounded-lg font-semibold transition',
        selectedRole === role.value || (selectedRole === null && role.value === 'all')
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
      ]"
      @click="$emit('change-role', role.value)"
    >
      <i :class="role.icon" class="mr-2"></i>
      {{ role.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  selectedRole: {
    type: String,
    default: null,
  },
});

defineEmits(['change-role']);

const roles = [
  {
    value: 'all',
    label: 'Tất Cả',
    icon: 'fa-solid fa-users',
  },
  {
    value: 'admin',
    label: 'Quản Trị Viên',
    icon: 'fa-solid fa-crown',
  },
  {
    value: 'doctor',
    label: 'Bác Sĩ',
    icon: 'fa-solid fa-stethoscope',
  },
  {
    value: 'staff',
    label: 'Nhân Viên',
    icon: 'fa-solid fa-headset',
  },
  {
    value: 'patient',
    label: 'Bệnh Nhân',
    icon: 'fa-solid fa-user-check',
  },
];
</script>
