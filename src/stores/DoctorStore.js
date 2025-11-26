import { defineStore } from 'pinia';
import doctorService from '@/api/doctorService';

export const useDoctorStore = defineStore('doctor', {
  state: () => ({
    list: [],
  }),
  getters: {
    getDoctorByRating: state => {
      return state.list.filter(doctor => doctor.ratingAverage >= 4.5);
    },
    getAll: state => state.list,
    getById: state => id => state.list.find(d => d.id === id),
  },

  actions: {
    async fetchDoctors() {
      try {
        const response = await doctorService.getAllDoctors();
        console.log('Raw response from API:', response);
        if (Array.isArray(response)) {
          this.list = response;
        } else if (response.data && Array.isArray(response.data)) {
          this.list = response.data;
        } else if (response.doctors && Array.isArray(response.doctors)) {
          this.list = response.doctors;
        } else {
          console.error('Unexpected response structure:', response);
          this.list = [];
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        this.list = [];
      }
    },

    async fetchDoctorBySpecialization(specializationId) {
      try {
        const doctors = await doctorService.getAllDoctorsBySpecialization(specializationId);
        return doctors.data;
      } catch (error) {
        console.error('Error fetching doctors by specialization:', error);
      }
    },

    async getDoctorById(doctorId) {
      try {
        const doctor = await doctorService.getDoctorById(doctorId);
        return doctor;
      } catch (error) {
        console.error('Error fetching doctor by ID:', error);
      }
    },
  },
});
