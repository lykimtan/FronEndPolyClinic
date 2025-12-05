<template>
  <div class="min-h-screen bg-gray-700 from-blue-50 to-indigo-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Quản Lý Người Dùng</h1>
        <p class="text-gray-300">Quản lý tài khoản người dùng và phân quyền hệ thống</p>
      </div>

      <!-- Role Tabs -->
      <RoleTab :selected-role="currentRole" @change-role="handleChangeRole" />

      <!-- Search Bar -->
      <SearchBar :search-query="searchQuery" @search="handleSearch" />

      <!-- User Table -->
      <div class="relative">
        <UserTable
          :users="filteredUsers"
          :is-loading="isLoading"
          @toggle-status="handleToggleStatus"
        />
      </div>

      <!-- Pagination (optional) -->
      <div
        v-if="pagination.total > pagination.limit"
        class="mt-8 flex justify-between items-center"
      >
        <p class="text-gray-600">
          Tổng: <span class="font-bold">{{ pagination.total }}</span> người dùng
        </p>
        <div class="flex gap-3">
          <button
            v-if="pagination.page > 1"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            @click="previousPage"
          >
            <i class="fa-solid fa-chevron-left mr-2"></i>Trang Trước
          </button>
          <button
            v-if="pagination.page * pagination.limit < pagination.total"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            @click="nextPage"
          >
            Trang Sau<i class="fa-solid fa-chevron-right ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAdminUserStore } from '@/stores/AdminUserStore';
import Swal from 'sweetalert2';
import RoleTab from '@/components/Admin/RoleTab.vue';
import SearchBar from '@/components/Admin/SearchBar.vue';
import UserTable from '@/components/Admin/UserTable.vue';

const userStore = useAdminUserStore();

// Use storeToRefs for reactive state
const { isLoading, pagination, filteredUsers, currentRole, searchQuery } = storeToRefs(userStore);

// Destructure actions
const { fetchUsers, setCurrentRole, setSearchQuery, toggleUserStatus } = userStore;

// Methods
const handleChangeRole = async role => {
  setCurrentRole(role);
  await fetchUsers({ role: role === 'all' ? undefined : role });
};

const handleSearch = query => {
  setSearchQuery(query);
};

const handleToggleStatus = async userId => {
  try {
    await toggleUserStatus(userId);
    await Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: 'Cập nhật trạng thái tài khoản thành công',
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: error?.message || 'Lỗi cập nhật trạng thái tài khoản',
    });
  }
};

const previousPage = async () => {
  const newPage = Math.max(1, pagination.page - 1);
  await fetchUsers({ page: newPage });
};

const nextPage = async () => {
  const maxPage = Math.ceil(pagination.total / pagination.limit);
  const newPage = Math.min(maxPage, pagination.page + 1);
  await fetchUsers({ page: newPage });
};

// Fetch users on mount
onMounted(async () => {
  try {
    await fetchUsers();
  } catch (error) {
    console.error('Error loading users:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: 'Lỗi tải danh sách người dùng',
    });
  }
});
</script>
