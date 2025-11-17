import { defineStore } from 'pinia';
import DoctorScheduleService from '@/api/doctorScheduleService';
export const useDoctorScheduleStore = defineStore('doctorSchedule', {
  state: () => ({
    schedules: [],
  }),
  getters: {
    getAllSchedules: state => state.schedules,
    getScheduleByDoctorId: state => doctorId => state.schedules.find(s => s.doctorId === doctorId),
  },
  actions: {
    async fetchSchedulesByDoctorId(doctorId) {
      try {
        const response = await DoctorScheduleService.getDoctorScheduleByDoctorId(doctorId);
        console.log('Raw response from API:', response);
        if (Array.isArray(response)) {
          return response;
        } else if (response.data && Array.isArray(response.data)) {
          return response.data;
        } else if (response.schedules && Array.isArray(response.schedules)) {
          return response.schedules;
        } else {
          console.error('Unexpected response structure:', response);
          this.schedules = [];
        }
      } catch (error) {
        this.schedules = [];
      }
    },
  },
});
