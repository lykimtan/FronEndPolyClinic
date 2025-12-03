import { defineStore } from 'pinia';
import PrescribedMedicationService from '@/api/prescribedMedicationService';

export const usePrescribedMedicationStore = defineStore('prescribedMedication', {
  state: () => ({
    prescribedMedications: [],
    currentPrescribedMedication: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    getPrescribedMedications: state => state.prescribedMedications,
    getCurrentPrescribedMedication: state => state.currentPrescribedMedication,
    getIsLoading: state => state.isLoading,
    getError: state => state.error,
    getPrescribedMedicationCount: state => state.prescribedMedications.length,
  },

  actions: {
    // Fetch thuốc đã kê đơn theo hồ sơ y tế
    async fetchPrescribedMedicationsByMedicalRecordId(medicalRecordId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response =
          await PrescribedMedicationService.getPrescribedMedicationsByMedicalRecordId(
            medicalRecordId
          );
        this.prescribedMedications = Array.isArray(response) ? response : [response];
        return this.prescribedMedications;
      } catch (error) {
        this.error = error.message || 'Lỗi khi tải đơn thuốc';
        console.error('Error fetching prescribed medications:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPrescribedMedicationById(medicationId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response =
          await PrescribedMedicationService.getPrescribedMedicationById(medicationId);
        this.currentPrescribedMedication = response;
        return response;
      } catch (error) {
        this.error = error.message || 'Lỗi khi tải chi tiết đơn thuốc';
        console.error('Error fetching prescribed medication by ID:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createPrescribedMedication(medicationData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response =
          await PrescribedMedicationService.createPrescribedMedication(medicationData);
        this.prescribedMedications.push(response);
        return response;
      } catch (error) {
        this.error = error.message || 'Lỗi khi tạo đơn thuốc';
        console.error('Error creating prescribed medication:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updatePrescribedMedication(id, medicationData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await PrescribedMedicationService.updatePrescribedMedication(
          id,
          medicationData
        );
        this.currentPrescribedMedication = response;
        // Update in prescribedMedications array if it exists
        const index = this.prescribedMedications.findIndex(pm => pm._id === id);
        if (index !== -1) {
          this.prescribedMedications[index] = response;
        }
        return response;
      } catch (error) {
        this.error = error.message || 'Lỗi khi cập nhật đơn thuốc';
        console.error('Error updating prescribed medication:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Helper actions
    clearCurrentPrescribedMedication() {
      this.currentPrescribedMedication = null;
    },

    clearError() {
      this.error = null;
    },

    clearPrescribedMedications() {
      this.prescribedMedications = [];
    },
  },
});
