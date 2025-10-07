import { apiService } from './api';
import { config } from '../config/env';

const API_BASE_URL = config.API_BASE_URL;

export interface CorporateUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  organizationName: string;
  mobile: string;
  userType: string;
  city: string;
  address: string;
  lat: string;
  long: string;
}

export interface CorporateUserListResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: any[];
  };
}

export const corporateService = {
  // Add corporate user
  async addCorporateUser(userData: CorporateUser): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('firstName', userData.firstName);
      formData.append('lastName', userData.lastName);
      formData.append('email', userData.email);
      if (userData.password) {
        formData.append('password', userData.password);
      }
      formData.append('organizationName', userData.organizationName);
      formData.append('mobile', userData.mobile);
      formData.append('userType', userData.userType);
      formData.append('city', userData.city);
      formData.append('address', userData.address);
      formData.append('lat', userData.lat);
      formData.append('long', userData.long);

      const response = await apiService.authFetch(`${API_BASE_URL}/corporate/add`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add corporate user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding corporate user:', error);
      throw error;
    }
  },

  // Get all corporate users
  async getCorporateUsers(): Promise<CorporateUserListResponse> {
    try {
      const response = await apiService.authFetch(`${API_BASE_URL}/corporate/list`, {
        method: 'GET'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch corporate users');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching corporate users:', error);
      throw error;
    }
  },

  // Update corporate user
  async updateCorporateUser(id: string, userData: Partial<CorporateUser>): Promise<any> {
    try {
      const formData = new FormData();
      
      if (userData.firstName) formData.append('firstName', userData.firstName);
      if (userData.lastName) formData.append('lastName', userData.lastName);
      if (userData.email) formData.append('email', userData.email);
      if (userData.password) formData.append('password', userData.password);
      if (userData.organizationName) formData.append('organizationName', userData.organizationName);
      if (userData.mobile) formData.append('mobile', userData.mobile);
      if (userData.userType) formData.append('userType', userData.userType);
      if (userData.city) formData.append('city', userData.city);
      if (userData.address) formData.append('address', userData.address);
      if (userData.lat) formData.append('lat', userData.lat);
      if (userData.long) formData.append('long', userData.long);

      const response = await apiService.authFetch(`${API_BASE_URL}/corporate/update/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update corporate user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating corporate user:', error);
      throw error;
    }
  },

  // Delete corporate user
  async deleteCorporateUser(id: string): Promise<any> {
    try {
      const response = await apiService.authFetch(`${API_BASE_URL}/corporate/delete/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete corporate user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting corporate user:', error);
      throw error;
    }
  }
};

