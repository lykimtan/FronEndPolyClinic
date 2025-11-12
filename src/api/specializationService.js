import { privateApi, publicApi } from './api.service';

class SpecializationService {
  constructor() {
    this.baseUrl = '/api/specializations';
  }

  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('specImage', file);

      const response = await privateApi.post(`${this.baseUrl}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async createSpecialization(specializationData) {
    try {
      const response = await privateApi.post(this.baseUrl, specializationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getAllSpecializations() {
    try {
      const response = await publicApi.get(this.baseUrl);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getSpecilizationById(specializationId) {
    try {
      const response = await publicApi.get(`${this.baseUrl}/${specializationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateSpecialization(specializationId, specializationData) {
    try {
      const response = await privateApi.put(
        `${this.baseUrl}/${specializationId}`,
        specializationData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async deleteSpecialization(specializationId) {
    try {
      const response = await privateApi.delete(`${this.baseUrl}/${specializationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new SpecializationService();
