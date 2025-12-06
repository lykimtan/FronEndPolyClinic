import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { userService } from '@/api/userService';

export const useAdminUserStore = defineStore('adminUser', () => {
  const users = ref([]);
  const isLoading = ref(false);
  const currentRole = ref(null); // null means 'all'
  const searchQuery = ref('');
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Getters
  const filteredUsers = computed(() => {
    let filtered = users.value;

    // Filter by role
    if (currentRole.value && currentRole.value !== 'all') {
      filtered = filtered.filter(user => user.role === currentRole.value);
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.email?.toLowerCase().includes(query) ||
          user.firstName?.toLowerCase().includes(query) ||
          user.lastName?.toLowerCase().includes(query) ||
          user.employeeId?.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  const getUsersByRole = role => {
    if (!role || role === 'all') {
      return users.value;
    }
    return users.value.filter(user => user.role === role);
  };

  // Actions
  const fetchUsers = async (filters = {}) => {
    try {
      isLoading.value = true;
      const params = {
        page: filters.page || pagination.value.page,
        limit: filters.limit || pagination.value.limit,
      };

      // Preserve role filter
      if (filters.role !== undefined) {
        params.role = filters.role;
      } else if (currentRole.value) {
        params.role = currentRole.value;
      }

      // Preserve search query
      if (filters.search !== undefined) {
        params.search = filters.search;
      } else if (searchQuery.value) {
        params.search = searchQuery.value;
      }

      const response = await userService.getAllUsers(params);

      // Backend returns data: { users }, not data as array
      users.value = response.data?.users || response.data || [];
      pagination.value = {
        page: params.page || 1,
        limit: params.limit || 10,
        total:
          response.pagination?.total ||
          response.data?.total ||
          response.total ||
          users.value.length,
      };

      console.log('Pagination updated:', pagination.value);
      console.log('Fetched params:', params);

      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const setCurrentRole = role => {
    currentRole.value = role === 'all' ? null : role;
  };

  const setSearchQuery = query => {
    searchQuery.value = query;
  };

  const toggleUserStatus = async userId => {
    try {
      isLoading.value = true;
      const user = users.value.find(u => u._id === userId);

      if (!user) {
        throw new Error('User not found');
      }

      let response;
      if (user.isActive) {
        // Disable user
        response = await userService.disableUser(userId);
      } else {
        // Enable user
        response = await userService.enableUser(userId);
      }

      // Update user in state
      const index = users.value.findIndex(u => u._id === userId);
      if (index !== -1) {
        users.value[index].isActive = !users.value[index].isActive;
      }

      return response;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      isLoading.value = true;
      const response = await userService.updateUser(userId, userData);

      // Update user in state
      const index = users.value.findIndex(u => u._id === userId);
      if (index !== -1) {
        users.value[index] = response.data;
      }

      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    users,
    isLoading,
    currentRole,
    searchQuery,
    pagination,
    filteredUsers,
    getUsersByRole,
    fetchUsers,
    setCurrentRole,
    setSearchQuery,
    toggleUserStatus,
    updateUser,
  };
});
