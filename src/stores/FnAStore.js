import { defineStore } from 'pinia';
import FnAService from '@/api/FnAService';

export const useFnAStore = defineStore('fnaStore', {
  state: () => ({
    allFnA: [],
    publishedFnA: [],
    myQuestions: [],
    doctorAnswers: [],
    currentFnA: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    getAllFnA: state => state.allFnA,

    getPublishedFnA: state => state.publishedFnA,

    getMyQuestions: state => state.myQuestions,

    getDoctorAnswers: state => state.doctorAnswers,

    getCurrentFnA: state => state.currentFnA,

    getIsLoading: state => state.isLoading,

    getError: state => state.error,

    hasFnA: state => state.allFnA.length > 0,

    hasPublishedFnA: state => state.publishedFnA.length > 0,
  },

  actions: {
    async fetchAllFnA() {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await FnAService.getAllFnA();
        this.allFnA = data;
        return data;
      } catch (err) {
        this.error = err.message || 'Failed to fetch all FnA';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPublishedFnA() {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await FnAService.getPublishedFnA();
        this.publishedFnA = data;
        return data;
      } catch (err) {
        this.error = err.message || 'Failed to fetch published FnA';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchFnAByAsker(askerId) {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await FnAService.getFnAByAsker(askerId);
        this.myQuestions = data;
        return data;
      } catch (err) {
        this.error = err.message || 'Failed to fetch your questions';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchFnAByResponder(doctorId) {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await FnAService.getFnAByResponder(doctorId);
        this.doctorAnswers = data;
        return data;
      } catch (err) {
        this.error = err.message || 'Failed to fetch doctor answers';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async createQuestion(askerId, question, isConfidential = true) {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await FnAService.createQuestion(askerId, question, isConfidential);
        // Thêm vào cả allFnA và myQuestions
        this.allFnA.unshift(data); // Thêm vào đầu danh sách (mới nhất)
        this.myQuestions.push(data);
        return data;
      } catch (err) {
        this.error = err.message || 'Failed to create question';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async updateQuestion(fnAId, question, isConfidential) {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await FnAService.updateQuestion(fnAId, question, isConfidential);

        // Update in allFnA list
        const index = this.allFnA.findIndex(f => f._id === fnAId);
        if (index !== -1) {
          this.allFnA[index] = data;
        }

        // Update in myQuestions list
        const myIndex = this.myQuestions.findIndex(f => f._id === fnAId);
        if (myIndex !== -1) {
          this.myQuestions[myIndex] = data;
        }

        return data;
      } catch (err) {
        this.error = err.message || 'Failed to update question';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async updateFnA(fnAId, doctorId, answer, file = null, isPublished = false) {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await FnAService.updateFnA(fnAId, doctorId, answer, file, isPublished);
        this.currentFnA = data;

        // Update in allFnA list
        const index = this.allFnA.findIndex(f => f._id === fnAId);
        if (index !== -1) {
          this.allFnA[index] = data;
        }

        // Update in publishedFnA if it's published
        if (isPublished) {
          const pubIndex = this.publishedFnA.findIndex(f => f._id === fnAId);
          if (pubIndex !== -1) {
            this.publishedFnA[pubIndex] = data;
          } else {
            this.publishedFnA.push(data);
          }
        }

        return data;
      } catch (err) {
        this.error = err.message || 'Failed to update FnA';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async updatePublicationStatus(fnAId, isPublished) {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await FnAService.updatePublicationStatus(fnAId, isPublished);

        // Update in allFnA list
        const index = this.allFnA.findIndex(f => f._id === fnAId);
        if (index !== -1) {
          this.allFnA[index] = data;
        }

        // Update in publishedFnA
        if (isPublished) {
          const pubIndex = this.publishedFnA.findIndex(f => f._id === fnAId);
          if (pubIndex === -1) {
            this.publishedFnA.push(data);
          } else {
            this.publishedFnA[pubIndex] = data;
          }
        } else {
          this.publishedFnA = this.publishedFnA.filter(f => f._id !== fnAId);
        }

        return data;
      } catch (err) {
        this.error = err.message || 'Failed to update publication status';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteFnA(fnAId) {
      this.isLoading = true;
      this.error = null;
      try {
        await FnAService.deleteFnA(fnAId);

        // Remove from all lists
        this.allFnA = this.allFnA.filter(f => f._id !== fnAId);
        this.publishedFnA = this.publishedFnA.filter(f => f._id !== fnAId);
        this.myQuestions = this.myQuestions.filter(f => f._id !== fnAId);
        this.doctorAnswers = this.doctorAnswers.filter(f => f._id !== fnAId);

        if (this.currentFnA?._id === fnAId) {
          this.currentFnA = null;
        }
      } catch (err) {
        this.error = err.message || 'Failed to delete FnA';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteAnswer(fnAId) {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await FnAService.deleteAnswer(fnAId);

        // Update in allFnA list
        const index = this.allFnA.findIndex(f => f._id === fnAId);
        if (index !== -1) {
          this.allFnA[index] = data;
        }

        // Update in doctorAnswers list
        const doctorIndex = this.doctorAnswers.findIndex(f => f._id === fnAId);
        if (doctorIndex !== -1) {
          this.doctorAnswers[doctorIndex] = data;
        }

        return data;
      } catch (err) {
        this.error = err.message || 'Failed to delete answer';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    clearError() {
      this.error = null;
    },

    resetStore() {
      this.allFnA = [];
      this.publishedFnA = [];
      this.myQuestions = [];
      this.doctorAnswers = [];
      this.currentFnA = null;
      this.isLoading = false;
      this.error = null;
    },
  },
});
