import { apiService } from './api';
import { config } from '../config/env';

const API_BASE_URL = config.API_BASE_URL;

export interface Amenity {
  id: number;
  key: string;
  label: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAmenityRequest {
  key: string;
  label: string;
  category: string;
}

export interface UpdateAmenityRequest {
  key: string;
  label: string;
  category: string;
}

export interface AmenitiesResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: Amenity[];
}

export interface AmenityResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: Amenity;
}

export const amenityService = {
  async getAmenities(): Promise<Amenity[]> {
    try {
      const response = await apiService.authFetch(`${API_BASE_URL}/admin/amenity-master/list`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch amenities');
      }

      const data: AmenitiesResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching amenities:', error);
      throw error;
    }
  },

  async createAmenity(amenity: CreateAmenityRequest): Promise<Amenity> {
    try {
      const response = await apiService.authFetch(`${API_BASE_URL}/admin/amenity-master/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(amenity)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create amenity');
      }

      const data: AmenityResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating amenity:', error);
      throw error;
    }
  },

  async updateAmenity(id: number, amenity: UpdateAmenityRequest): Promise<Amenity> {
    try {
      const response = await apiService.authFetch(`${API_BASE_URL}/admin/amenity-master/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(amenity)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update amenity');
      }

      const data: AmenityResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating amenity:', error);
      throw error;
    }
  },

  async deleteAmenity(id: number): Promise<void> {
    try {
      const response = await apiService.authFetch(`${API_BASE_URL}/admin/amenity-master/delete/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete amenity');
      }
    } catch (error) {
      console.error('Error deleting amenity:', error);
      throw error;
    }
  }
};
