import { defineStore } from 'pinia';
import { authService } from '@/api/authService';

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
  },

  getters: {
    getUserInfo: state => state.user,
    isLoggedIn: state => !!state.user,
  },
});
