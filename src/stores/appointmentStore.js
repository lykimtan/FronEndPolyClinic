import { defineStore } from 'pinia';
import AppointmentService from '@/api/appointmentService.js';

export const useAppointmentStore = defineStore('appointmentStore', {
  actions: {
    async createAppointment(appointmentData) {
      const response = await AppointmentService.createAppointment(appointmentData);
      return response.data;
    },

    async fetchAppointmentsByPatientId(patientId) {
      const response = await AppointmentService.getAppointmentsByPatientId(patientId);
      return response.data;
    },

    async fetchAllAppointmentsByDate(date) {
      const response = await AppointmentService.getAllAppointmentsByDate(date);
      return response.data;
    },
  },
});
