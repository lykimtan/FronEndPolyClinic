import { publicApi, privateApi } from './api.service';
class DoctorScheduleService {
  constructor() {
    this.baseUrl = '/api/doctor-schedules';
  }

  async getDoctorScheduleByDoctorId(doctorId) {
    const res = await privateApi.get(`${this.baseUrl}/${doctorId}`);
    return res.data;
  }
}

export default new DoctorScheduleService();
