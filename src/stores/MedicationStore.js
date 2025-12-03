import { defineStore } from 'pinia';
import MedicationService from '@/api/medicationService';

export const useMedicationStore = defineStore('medication', {
  state: () => ({
    medications: [],
    currentMedication: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    getAllMedications: state => state.medications,
    getCurrentMedication: state => state.currentMedication,
    getIsLoading: state => state.isLoading,
    getError: state => state.error,
    getMedicationCount: state => state.medications.length,
  },

  actions: {
    // Fetch tất cả thuốc
    async fetchAllMedications() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MedicationService.getAllMedications();
        this.medications = response;
        return response;
      } catch (error) {
        this.error = error.message || 'Có lỗi xảy ra khi lấy danh sách thuốc';
        console.error('Error fetching medications:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Fetch 1 thuốc theo ID
    async fetchMedicationById(medicationId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MedicationService.getMedicationById(medicationId);
        this.currentMedication = response;
        return response;
      } catch (error) {
        this.error = error.message || 'Có lỗi xảy ra khi lấy thông tin thuốc';
        console.error('Error fetching medication by ID:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Tạo thuốc mới
    async createMedication(medicationData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MedicationService.createMedication(medicationData);
        this.medications.push(response);
        return response;
      } catch (error) {
        this.error = error.message || 'Có lỗi xảy ra khi tạo thuốc';
        console.error('Error creating medication:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Update thuốc
    async updateMedication(medicationId, medicationData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await MedicationService.updateMedication(medicationId, medicationData);

        // Update trong danh sách
        const index = this.medications.findIndex(m => m._id === medicationId);
        if (index !== -1) {
          this.medications[index] = response;
        }

        // Update current nếu đang xem
        if (this.currentMedication?._id === medicationId) {
          this.currentMedication = response;
        }

        return response;
      } catch (error) {
        this.error = error.message || 'Có lỗi xảy ra khi cập nhật thuốc';
        console.error('Error updating medication:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Xóa thuốc
    async deleteMedication(medicationId) {
      this.isLoading = true;
      this.error = null;
      try {
        await MedicationService.deleteMedication(medicationId);

        // Xóa khỏi danh sách
        this.medications = this.medications.filter(m => m._id !== medicationId);

        // Clear current nếu đã xóa
        if (this.currentMedication?._id === medicationId) {
          this.currentMedication = null;
        }

        return true;
      } catch (error) {
        this.error = error.message || 'Có lỗi xảy ra khi xóa thuốc';
        console.error('Error deleting medication:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Clear current medication
    clearCurrentMedication() {
      this.currentMedication = null;
      this.error = null;
    },

    // Clear error
    clearError() {
      this.error = null;
    },
  },
});
