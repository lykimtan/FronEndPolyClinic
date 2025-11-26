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
  },
});
