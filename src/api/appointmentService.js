import { privateApi } from './api.service';
class AppointmentService {
  constructor() {
    this.baseUrl = '/api/appointments';
  }

  async createAppointment(appointmentData) {
    const res = await privateApi.post(this.baseUrl, appointmentData);
    return res.data;
  }

  async getAllAppointments() {
    const res = await privateApi.get(this.baseUrl);
    return res.data;
  }

  async getAppointmentsByDoctorId(doctorId) {
    const res = await privateApi.get(`${this.baseUrl}/doctor/${doctorId}`);
    return res.data;
  }

  async getAllAppointmentsByDate(date) {
    const res = await privateApi.get(`${this.baseUrl}/doctor/appointment-today`, {
      params: { date },
    });
    return res.data;
  }

  async getAppointmentsByPatientId(patientId) {
    const res = await privateApi.get(`${this.baseUrl}/patientId/${patientId}`);
    return res.data;
  }

  async updateAppointmentStatus(appointmentId, status) {
    const res = await privateApi.put(`${this.baseUrl}/${appointmentId}/status`, { status });
    return res.data;
  }
}

export default new AppointmentService();
