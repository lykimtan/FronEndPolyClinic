import { defineStore } from 'pinia';
import MedicalRecordService from '@/api/medicalRecordService';

export const useMedicalRecordStore = defineStore('medicalRecord', {
  state: () => ({
    currentRecord: null, // Hồ sơ hiện tại đang xem
    isLoading: false,
    error: null,
  }),

  getters: {
    getCurrentRecord: state => state.currentRecord,
    getIsLoading: state => state.isLoading,
    getError: state => state.error,
  },

  actions: {
    // Fetch một hồ sơ cụ thể khi người dùng click vào
    async fetchMedicalRecordById(recordId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MedicalRecordService.getMedicalRecordById(recordId);
        this.currentRecord = response;
        return response;
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching medical record:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Fetch hồ sơ của một bệnh nhân (không lưu store, chỉ return về)
    async fetchRecordsByPatient(patientId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MedicalRecordService.getRecordsByPatient(patientId);
        return response; // Return trực tiếp, không lưu store
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching patient records:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Tạo hồ sơ y tế mới
    async createMedicalRecord(recordData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MedicalRecordService.createMedicalRecord(recordData);
        this.currentRecord = response; // Lưu record vừa tạo làm current
        return response;
      } catch (error) {
        this.error = error.message;
        console.error('Error creating medical record:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Update hồ sơ y tế
    async updateMedicalRecord(recordId, updateData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MedicalRecordService.updateMedicalRecord(recordId, updateData);
        this.currentRecord = response; // Cập nhật current record
        return response;
      } catch (error) {
        this.error = error.message;
        console.error('Error updating medical record:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Clear current record (khi đóng modal/page)
    clearCurrentRecord() {
      this.currentRecord = null;
      this.error = null;
    },
  },
});
