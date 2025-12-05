import { defineStore } from 'pinia';
import NotificationService from '@/api/notificationService.js';

export const useNotificationStore = defineStore('notificationStore', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
  }),

  getters: {
    allNotifications: state => state.notifications,
    getUnreadCount: state => state.unreadCount,
    getIsLoading: state => state.isLoading,
    getError: state => state.error,
    unreadNotifications: state => state.notifications.filter(n => !n.isRead),
  },

  actions: {
    async fetchNotifications(userId, page = 1, limit = 10) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await NotificationService.getNotifications(userId, page, limit);
        this.notifications = response.data || [];
        this.currentPage = 1;
        this.totalPages = response.pagination?.total
          ? Math.ceil(response.pagination.total / limit)
          : 1;
        return response;
      } catch (err) {
        this.error = 'Không thể tải thông báo: ' + err.message;
        this.notifications = [];
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUnreadNotifications(userId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await NotificationService.getNotifications(userId, 1, 100, false);
        this.notifications = response.data || [];
        return response;
      } catch (err) {
        this.error = 'Không thể tải thông báo chưa đọc: ' + err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchUnreadCount(userId) {
      try {
        const response = await NotificationService.getUnreadCount(userId);
        this.unreadCount = response.unreadCount || 0;
        return this.unreadCount;
      } catch (err) {
        this.error = 'Không thể tải số thông báo chưa đọc: ' + err.message;
        throw err;
      }
    },

    async markAsRead(notificationId) {
      try {
        await NotificationService.markAsRead(notificationId);

        // Update local state
        const notification = this.notifications.find(n => n._id === notificationId);
        if (notification) {
          notification.isRead = true;
        }

        // Decrease unread count
        if (this.unreadCount > 0) {
          this.unreadCount--;
        }
      } catch (err) {
        this.error = 'Không thể đánh dấu thông báo đã đọc: ' + err.message;
        throw err;
      }
    },

    async markMultipleAsRead(notificationIds) {
      try {
        await NotificationService.markMultipleAsRead(notificationIds);

        // Update local state
        this.notifications.forEach(n => {
          if (notificationIds.includes(n._id)) {
            n.isRead = true;
          }
        });

        // Update unread count
        this.unreadCount = this.notifications.filter(n => !n.isRead).length;
      } catch (err) {
        this.error = 'Không thể đánh dấu các thông báo đã đọc: ' + err.message;
        throw err;
      }
    },

    async markAllAsRead(userId) {
      try {
        await NotificationService.markAllAsRead(userId);

        // Update local state
        this.notifications.forEach(n => {
          n.isRead = true;
        });

        this.unreadCount = 0;
      } catch (err) {
        this.error = 'Không thể đánh dấu tất cả thông báo đã đọc: ' + err.message;
        throw err;
      }
    },

    async deleteNotification(notificationId) {
      try {
        await NotificationService.deleteNotification(notificationId);

        // Update local state
        this.notifications = this.notifications.filter(n => n._id !== notificationId);
      } catch (err) {
        this.error = 'Không thể xóa thông báo: ' + err.message;
        throw err;
      }
    },

    async deleteMultipleNotifications(notificationIds) {
      try {
        await NotificationService.deleteMultipleNotifications(notificationIds);

        // Update local state
        this.notifications = this.notifications.filter(n => !notificationIds.includes(n._id));
      } catch (err) {
        this.error = 'Không thể xóa các thông báo: ' + err.message;
        throw err;
      }
    },

    async deleteAllNotifications(userId) {
      try {
        await NotificationService.deleteAllNotifications(userId);

        // Clear local state
        this.notifications = [];
        this.unreadCount = 0;
      } catch (err) {
        this.error = 'Không thể xóa tất cả thông báo: ' + err.message;
        throw err;
      }
    },

    async searchNotifications(userId, keyword = '', type = '', page = 1, limit = 10) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await NotificationService.searchNotifications(
          userId,
          keyword,
          type,
          page,
          limit
        );
        this.notifications = response.data || [];
        this.currentPage = 1;
        this.totalPages = response.pagination?.total
          ? Math.ceil(response.pagination.total / limit)
          : 1;
        return response;
      } catch (err) {
        this.error = 'Không thể tìm kiếm thông báo: ' + err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // Socket.io handler - khi nhận notification mới
    addNotification(notification) {
      // Thêm notification mới vào đầu danh sách
      this.notifications.unshift(notification);

      // Tăng unread count nếu notification chưa đọc
      if (!notification.isRead) {
        this.unreadCount++;
      }
    },

    clearError() {
      this.error = null;
    },
  },
});
