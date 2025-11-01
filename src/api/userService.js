import { privateApi } from './api.service';

class UserService {
  constructor(baseUrl = 'api/users') {
    this.baseUrl = baseUrl;
  }

  async getUserProfile() {
    const res = await privateApi.get(`${this.baseUrl}/profile`);
    return res.data;
  }

  async updateUserProfile(userData) {
    const res = await privateApi.put(`${this.baseUrl}/profile`, userData);
    return res.data;
  }

  async changePassword(passwordData) {
    const res = await privateApi.put(`${this.baseUrl}/change-password`, passwordData);
    return res.data;
  }

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await privateApi.post(`${this.baseUrl}/upload-avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }
}

export const userService = new UserService();
