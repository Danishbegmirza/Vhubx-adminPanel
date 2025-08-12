import { apiService } from './api';
import { config } from '../config/env';

const API_BASE_URL = config.API_BASE_URL;

export interface SpaceType {
  id: number;
  name: string;
  description: string;
  parentId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSpaceTypeRequest {
  name: string;
  description: string;
  parentId?: number;
}

export interface UpdateSpaceTypeRequest {
  name: string;
  description: string;
  parentId?: number;
}

export interface SpaceTypeResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: SpaceType[];
}

export const spaceTypeService = {
  async getSpaceTypes(): Promise<SpaceType[]> {
    try {
      const response = await apiService.authFetch(`${API_BASE_URL}/property/category`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch space types');
      }

      const data: SpaceTypeResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching space types:', error);
      throw error;
    }
  },

  async createSpaceType(spaceType: CreateSpaceTypeRequest): Promise<SpaceType> {
    try {
      const response = await apiService.authFetch(`${API_BASE_URL}/property/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spaceType)
      });

      if (!response.ok) {
        throw new Error('Failed to create space type');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating space type:', error);
      throw error;
    }
  },

  async updateSpaceType(id: number, spaceType: UpdateSpaceTypeRequest): Promise<SpaceType> {
    try {
      const response = await apiService.authFetch(`${API_BASE_URL}/property/category/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spaceType)
      });

      if (!response.ok) {
        throw new Error('Failed to update space type');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating space type:', error);
      throw error;
    }
  },

  async deleteSpaceType(id: number): Promise<void> {
    try {
      const response = await apiService.authFetch(`${API_BASE_URL}/property/category/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete space type');
      }
    } catch (error) {
      console.error('Error deleting space type:', error);
      throw error;
    }
  }
}; 