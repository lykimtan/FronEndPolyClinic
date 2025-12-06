import { defineStore } from 'pinia';
import MedicalRecordService from '@/api/medicalRecordService';

export const useMedicalRecordStore = defineStore('medicalRecord', {
  state: () => ({
    currentRecord: null, // Hồ sơ hiện tại đang xem
    recordsList: [], // Danh sách hồ sơ của bệnh nhân
    isLoading: false,
    error: null,
    recordCount: 0, // Số lượng hồ sơ của bệnh nhân
  }),

  getters: {
    getCurrentRecord: state => state.currentRecord,
    getRecordsList: state => state.recordsList,
    getIsLoading: state => state.isLoading,
    getError: state => state.error,
    getRecordCount: state => state.recordCount,
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

    // Get medical record by ID (direct method)
    async getMedicalRecordById(recordId) {
      return this.fetchMedicalRecordById(recordId);
    },

    // Fetch hồ sơ của một bệnh nhân và lưu vào store
    async fetchRecordsByPatient(patientId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MedicalRecordService.getRecordsByPatient(patientId);
        this.recordsList = response || []; // Lưu vào store
        return response;
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching patient records:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Fetch số lượng hồ sơ của một bệnh nhân
    async fetchRecordCountByPatient(patientId) {
      this.isLoading = true;
      this.error = null;
      try {
        const count = await MedicalRecordService.getRecordCountByPatient(patientId);
        this.recordCount = count;
        return count;
      } catch (error) {
        this.error = error.message;
        console.error('Error fetching record count:', error);
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
    async updateMedicalRecord(recordId, updateData, doctorId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MedicalRecordService.updateMedicalRecord(
          recordId,
          updateData,
          doctorId
        );
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
