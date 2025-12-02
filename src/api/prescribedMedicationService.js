import { privateApi } from './api.service';

class PrescribedMedicationService {
  constructor() {
    this.baseUrl = '/api/prescribed-medications';
  }

  async createPrescribedMedication(medicationData) {
    try {
      const response = await privateApi.post(
        `${this.baseUrl}/createPrescribedMedication`,
        medicationData
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getPrescribedMedicationById(medicationId) {
    try {
      const response = await privateApi.get(`${this.baseUrl}/${medicationId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getPrescribedMedicationsByMedicalRecordId(medicalRecordId) {
    try {
      const response = await privateApi.get(`${this.baseUrl}/medicalRecord/${medicalRecordId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new PrescribedMedicationService();
