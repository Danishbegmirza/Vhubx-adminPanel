import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CSidebar, CSidebarBrand, CSidebarNav, CNavItem, CNavGroup, CNavLink } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilHome, cilPeople, cilHandshake, cilShieldAlt, cilBuilding, 
  cilNewspaper, cilBriefcase, cilCreditCard, cilBell, cilHeadphones,
  cilPlus, cilList, cilUserPlus
} from '@coreui/icons';
import { useAuth } from '../contexts/AuthContext';
import { permissionsService, NavItem } from '../services/permissionsService';

// Type casting for CoreUI components
const CSidebarComponent = CSidebar as React.ComponentType<any>;
const CSidebarBrandComponent = CSidebarBrand as React.ComponentType<any>;
const CSidebarNavComponent = CSidebarNav as React.ComponentType<any>;
const CNavItemComponent = CNavItem as React.ComponentType<any>;
const CNavGroupComponent = CNavGroup as React.ComponentType<any>;
const CNavLinkComponent = CNavLink as React.ComponentType<any>;

// Icon mapping
const iconMap: { [key: string]: any } = {
  cilHome,
  cilPeople,
  cilHandshake,
  cilShieldAlt,
  cilBuilding,
  cilNewspaper,
  cilBriefcase,
  cilCreditCard,
  cilBell,
  cilHeadphones,
  cilPlus,
  cilList,
  cilUserPlus
};

interface DynamicSidebarProps {
  sidebarVisible: boolean;
  setSidebarVisible: (visible: boolean) => void;
}

const DynamicSidebar: React.FC<DynamicSidebarProps> = ({ sidebarVisible, setSidebarVisible }) => {
  const location = useLocation();
  const { permissions } = useAuth();
  
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Get navigation items based on permissions
  const navigationItems = permissionsService.getNavigationItems(permissions);

  const renderNavItem = (item: NavItem) => {
    const IconComponent = iconMap[item.icon];
    
    if (item.children && item.children.length > 0) {
      return (
        <CNavGroupComponent 
          key={item.path}
          toggler={
            <span className="d-flex align-items-center">
              <CIcon icon={IconComponent} customClassName="nav-icon me-2" />
              {item.title}
            </span>
          } 
          className="nav-group"
        >
          {item.children.map((child) => {
            const ChildIconComponent = iconMap[child.icon];
            return (
              <CNavItemComponent 
                key={child.path} 
                className={`nav-item ${isActive(child.path) ? 'active' : ''}`}
              >
                <Link to={child.path} className="nav-link d-flex align-items-center">
                  <CIcon icon={ChildIconComponent} customClassName="nav-icon" />
                  {child.title}
                </Link>
              </CNavItemComponent>
            );
          })}
        </CNavGroupComponent>
      );
    } else {
      return (
        <CNavItemComponent 
          key={item.path} 
          className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
        >
          <Link to={item.path} className="nav-link d-flex align-items-center">
            <CIcon icon={IconComponent} customClassName="nav-icon" />
            {item.title}
          </Link>
        </CNavItemComponent>
      );
    }
  };

  return (
    <CSidebarComponent 
      position="fixed" 
      visible={sidebarVisible} 
      onVisibleChange={(visible: boolean) => setSidebarVisible(visible)} 
      className="sidebar-dark"
    >
      <CSidebarBrandComponent className="sidebar-brand">
        <div className="d-flex align-items-center">
          <h5 style={{marginLeft:60}} className="mb-0 text-white">Vhubx</h5>
        </div>
      </CSidebarBrandComponent>
      <CSidebarNavComponent className="sidebar-nav">
        {navigationItems.map(renderNavItem)}
      </CSidebarNavComponent>
      <div className="sidebar-footer">
        <small className="text-muted">Admin Panel v2.0</small>
      </div>
    </CSidebarComponent>
  );
};

export default DynamicSidebar; 