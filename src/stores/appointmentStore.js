import { defineStore } from 'pinia';
import AppointmentService from '@/api/appointmentService.js';

export const useAppointmentStore = defineStore('appointmentStore', {
  state: () => ({
    appointments: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    allAppointments: state => state.appointments,

    getIsLoading: state => state.isLoading,
  },

  // 3. Cập nhật Actions
  actions: {
    async createAppointment(appointmentData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await AppointmentService.createAppointment(appointmentData);
        return response.data;
      } catch (err) {
        this.error = 'Không thể tạo cuộc hẹn: ' + err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAppointmentById(appointmentId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await AppointmentService.getAppointmentById(appointmentId);
        return response.data;
      } catch (err) {
        this.error = 'Không thể tải cuộc hẹn: ' + err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAppointmentsByDoctorId(doctorId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await AppointmentService.getAppointmentsByDoctorId(doctorId);
        this.appointments = response.data;
        return response.data;
      } catch (err) {
        this.error = 'Không thể tải cuộc hẹn của bác sĩ: ' + err.message;
        this.appointments = [];
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAppointmentsByPatientId(patientId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await AppointmentService.getAppointmentsByPatientId(patientId);
        this.appointments = response.data;
        return response.data;
      } catch (err) {
        this.error = 'Không thể tải cuộc hẹn của bệnh nhân: ' + err.message;
        this.appointments = [];
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAllAppointmentsByDate(date) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await AppointmentService.getAllAppointmentsByDate(date);
        this.appointments = response.data;
        return response.data;
      } catch (err) {
        this.error = 'Không thể tải cuộc hẹn theo ngày: ' + err.message;
        this.appointments = [];
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async updateAppointmentStatus(appointmentId, status, reasonForRejection = '') {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await AppointmentService.updateAppointmentStatus(
          appointmentId,
          status,
          reasonForRejection
        );
        return response.data;
      } catch (err) {
        this.error = 'Không thể cập nhật trạng thái cuộc hẹn: ' + err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteAppointment(appointmentId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await AppointmentService.deleteAppointment(appointmentId);
        return response.data;
      } catch (err) {
        this.error = 'Không thể xóa cuộc hẹn: ' + err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async updateMedicalRecordForAppointment(appointmentId, medicalRecordData) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await AppointmentService.updateMedicalRecordForAppointment(
          appointmentId,
          medicalRecordData
        );
        return response.data;
      } catch (err) {
        this.error = 'Không thể cập nhật hồ sơ y tế cho cuộc hẹn: ' + err.message;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
