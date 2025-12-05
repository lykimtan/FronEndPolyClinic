<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- Table Header -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <th class="px-6 py-4 text-left font-semibold">Tên</th>
            <th class="px-6 py-4 text-left font-semibold">Email</th>
            <th class="px-6 py-4 text-left font-semibold">Vai Trò</th>
            <th class="px-6 py-4 text-left font-semibold">Mã Số</th>
            <th class="px-6 py-4 text-center font-semibold">Trạng Thái</th>
            <th class="px-6 py-4 text-center font-semibold">Hành Động</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50 transition">
            <!-- Avatar + Name -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <img
                  :src="getAvatarUrl(user.avatar)"
                  :alt="user.fullName"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p class="font-semibold text-gray-800">
                    {{ user.fullName }}
                  </p>
                  <p class="text-sm text-gray-500">ID: {{ user._id.substring(0, 8) }}</p>
                </div>
              </div>
            </td>

            <!-- Email -->
            <td class="px-6 py-4">
              <p class="text-gray-700">{{ user.email }}</p>
            </td>

            <!-- Role -->
            <td class="px-6 py-4">
              <span
                :class="getRoleColor(user.role)"
                class="px-3 py-1 rounded-full text-sm font-semibold"
              >
                {{ getRoleLabel(user.role) }}
              </span>
            </td>

            <!-- Employee ID -->
            <td class="px-6 py-4">
              <p class="text-gray-700">{{ user.employeeId || '-' }}</p>
            </td>

            <!-- Status -->
            <td class="px-6 py-4 text-center">
              <span
                :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-3 py-1 rounded-full text-sm font-semibold"
              >
                {{ user.isActive ? 'Hoạt Động' : 'Vô Hiệu' }}
              </span>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 text-center">
              <button
                :disabled="isLoading"
                :class="[
                  'px-4 py-2 rounded-lg font-semibold transition',
                  user.isActive
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white',
                  isLoading && 'opacity-50 cursor-not-allowed',
                ]"
                @click="handleToggleStatus(user)"
              >
                <i
                  :class="user.isActive ? 'fa-solid fa-ban' : 'fa-solid fa-check'"
                  class="mr-2"
                ></i>
                {{ user.isActive ? 'Vô Hiệu' : 'Kích Hoạt' }}
              </button>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="users.length === 0">
            <td colspan="6" class="px-6 py-12 text-center">
              <i class="fa-solid fa-inbox text-4xl text-gray-300 mb-4"></i>
              <p class="text-gray-500 text-lg">Không tìm thấy người dùng nào</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg"
    >
      <div class="text-center">
        <i class="fa-solid fa-spinner animate-spin text-4xl text-blue-600 mb-3"></i>
        <p class="text-gray-700">Đang tải...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2';

defineProps({
  users: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['toggle-status']);

const getRoleLabel = role => {
  const roles = {
    admin: 'Quản Trị Viên',
    doctor: 'Bác Sĩ',
    staff: 'Nhân Viên',
    patient: 'Bệnh Nhân',
  };
  return roles[role] || role;
};

const getRoleColor = role => {
  const colors = {
    admin: 'bg-purple-100 text-purple-800',
    doctor: 'bg-blue-100 text-blue-800',
    staff: 'bg-yellow-100 text-yellow-800',
    patient: 'bg-green-100 text-green-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

const getAvatarUrl = avatar => {
  if (!avatar) return '/src/assets/images/avartar.jpg';
  if (avatar.startsWith('http')) return avatar;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${avatar}`;
};

const handleToggleStatus = async user => {
  const action = user.isActive ? 'vô hiệu hóa' : 'kích hoạt';
  const confirmText = user.isActive ? 'Vô Hiệu Hóa' : 'Kích Hoạt';

  const result = await Swal.fire({
    title: `${confirmText} Tài Khoản?`,
    text: `Bạn có chắc chắn muốn ${action} tài khoản của ${user.firstName} ${user.lastName}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: user.isActive ? '#ef4444' : '#22c55e',
    cancelButtonColor: '#6b7280',
    confirmButtonText: confirmText,
    cancelButtonText: 'Hủy',
  });

  if (result.isConfirmed) {
    emit('toggle-status', user._id);
  }
};
</script>
