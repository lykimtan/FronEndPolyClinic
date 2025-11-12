import { defineStore } from 'pinia';
import { authService } from '@/api/authService';
import { userService } from '@/api/userService';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),

  actions: {
    setUser(userData) {
      this.user = userData;
      // lưu thông tin user vào localStorage để không bị mất khi reload trang
      localStorage.setItem('user', JSON.stringify(userData));
    },

    loadUser() {
      // Load user from localStorage on app init
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser);
        } catch (error) {
          console.error('Failed to parse saved user:', error);
          localStorage.removeItem('user');
        }
      }
    },

    async logout() {
      try {
        // Call backend to clear cookie
        await authService.logout();
      } catch (error) {
        console.error('Logout API error:', error);
        // Continue with local cleanup even if API fails
      }

      // Clear local state and storage
      this.user = null;
      localStorage.removeItem('user');
    },

    async fetchUserProfile() {
      try {
        const res = await userService.getUserProfile();
        // res is expected to be { success: true, data: { user } }
        if (res && res.data && res.data.user) {
          this.setUser(res.data.user);
          return res.data.user;
        }
        return null;
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        return null;
      }
    },
  },

  getters: {
    getUserInfo: state => state.user,
    isLoggedIn: state => !!state.user,
  },
});
