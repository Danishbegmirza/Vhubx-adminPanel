import { apiService } from './api';

export interface EstablishmentType {
  id: number;
  establishment_type: string;
  status: number;
}

export interface EstablishmentTypeResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    total: number;
    currentPage: number;
    totalPages: number;
    data: EstablishmentType[];
  };
}

export interface CreateEstablishmentTypeRequest {
  establishment_type: string;
}

export interface UpdateEstablishmentTypeRequest {
  establishment_type: string;
  status: number;
}

export const establishmentService = {
  async getEstablishmentTypes(): Promise<EstablishmentType[]> {
    try {
      const response = await apiService.authFetch('/workspace/establishment/list');
      const data: EstablishmentTypeResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch establishment types');
      }
      
      return data.data.data || [];
    } catch (error) {
      console.error('Error fetching establishment types:', error);
      throw error;
    }
  },

  async createEstablishmentType(establishmentType: CreateEstablishmentTypeRequest): Promise<EstablishmentType> {
    try {
      const response = await apiService.authFetch('/workspace/establishment', {
        method: 'POST',
        body: JSON.stringify(establishmentType),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create establishment type');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error creating establishment type:', error);
      throw error;
    }
  },

  async updateEstablishmentType(id: number, establishmentType: UpdateEstablishmentTypeRequest): Promise<EstablishmentType> {
    try {
      const response = await apiService.authFetch(`/workspace/establishment/${id}`, {
        method: 'PUT',
        body: JSON.stringify(establishmentType),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update establishment type');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error updating establishment type:', error);
      throw error;
    }
  },

  async deleteEstablishmentType(id: number): Promise<void> {
    try {
      const response = await apiService.authFetch(`/workspace/establishment/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete establishment type');
      }
    } catch (error) {
      console.error('Error deleting establishment type:', error);
      throw error;
    }
  },

  async getEstablishmentTypeById(id: number): Promise<EstablishmentType> {
    try {
      const response = await apiService.authFetch(`/workspace/establishment/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch establishment type');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching establishment type:', error);
      throw error;
    }
  }
}; 