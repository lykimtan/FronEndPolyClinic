import { privateApi } from './api.service';

class MedicationService {
  constructor() {
    this.baseUrl = '/api/medications';
  }
  async getAllMedications() {
    try {
      const response = await privateApi.get(this.baseUrl);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getMedicationById(medicationId) {
    try {
      const response = await privateApi.get(`${this.baseUrl}/${medicationId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async createMedication(medicationData) {
    try {
      const response = await privateApi.post(`${this.baseUrl}/createDrug`, medicationData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateMedication(medicationId, medicationData) {
    try {
      const response = await privateApi.put(`${this.baseUrl}/${medicationId}`, medicationData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async deleteMedication(medicationId) {
    try {
      const response = await privateApi.delete(`${this.baseUrl}/${medicationId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new MedicationService();
