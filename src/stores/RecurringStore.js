import { defineStore } from 'pinia';
import RecurringService from '@/api/recurringScheduleService';

export const useRecurringStore = defineStore('recurring', {
  state: () => ({
    list: [],
  }),
  getters: {
    getAll: state => state.list,
    getById: state => id => state.list.find(s => s.id === id),
  },
  actions: {
    async fetchAllRecurringSchedules() {
      try {
        const response = await RecurringService.getAllRecurringSchedules();
        console.log('Raw response from API:', response);
        if (Array.isArray(response)) {
          this.list = response;
        } else if (response.data && Array.isArray(response.data)) {
          this.list = response.data;
        } else if (response.schedules && Array.isArray(response.schedules)) {
          this.list = response.schedules;
        } else {
          console.error('Unexpected response structure:', response);
          this.list = [];
        }
      } catch (error) {
        console.error('Error fetching recurring schedules:', error);
        this.list = [];
      }
    },

    async fetchRecurringByDoctorId(doctorId) {
      try {
        const response = await RecurringService.getRecurringByDoctorId(doctorId);
        return response;
      } catch (error) {
        console.error('Error fetching recurring schedules by doctor ID:', error);
        return null;
      }
    },

    async createRecurringSchedule(scheduleData) {
      try {
        const response = await RecurringService.createRecurringSchedule(scheduleData);
        return response;
      } catch (error) {
        console.error('Error creating recurring schedule:', error);
        throw error;
      }
    },

    async updateRecurringSchedule(scheduleId, scheduleData) {
      try {
        const response = await RecurringService.updateRecurringSchedule(scheduleId, scheduleData);
        return response;
      } catch (error) {
        console.error('Error updating recurring schedule:', error);
        throw error;
      }
    },

    async deleteRecurringSchedule(scheduleId) {
      try {
        const response = await RecurringService.deleteRecurringSchedule(scheduleId);
        return response;
      } catch (error) {
        console.error('Error deleting recurring schedule:', error);
        throw error;
      }
    },
  },
});
