import { privateApi } from './api.service';

class RatingService {
  constructor() {
    this.baseUrl = '/api/ratings';
  }

  // Get all ratings for a specific doctor
  async getRatingsByDoctor(doctorId) {
    try {
      const response = await privateApi.get(`${this.baseUrl}/doctor/${doctorId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get average rating for a specific doctor
  async getAverageRatingByDoctor(doctorId) {
    try {
      const response = await privateApi.get(`${this.baseUrl}/doctor/${doctorId}/average`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get top rated doctors
  async getTopRatedDoctors(limit = 10, minRating = 4.5) {
    try {
      const response = await privateApi.get(
        `${this.baseUrl}/top-rated?limit=${limit}&minRating=${minRating}`
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Create a new rating
  async createRating(patientId, doctorId, appointmentId, score, comment) {
    try {
      const response = await privateApi.post(this.baseUrl, {
        patientId,
        doctorId,
        appointmentId,
        score,
        comment,
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Update an existing rating
  async updateRating(ratingId, score, comment) {
    try {
      const response = await privateApi.put(`${this.baseUrl}/${ratingId}`, {
        score,
        comment,
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Delete a rating
  async deleteRating(ratingId) {
    try {
      const response = await privateApi.delete(`${this.baseUrl}/${ratingId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new RatingService();
