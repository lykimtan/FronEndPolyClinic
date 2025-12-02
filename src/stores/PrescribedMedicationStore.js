import { defineStore } from 'pinia';
import PrescribedMedicationService from '@/api/prescribedMedicationService';

export const usePrescribedMedicationStore = defineStore('prescribedMedication', {
  state: () => ({
    prescribedMedications: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    getPrescribedMedications: state => state.prescribedMedications,
    getIsLoading: state => state.isLoading,
    getError: state => state.error,
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
        this.prescribedMedications = response;
        return response;
      } catch (error) {
        this.error = error.message;
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
        return response;
      } catch (error) {
        this.error = error.message;
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
        return response;
      } catch (error) {
        this.error = error.message;
        console.error('Error creating prescribed medication:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
