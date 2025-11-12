import { defineStore } from 'pinia';
import specializationService from '@/api/specializationService';
export const useSpecializationStore = defineStore('specialization', {
  state: () => ({
    list: [],
    loading: false,
    error: null,
  }),
  getters: {
    getAll: state => state.list,
    getById: state => id => state.list.find(s => s.id === id),
  },

  actions: {
    async fetchSpecializations() {
      this.loading = true; // cho biết là trạng thái đang tải dữ liệu xuống
      this.error = null; // lưu trữ thông báo lỗi nếu fetch dữ liệu thất bại
      try {
        const res = await specializationService.getAllSpecializations();
        const data = res?.data || res;
        this.list = Array.isArray(data) ? data : data?.items || [];
        return this.list;
      } catch (err) {
        console.error('Lỗi fetch:', err);
        this.error = err?.message || 'Lỗi không xác định';
        return [];
      } finally {
        this.loading = false;
      }
    },
    async fetchSepecializationById(id) {
      this.loading = true;
      this.error = null;
      try {
        const res = await specializationService.getSpecilizationById(id);
        return res?.data || res;
      } catch (err) {
        console.error('Lỗi fetch:', err);
        this.error = err?.message || 'Lỗi không xác định';
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});
