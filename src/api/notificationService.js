import { privateApi } from './api.service';

class NotificationService {
  constructor() {
    this.baseUrl = '/api/notifications';
  }

  async getNotifications(userId, page = 1, limit = 10, isRead = null) {
    const params = { page, limit };
    if (isRead !== null) {
      params.isRead = isRead;
    }
    const res = await privateApi.get(`${this.baseUrl}/${userId}`, { params });
    return res.data;
  }

  async getUnreadCount(userId) {
    const res = await privateApi.get(`${this.baseUrl}/${userId}/unread`);
    return res.data;
  }

  async markAsRead(notificationId) {
    const res = await privateApi.put(`${this.baseUrl}/${notificationId}/read`);
    return res.data;
  }

  async markMultipleAsRead(notificationIds) {
    const res = await privateApi.put(`${this.baseUrl}/read-multiple`, {
      notificationIds,
    });
    return res.data;
  }

  async markAllAsRead(userId) {
    const res = await privateApi.put(`${this.baseUrl}/${userId}/read-all`);
    return res.data;
  }

  async deleteNotification(notificationId) {
    const res = await privateApi.delete(`${this.baseUrl}/${notificationId}`);
    return res.data;
  }

  async deleteMultipleNotifications(notificationIds) {
    const res = await privateApi.delete(`${this.baseUrl}/multiple`, {
      data: { notificationIds },
    });
    return res.data;
  }

  async deleteAllNotifications(userId) {
    const res = await privateApi.delete(`${this.baseUrl}/${userId}/all`);
    return res.data;
  }

  async searchNotifications(userId, keyword = '', type = '', page = 1, limit = 10) {
    const params = { keyword, type, page, limit };
    const res = await privateApi.get(`${this.baseUrl}/${userId}/search`, { params });
    return res.data;
  }
}

export default new NotificationService();
