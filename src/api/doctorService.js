import { publicApi } from './api.service';

class DoctorService {
  constructor() {
    this.baseUrl = '/api/doctors';
  }

  async getAllDoctors() {
    const res = await publicApi.get(`${this.baseUrl}/all`);
    return res.data;
  }

  async getDoctorById(id) {
    const res = await publicApi.get(`${this.baseUrl}/${id}`);
    return res.data;
  }

  async getAllDoctorsBySpecialization(specializationId) {
    const res = await publicApi.get(`${this.baseUrl}/specialization/${specializationId}`);
    return res.data;
  }
}

export default new DoctorService();
