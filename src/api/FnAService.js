import { privateApi } from './api.service';

class FnAService {
  constructor() {
    this.baseUrl = '/api/fna';
  }

  // Tạo câu hỏi thường gặp mới
  async createQuestion(askerId, question, isConfidential = true) {
    try {
      const response = await privateApi.post(`${this.baseUrl}/create`, {
        askerId,
        question,
        isConfidential,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Lấy tất cả câu hỏi-câu trả lời
  async getAllFnA() {
    try {
      const response = await privateApi.get(`${this.baseUrl}/all`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Lấy câu hỏi-câu trả lời công khai (đã được xuất bản)
  async getPublishedFnA() {
    try {
      const response = await privateApi.get(`${this.baseUrl}/published`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Lấy câu hỏi-câu trả lời của một người hỏi
  async getFnAByAsker(askerId) {
    try {
      const response = await privateApi.get(`${this.baseUrl}/asker/${askerId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Lấy câu hỏi-câu trả lời của một bác sĩ (người trả lời)
  async getFnAByResponder(doctorId) {
    try {
      const response = await privateApi.get(`${this.baseUrl}/responder/${doctorId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Cập nhật câu hỏi của user (không phải doctor trả lời)
  async updateQuestion(fnAId, question, isConfidential) {
    try {
      const response = await privateApi.put(`${this.baseUrl}/question/${fnAId}`, {
        question,
        isConfidential,
      });
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Cập nhật câu hỏi-câu trả lời (đơn có hình ảnh)
  async updateFnA(fnAId, doctorId, answer, file = null, isPublished = false) {
    try {
      const formData = new FormData();
      formData.append('doctorId', doctorId);
      formData.append('answer', answer);
      formData.append('isPublished', isPublished);

      // Thêm file nếu có
      if (file) {
        formData.append('fnAImage', file);
      }

      const response = await privateApi.put(`${this.baseUrl}/update/${fnAId}`, formData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Cập nhật trạng thái xuất bản câu hỏi-câu trả lời
  async updatePublicationStatus(fnAId, isPublished) {
    try {
      const response = await privateApi.put(`${this.baseUrl}/publish/${fnAId}`, {
        isPublished,
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Xóa câu trả lời (đặt lại trạng thái về pending)
  async deleteAnswer(fnAId) {
    try {
      const response = await privateApi.put(`${this.baseUrl}/delete-answer/${fnAId}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Xóa câu hỏi-câu trả lời
  async deleteFnA(fnAId) {
    try {
      const response = await privateApi.delete(`${this.baseUrl}/delete/${fnAId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new FnAService();
