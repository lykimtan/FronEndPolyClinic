import { privateApi } from './api.service';
class MedicalRecordService {
  constructor() {
    this.baseUrl = '/api/medical-records';
  }

  async createMedicalRecord(recordData) {
    try {
      const response = await privateApi.post(`${this.baseUrl}/createRecord`, recordData);
      return response.data.data; // response.data = { success, message, data: {...} }
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getMedicalRecordById(recordId) {
    try {
      const response = await privateApi.get(`${this.baseUrl}/${recordId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getRecordsByPatient(patientId) {
    try {
      const response = await privateApi.get(`${this.baseUrl}/patient/${patientId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getRecordCountByPatient(patientId) {
    try {
      const response = await privateApi.get(`${this.baseUrl}/patient/${patientId}/count`);
      return response.data.count;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new MedicalRecordService();
