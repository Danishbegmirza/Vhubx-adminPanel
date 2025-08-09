import { apiService } from './api';
const API_BASE_URL = "http://3.110.153.105:3000/api/v1";

export interface DashboardStats {
  totalUsers: number;
  totalPartners: number;
  totalProperties: number;
  totalBookings: number;
  totalSubUsers?: number;
}

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Using centralized auth fetch
      // Fetch users count
      const usersResponse = await apiService.authFetch(`${API_BASE_URL}/user/list?page=1&limit=1`, {
        method: 'GET'
      });

      // Fetch partners count
      const partnersResponse = await apiService.authFetch(`${API_BASE_URL}/vendor/list?page=1&limit=1`, {
        method: 'GET'
      });

      // Fetch properties count
      let propertiesUrl = `${API_BASE_URL}/property/list?page=1`;
      const storedUserType = localStorage.getItem('userType');
      const userTypeValue = storedUserType ? parseInt(storedUserType) : null;
      if (userTypeValue !== null && userTypeValue !== 2) {
        try {
          const userDataRaw = localStorage.getItem('userData');
          const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
          const organizationId = userData.organizationId ?? userData.organization_id ?? null;
          if (organizationId) {
            propertiesUrl += `&organization_id=${encodeURIComponent(String(organizationId))}`;
          }
        } catch (e) {
          console.warn('Failed to parse userData for organization_id', e);
        }
      }

      const propertiesResponse = await apiService.authFetch(propertiesUrl, {
        method: 'GET'
      });

      // Fetch sub users count
      const subUsersResponse = await apiService.authFetch(`${API_BASE_URL}/vendor/user/list?page=1&limit=1`, {
        method: 'GET'
      });

      // Parse responses
      const usersData = await usersResponse.json();
      const partnersData = await partnersResponse.json();
      const propertiesData = await propertiesResponse.json();
      const subUsersData = await subUsersResponse.json();

      return {
        totalUsers: usersData.status ? usersData.data.total : 0,
        totalPartners: partnersData.status ? partnersData.data.total : 0,
        totalProperties: propertiesData.status ? (propertiesData.data.spaceList?.length || 0) : 0,
        totalBookings: 0, // Placeholder for bookings count
        totalSubUsers: subUsersData.status ? (subUsersData.data?.total ?? 0) : 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
}; 