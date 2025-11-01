import { privateApi, publicApi } from './api.service';

class RoleRequestService {
  constructor() {
    this.baseUrl = '/api/role-requests';
  }

  /**
   * Upload document proof (certificate, license, etc.)
   * @param {File} file - The document file to upload
   * @returns {Promise} - Returns document URL
   */
  async uploadDocument(file) {
    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await privateApi.post(`${this.baseUrl}/upload-document`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Submit a new role request
   * @param {Object} requestData - Role request data
   * @param {string} requestData.requestedRole - The role being requested (doctor, staff, admin)
   * @param {string} requestData.documentProof - URL of uploaded document
   * @param {string} requestData.licenseNumber - License number (for doctors)
   * @param {Array} requestData.specializationIds - Array of specialization IDs (for doctors)
   * @param {string} requestData.note - Additional notes
   * @returns {Promise}
   */
  async submitRoleRequest(requestData) {
    try {
      const response = await privateApi.post(`${this.baseUrl}/submit`, requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get user's own role requests
   * @returns {Promise}
   */
  async getMyRequests() {
    try {
      const response = await privateApi.get(`${this.baseUrl}/my-requests`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get all pending role requests (Admin only)
   * @returns {Promise}
   */
  async getPendingRequests() {
    try {
      const response = await privateApi.get(`${this.baseUrl}/pending`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Approve a role request (Admin only)
   * @param {string} requestId - The role request ID
   * @returns {Promise}
   */
  async approveRequest(requestId) {
    try {
      const response = await privateApi.patch(`${this.baseUrl}/${requestId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Reject a role request (Admin only)
   * @param {string} requestId - The role request ID
   * @param {string} note - Rejection reason
   * @returns {Promise}
   */
  async rejectRequest(requestId, note) {
    try {
      const response = await privateApi.patch(`${this.baseUrl}/${requestId}/reject`, { note });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Delete a role request (Admin only)
   * @param {string} requestId - The role request ID
   * @returns {Promise}
   */
  async deleteRequest(requestId) {
    try {
      const response = await privateApi.delete(`${this.baseUrl}/${requestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Get full document URL from relative path
   * @param {string} documentPath - Relative document path
   * @returns {string} - Full document URL
   */
  getDocumentUrl(documentPath) {
    if (!documentPath) return null;
    if (documentPath.startsWith('http')) return documentPath;
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${baseURL}${documentPath}`;
  }
}

export default new RoleRequestService();
