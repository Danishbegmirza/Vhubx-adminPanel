import { apiService } from './api';
import { config } from '../config/env';

const API_BASE_URL = config.API_BASE_URL;

export interface Requirement {
  id: number;
  name: string;
  mobile: string;
  email: string;
  interested_in: string;
  company_name: string;
  team_size: string;
  is_seen: number;
}

export interface RequirementListResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: Requirement[];
  };
}

export const requirementService = {
  // Get all requirements with pagination
  async getRequirements(page: number = 1, limit: number = 10): Promise<RequirementListResponse> {
    try {
      const response = await apiService.authFetch(
        `${API_BASE_URL}/requirement/list?page=${page}&limit=${limit}`,
        {
          method: 'GET'
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch requirements');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching requirements:', error);
      throw error;
    }
  },

  // Mark requirement as seen
  async markAsSeen(id: number): Promise<any> {
    try {
      const response = await apiService.authFetch(
        `${API_BASE_URL}/requirement/${id}/mark-seen`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to mark requirement as seen');
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking requirement as seen:', error);
      throw error;
    }
  },

  // Delete requirement
  async deleteRequirement(id: number): Promise<any> {
    try {
      const response = await apiService.authFetch(
        `${API_BASE_URL}/requirement/${id}/delete`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete requirement');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting requirement:', error);
      throw error;
    }
  }
};
