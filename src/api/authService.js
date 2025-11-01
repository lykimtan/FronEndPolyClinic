import { publicApi } from './api.service';
import { privateApi } from './api.service';

// export const login = async credentials => {
//   const res = await publicApi.post('/auth/login', credentials);
//   return res.data;
// };

class AuthService {
  constructor(baseUrl = 'api/users') {
    this.baseUrl = baseUrl;
  }
  async login(credentials) {
    const res = await privateApi.post(`${this.baseUrl}/login`, credentials);
    return res.data;
  }

  async register(userData) {
    const res = await publicApi.post(`${this.baseUrl}/register`, userData);
    return res.data;
  }

  async logout() {
    const res = await publicApi.post(`${this.baseUrl}/logout`);
    return res.data;
  }
}

export const authService = new AuthService();
