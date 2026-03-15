import { apiService } from './api';

export interface PartnerRequestUser {
  userid: number;
  fullname: string;
  email: string;
  mobile: string;
  profile_image: string | null;
  status: number;
}

export interface PartnerRequest {
  id: number;
  type_of_establishment: string;
  name_of_establishment: string;
  ownership_of_property: string;
  working_days: number;
  opning_time: string;
  internet_type: string;
  no_of_seat_available_of_coworking: string;
  area_in_sqft: string;
  total_seating_capacity: string;
  cabins: boolean;
  current_occupancy_capacity: string;
  complete_address: string;
  pictures_of_the_space: Array<{ url: string }>;
  city: string;
  userid: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  statusText: string;
  createdAtFormatted: string;
  updatedAtFormatted: string;
  user: PartnerRequestUser;
}

export interface PartnerRequestListResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: PartnerRequest[];
  };
}

interface BasicApiResponse {
  status: boolean;
  message: string;
}

export const partnerRequestService = {
  async getPartnerRequests(
    page: number = 1,
    limit: number = 20,
    search: string = ''
  ): Promise<PartnerRequestListResponse> {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search.trim()) {
      query.set('search', search.trim());
    }

    const response = await apiService.authFetch(`/partner/list?${query.toString()}`, {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  },

  async updateUserStatus(userId: number, status: 1 | 2): Promise<BasicApiResponse> {
    const response = await apiService.authFetch(`/user/status/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  },
};
