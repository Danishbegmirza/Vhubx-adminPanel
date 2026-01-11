import { apiService } from './api';

export interface Permission {
  edit: boolean;
  view: boolean;
  create: boolean;
  delete: boolean;
  export: boolean;
}

export interface ModulePermission {
  id: number;
  role_id: number;
  module_name: string;
  permissions: Permission;
}

export interface PermissionsResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: ModulePermission[];
}

export interface NavItem {
  title: string;
  path: string;
  icon: any;
  children?: NavItem[];
  moduleName: string;
}

export const permissionsService = {
  async getUserPermissions(userType: number): Promise<ModulePermission[]> {
    try {
      const response = await apiService.authFetch(`/role/permissions/detail/${userType}`);
      const data: PermissionsResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch permissions');
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      throw error;
    }
  },

  // Check if user has permission for a specific module and action
  hasPermission(permissions: ModulePermission[], moduleName: string, action: keyof Permission): boolean {
    const modulePermission = permissions.find(p => p.module_name === moduleName);
    return modulePermission?.permissions[action] || false;
  },

  // Get all available navigation items based on permissions
  getNavigationItems(permissions: ModulePermission[]): NavItem[] {
    // Get current user type from localStorage
    const userType = parseInt(localStorage.getItem('userType') || '0');
    
    const allNavItems: NavItem[] = [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: 'cilHome',
        moduleName: 'Dashboard'
      },
      {
        title: 'User Management',
        path: '/users',
        icon: 'cilPeople',
        moduleName: 'User Management',
        children: [
          {
            title: 'Add User',
            path: '/users/add',
            icon: 'cilPlus',
            moduleName: 'User Management'
          },
          {
            title: 'All Users',
            path: '/users/all',
            icon: 'cilList',
            moduleName: 'User Management'
          }
        ]
      },
      {
        title: 'Partner Management',
        path: '/partners',
        icon: 'cilHandshake',
        moduleName: 'Partner Management',
        children: [
          {
            title: 'Add Partner',
            path: '/partners/add',
            icon: 'cilUserPlus',
            moduleName: 'Partner Management'
          },
          {
            title: 'All Partners',
            path: '/partners/all',
            icon: 'cilList',
            moduleName: 'Partner Management'
          },
          {
            title: 'Partner Requests',
            path: '/partners/requests',
            icon: 'cilBell',
            moduleName: 'Partner Management'
          }
        ]
      },
      {
        title: 'Corporate Management',
        path: '/corporate',
        icon: 'cilBriefcase',
        moduleName: 'Corporate Management',
        children: [
          {
            title: 'Add Corporate User',
            path: '/corporate/add',
            icon: 'cilUserPlus',
            moduleName: 'Corporate Management'
          },
          {
            title: 'Corporate User List',
            path: '/corporate/list',
            icon: 'cilList',
            moduleName: 'Corporate Management'
          }
        ]
      },
      {
        title: 'Sub User Management',
        path: '/sub-users',
        icon: 'cilPeople',
        moduleName: 'Partner User',
        children: [
          {
            title: 'Add sub user',
            path: '/sub-users/add',
            icon: 'cilPlus',
            moduleName: 'Partner User'
          },
          {
            title: 'All sub users',
            path: '/sub-users/all',
            icon: 'cilList',
            moduleName: 'Partner User'
          }
        ]
      },
      {
        title: 'Role Management',
        path: '/roles',
        icon: 'cilShieldAlt',
        moduleName: 'Role Management',
        children: [
          {
            title: 'Add Role',
            path: '/roles/add',
            icon: 'cilPlus',
            moduleName: 'Role Management'
          },
          {
            title: 'List Roles',
            path: '/roles/list',
            icon: 'cilList',
            moduleName: 'Role Management'
          },
          {
            title: 'Role Permissions',
            path: '/roles/permissions/list',
            icon: 'cilList',
            moduleName: 'Role Management'
          }
        ]
      },
      {
        title: 'Property Management',
        path: '/property',
        icon: 'cilBuilding',
        moduleName: 'Property Management',
        children: [
          {
            title: 'Add Property',
            path: '/property/add',
            icon: 'cilPlus',
            moduleName: 'Property Management'
          },
          {
            title: 'List Property',
            path: '/property/list',
            icon: 'cilList',
            moduleName: 'Property Management'
          }
        ]
      },
      {
        title: 'Space Types',
        path: '/space-types',
        icon: 'cilBuilding',
        moduleName: 'Property Management',
        children: [
          {
            title: 'Space Types List',
            path: '/space-types/list',
            icon: 'cilList',
            moduleName: 'Property Management'
          },
          {
            title: 'Sub Types List',
            path: '/sub-types/list',
            icon: 'cilLayers',
            moduleName: 'Property Management'
          }
        ]
      },
      {
        title: 'Establishment Types',
        path: '/establishment',
        icon: 'cilBuilding',
        moduleName: 'Property Management',
        children: [
          {
            title: 'Add Establishment Type',
            path: '/establishment/add',
            icon: 'cilPlus',
            moduleName: 'Property Management'
          },
          {
            title: 'List Establishment Types',
            path: '/establishment/list',
            icon: 'cilList',
            moduleName: 'Property Management'
          }
        ]
      },
      {
        title: 'Blogs',
        path: '/blogs',
        icon: 'cilNewspaper',
        moduleName: 'Blogs',
        children: [
          {
            title: 'Add Blog',
            path: '/blogs/add',
            icon: 'cilPlus',
            moduleName: 'Blogs'
          },
          {
            title: 'All Blogs',
            path: '/blogs/all',
            icon: 'cilList',
            moduleName: 'Blogs'
          }
        ]
      },
      {
        title: 'Jobs',
        path: '/jobs',
        icon: 'cilBriefcase',
        moduleName: 'Jobs',
        children: [
          {
            title: 'Add Jobs',
            path: '/jobs/add',
            icon: 'cilPlus',
            moduleName: 'Jobs'
          },
          {
            title: 'List Jobs',
            path: '/jobs/list',
            icon: 'cilList',
            moduleName: 'Jobs'
          }
        ]
      },
      {
        title: 'Amenities & Facilities',
        path: '/amenities',
        icon: 'cilSettings',
        moduleName: 'Amenities Management',
        children: [
          {
            title: 'Add Amenity',
            path: '/amenities/add',
            icon: 'cilPlus',
            moduleName: 'Amenities Management'
          },
          {
            title: 'List Amenities',
            path: '/amenities/list',
            icon: 'cilList',
            moduleName: 'Amenities Management'
          }
        ]
      },
      {
        title: 'Requirements',
        path: '/requirements/list',
        icon: 'cilNewspaper',
        moduleName: 'Requirements'
      },
      {
        title: 'Payments',
        path: '/payments',
        icon: 'cilCreditCard',
        moduleName: 'Payments'
      },
      {
        title: 'Notifications',
        path: '/notifications',
        icon: 'cilBell',
        moduleName: 'Notifications'
      },
      {
        title: 'Support',
        path: '/support',
        icon: 'cilHeadphones',
        moduleName: 'Support'
      }
    ];

    // Always include Dashboard, then filter other navigation items based on permissions
    const dashboardItem = allNavItems[0]; // Dashboard is always first
    const otherNavItems = allNavItems.slice(1); // All items except Dashboard
    
    const filteredNavItems = otherNavItems.filter(navItem => {
      // Special handling for userType 4 (admin) - show Amenities Management even if permissions aren't set
      if (userType === 4 && navItem.moduleName === 'Amenities Management') {
        return true;
      }
      
      // Special handling for userType 4 (super admin) - show Requirements even if permissions aren't set
      if (userType === 4 && navItem.moduleName === 'Requirements') {
        return true;
      }
      
      // Special handling for userType 4 (super admin) - show Corporate Management
      if (userType === 4 && navItem.moduleName === 'Corporate Management') {
        return true;
      }
      
      // Special handling for userType 2 - show Corporate Management even if permissions aren't set
      if (userType === 2 && navItem.moduleName === 'Corporate Management') {
        return true;
      }
      
      // Check if user has view permission for this module
      const hasViewPermission = this.hasPermission(permissions, navItem.moduleName, 'view');
      
      if (!hasViewPermission) {
        return false;
      }

      // If item has children, filter them too
      if (navItem.children) {
        navItem.children = navItem.children.filter(child => {
          // Special handling for userType 4 (admin) - show Amenities Management children
          if (userType === 4 && child.moduleName === 'Amenities Management') {
            return true;
          }
          // Special handling for userType 4 (super admin) - show Corporate Management children
          if (userType === 4 && child.moduleName === 'Corporate Management') {
            return true;
          }
          // Special handling for userType 2 - show Corporate Management children
          if (userType === 2 && child.moduleName === 'Corporate Management') {
            return true;
          }
          return this.hasPermission(permissions, child.moduleName, 'view');
        });
        
        // Only show parent if it has visible children or is a direct link
        return navItem.children.length > 0 || !navItem.children;
      }

      return true;
    });

    // Return Dashboard + filtered items
    return [dashboardItem, ...filteredNavItems];
  }
}; 