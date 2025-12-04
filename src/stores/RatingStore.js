import { defineStore } from 'pinia';
import RatingService from '@/api/ratingService';

export const useRatingStore = defineStore('ratingStore', {
  state: () => ({
    ratings: [],
    averageRating: null,
    isLoading: false,
    error: null,
    topRatedDoctors: [],
  }),

  getters: {
    allRatings: state => state.ratings,

    getIsLoading: state => state.isLoading,

    hasRatings: state => state.ratings.length > 0,

    averageScore: state => state.averageRating?.averageScore || 0,

    getTopRatedDoctors: state => state.topRatedDoctors,
  },

  actions: {
    async fetchRatingsByDoctor(doctorId) {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await RatingService.getRatingsByDoctor(doctorId);
        this.ratings = data;
        return data;
      } catch (err) {
        this.error = err.message || 'Failed to fetch ratings';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAverageRatingByDoctor(doctorId) {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await RatingService.getAverageRatingByDoctor(doctorId);
        this.averageRating = data;
        return data;
      } catch (err) {
        this.error = err.message || 'Failed to fetch average rating';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchTopRatedDoctors(limit = 10, minRating = 4.5) {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await RatingService.getTopRatedDoctors(limit, minRating);
        this.topRatedDoctors = data;
        return data;
      } catch (err) {
        this.error = err.message || 'Failed to fetch top rated doctors';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async createRating(patientId, doctorId, appointmentId, score, comment) {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await RatingService.createRating(
          patientId,
          doctorId,
          appointmentId,
          score,
          comment
        );
        this.ratings.push(data);
        return data;
      } catch (err) {
        this.error = err.message || 'Failed to create rating';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async updateRating(ratingId, score, comment) {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await RatingService.updateRating(ratingId, score, comment);
        const index = this.ratings.findIndex(r => r._id === ratingId);
        if (index !== -1) {
          this.ratings[index] = data;
        }
        return data;
      } catch (err) {
        this.error = err.message || 'Failed to update rating';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteRating(ratingId) {
      this.isLoading = true;
      this.error = null;
      try {
        await RatingService.deleteRating(ratingId);
        this.ratings = this.ratings.filter(r => r._id !== ratingId);
      } catch (err) {
        this.error = err.message || 'Failed to delete rating';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    clearError() {
      this.error = null;
    },

    resetStore() {
      this.ratings = [];
      this.averageRating = null;
      this.isLoading = false;
      this.error = null;
    },
  },
});
