// stores/roleRequested.js
import { defineStore } from 'pinia';
import roleRequestService from '@/api/roleRequestService';

export const useRoleRequestedStore = defineStore('roleRequested', {
  state: () => ({
    roleRequests: [],
    loading: false, // trạng thái tải
    error: null, // lưu lỗi nếu có
  }),

  getters: {
    hasError: state => !!state.error,
    isEmpty: state => state.roleRequests.length === 0,

    getRequestById: state => {
      return id => state.roleRequests.find(req => req._id === id);
    },
  },

  actions: {
    async fetchRoleRequests() {
      this.loading = true;
      this.error = null;

      try {
        const res = await roleRequestService.getPendingRequests();
        this.roleRequests = res.data || [];
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    async approveRequest(id) {
      try {
        const res = await roleRequestService.approveRequest(id);
        //cập nhật trạng thái trong store
        const index = this.roleRequests.findIndex(req => req._id === id);
        if (index !== -1) {
          this.roleRequests[index] = res.data;
        }
      } catch (error) {
        this.error = error;
        console.error('Error approving role request:', error);
      }
    },

    async rejectRequest(id, note) {
      try {
        const res = await roleRequestService.rejectRequest(id, note);
        //cập nhật trạng thái trong store
        const index = this.roleRequests.findIndex(req => req._id === id);
        if (index !== -1) {
          this.roleRequests[index] = res.data;
        }
      } catch (error) {
        this.error = error;
        console.error('Error rejecting role request:', error);
      }
    },

    async getMyRequests() {
      this.loading = true;
      this.error = null;

      try {
        const res = await roleRequestService.getMyRequests();
        this.roleRequests = Array.isArray(res) ? [...res] : res?.data || [];
      } catch (err) {
        this.error = err;
        console.error('Error loading role requests:', err);
      } finally {
        this.loading = false;
      }
    },

    // Delete a role request (user can cancel their pending request)
    async deleteRequest(requestId) {
      this.loading = true;
      this.error = null;
      try {
        const res = await roleRequestService.deleteRequest(requestId);
        // remove from local state
        this.roleRequests = this.roleRequests.filter(
          r => String(r._id || r.id) !== String(requestId)
        );
        return res;
      } catch (err) {
        this.error = err;
        console.error('Error deleting role request:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
