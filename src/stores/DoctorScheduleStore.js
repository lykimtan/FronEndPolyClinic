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

    async createDoctorSchedule(scheduleData) {
      try {
        const response = await DoctorScheduleService.createDoctorSchedule(scheduleData);
        console.log('Created schedule:', response);
        if (response.data) {
          this.schedules.push(response.data);
          return response.data;
        } else if (response._id) {
          this.schedules.push(response);
          return response;
        }
        return response;
      } catch (error) {
        console.error('Error creating schedule:', error);
        throw error;
      }
    },
  },
});
