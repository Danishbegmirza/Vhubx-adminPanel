import { apiService } from './api';
import { config } from '../config/env';

const API_BASE_URL = config.API_BASE_URL;

export interface Enquiry {
  id: number;
  name: string;
  mobile: string;
  email: string;
  is_seen: number;
}

export interface EnquiryListResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: Enquiry[];
  };
}

export const enquiryService = {
  // Get all enquiries with pagination
  async getEnquiries(page: number = 1, limit: number = 10): Promise<EnquiryListResponse> {
    try {
      const response = await apiService.authFetch(
        `${API_BASE_URL}/enquiry/list?page=${page}&limit=${limit}`,
        {
          method: 'GET'
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch enquiries');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      throw error;
    }
  },

  // Mark enquiry as seen
  async markAsSeen(id: number): Promise<any> {
    try {
      const response = await apiService.authFetch(
        `${API_BASE_URL}/enquiry/${id}/mark-seen`,
        {
          method: 'PATCH'
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to mark enquiry as seen');
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking enquiry as seen:', error);
      throw error;
    }
  },

  // Delete enquiry
  async deleteEnquiry(id: number): Promise<any> {
    try {
      const response = await apiService.authFetch(
        `${API_BASE_URL}/enquiry/${id}/delete`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete enquiry');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      throw error;
    }
  }
};
