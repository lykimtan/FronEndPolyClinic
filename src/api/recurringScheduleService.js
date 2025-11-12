import { privateApi } from './api.service';

class RecurringScheduleService {
  constructor() {
    this.baseUrl = '/api/recurring-schedules';
  }

  async createRecurringSchedule(scheduleData) {
    try {
      const response = await privateApi.post(this.baseUrl, scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getAllRecurringSchedules() {
    try {
      const response = await privateApi.get(this.baseUrl);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getRecurringByDoctorId(doctorId) {
    try {
      const response = await privateApi.get(`${this.baseUrl}/doctor/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async getRecurringById(scheduleId) {
    try {
      const response = await privateApi.get(`${this.baseUrl}/${scheduleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateRecurringSchedule(scheduleId, scheduleData) {
    try {
      const response = await privateApi.put(`${this.baseUrl}/${scheduleId}`, scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async deleteRecurringSchedule(scheduleId) {
    try {
      const response = await privateApi.delete(`${this.baseUrl}/${scheduleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new RecurringScheduleService();
