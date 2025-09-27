import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { CHeader, CHeaderBrand, CHeaderToggler, CHeaderNav, CContainer, CCol, CRow, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider, CNavItem, CNavLink } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBell, cilAccountLogout, cilSettings, cilUser, cilChevronLeft, cilChevronRight } from '@coreui/icons';
import '@coreui/coreui/dist/css/coreui.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import AuthProvider and useAuth
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import DynamicSidebar
import DynamicSidebar from './components/DynamicSidebar';

// Import pages
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import AddUser from './pages/AddUser';
import AllUsers from './pages/AllUsers';
import Products from './pages/Products';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import AddJobs from './pages/AddJobs';
import ListJobs from './pages/ListJobs';
import AddBlog from './pages/AddBlog';
import AllBlogs from './pages/AllBlogs';
import EditBlog from './pages/EditBlog';
import PartnerRequests from './pages/PartnerRequests';
import AddPartner from './pages/AddPartner';
import AllPartners from './pages/AllPartners';
import EditPartner from './pages/EditPartner';
import AddRole from './pages/AddRole';
import ListRoles from './pages/ListRoles';
import EditRole from './pages/EditRole';
import AddProperty from './pages/AddProperty';
import PropertyList from './pages/PropertyList';
import Profile from './pages/Profile';
import Payments from './pages/Payments';
import Notifications from './pages/Notifications';
import Support from './pages/Support';
import RolePermissionList from './pages/RolePermissionList';
import AddEditRolePermission from './pages/AddEditRolePermission';
import PermissionsTest from './components/PermissionsTest';
import AllSubUsers from './pages/AllSubUsers';
import AddSubUser from './pages/AddSubUser';
import EstablishmentList from './pages/EstablishmentList';
import AddEstablishment from './pages/AddEstablishment';
import EditEstablishment from './pages/EditEstablishment';
import SpaceTypeList from './pages/SpaceTypeList';
import SubTypeList from './pages/SubTypeList';
import AddAmenityMaster from './pages/AddAmenityMaster';
import ListAmenitiesMaster from './pages/ListAmenitiesMaster';

// Import components
import ProtectedRoute from './components/ProtectedRoute';

// Type casting for CoreUI components
const CHeaderComponent = CHeader as React.ComponentType<any>;
const CHeaderBrandComponent = CHeaderBrand as React.ComponentType<any>;
const CHeaderTogglerComponent = CHeaderToggler as React.ComponentType<any>;
const CHeaderNavComponent = CHeaderNav as React.ComponentType<any>;
const CContainerComponent = CContainer as React.ComponentType<any>;
const CDropdownComponent = CDropdown as React.ComponentType<any>;
const CDropdownToggleComponent = CDropdownToggle as React.ComponentType<any>;
const CDropdownMenuComponent = CDropdownMenu as React.ComponentType<any>;
const CDropdownItemComponent = CDropdownItem as React.ComponentType<any>;
const CDropdownDividerComponent = CDropdownDivider as React.ComponentType<any>;
const CNavItemComponent = CNavItem as React.ComponentType<any>;
const CNavLinkComponent = CNavLink as React.ComponentType<any>;

// Authenticated Layout Component
const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = React.useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('sidebarVisible');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  console.log('AuthenticatedLayout - rendering authenticated layout'); // Debug log

  React.useEffect(() => {
    try {
      localStorage.setItem('sidebarVisible', JSON.stringify(sidebarVisible));
    } catch {}
  }, [sidebarVisible]);

  const handleLogout = () => {
    logout();
    // Clear any additional localStorage items if needed
    localStorage.clear(); // This will clear all localStorage
    // Navigate to login page
    navigate('/login');
  };

  return (
    <>
      <DynamicSidebar sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible} />
      <div className={`wrapper d-flex flex-column min-vh-100 bg-light ${sidebarVisible ? 'sidebar-open' : 'sidebar-closed'}`}>
        <CHeaderComponent className="header header-sticky mb-4 bg-white">
          <CContainerComponent fluid>
            <div className="header-top-row d-flex align-items-center justify-content-between">
              {/* Left Section - Toggle Arrow and Dashboard Title */}
              <div className="header-left-section d-flex align-items-center">
                <div className="toggle-arrow-container me-3">
                  <CHeaderTogglerComponent
                    className="toggle-arrow-btn"
                    onClick={() => setSidebarVisible(!sidebarVisible)}
                  >
                    <CIcon icon={sidebarVisible ? cilChevronLeft : cilChevronRight} size="lg" />
                  </CHeaderTogglerComponent>
                </div>
                
                <div className="header-brand-section">
                  <CHeaderBrandComponent className="d-md-none">
                    <h4 className="mb-0">Real Estate Admin</h4>
                  </CHeaderBrandComponent>
                  <div className="d-none d-md-block">
                    <h2 className="mb-0">Vhubx Admin Dashboard</h2>
                    <p className="text-muted mb-0">Complete management platform</p>
                  </div>
                </div>
              </div>
              
                              {/* Right Section - User Actions */}
                <CHeaderNavComponent className="header-right-section">
                  <CNavItemComponent>
                    <CNavLinkComponent href="#" className="position-relative">
                      <CIcon icon={cilBell} size="lg" />
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                        3
                      </span>
                    </CNavLinkComponent>
                  </CNavItemComponent>
                  <CNavItemComponent>
                    <CDropdownComponent>
                      <CDropdownToggleComponent className="d-flex align-items-center">
                        <div className="avatar-circle me-2">
                          <span>SA</span>
                        </div>
                      </CDropdownToggleComponent>
                      <CDropdownMenuComponent>
                        <CDropdownItemComponent onClick={() => navigate('/profile')}>
                          <CIcon icon={cilUser} className="me-2" />
                          Profile
                        </CDropdownItemComponent>
                        <CDropdownItemComponent>
                          <CIcon icon={cilSettings} className="me-2" />
                          Settings
                        </CDropdownItemComponent>
                        <CDropdownDividerComponent />
                        <CDropdownItemComponent onClick={handleLogout}>
                          <CIcon icon={cilAccountLogout} className="me-2" />
                          Logout
                        </CDropdownItemComponent>
                      </CDropdownMenuComponent>
                    </CDropdownComponent>
                  </CNavItemComponent>
                </CHeaderNavComponent>
            </div>
          </CContainerComponent>
        </CHeaderComponent>
        
        <div className={`body flex-grow-1 px-3 ${sidebarVisible ? 'content-with-sidebar' : 'content-full-width'}`}>
          <CContainerComponent fluid>
            {children}
          </CContainerComponent>
        </div>
      </div>
    </>
  );
};



// Main App Content Component
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Also check localStorage directly for debugging
  const tokenFromStorage = localStorage.getItem('adminToken');
  const userDataFromStorage = localStorage.getItem('userData');
  
  console.log('AppContent - isAuthenticated:', isAuthenticated); // Debug log
  console.log('AppContent - current pathname:', window.location.pathname); // Debug log
  console.log('AppContent - token from storage:', tokenFromStorage); // Debug log
  console.log('AppContent - user data from storage:', userDataFromStorage); // Debug log
  
  // Use both context and localStorage for authentication check
  const isAuthFromContext = isAuthenticated;
  const isAuthFromStorage = !!tokenFromStorage && !!userDataFromStorage;
  const finalIsAuthenticated = isAuthFromContext || isAuthFromStorage;
  
  console.log('AppContent - final authentication check:', finalIsAuthenticated); // Debug log
  
  return (
    <div className="c-app">
      <Routes>
        {/* Login Routes */}
        <Route path="/" element={!finalIsAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/admin" element={!finalIsAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/login" element={!finalIsAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        
        {/* Authenticated Routes */}
        <Route path="/dashboard" element={finalIsAuthenticated ? <AuthenticatedLayout><Dashboard /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/users" element={finalIsAuthenticated ? <AuthenticatedLayout><Users /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/users/add" element={finalIsAuthenticated ? <AuthenticatedLayout><AddUser /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/users/all" element={finalIsAuthenticated ? <AuthenticatedLayout><AllUsers /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/products" element={finalIsAuthenticated ? <AuthenticatedLayout><Products /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/analytics" element={finalIsAuthenticated ? <AuthenticatedLayout><Analytics /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/settings" element={finalIsAuthenticated ? <AuthenticatedLayout><Settings /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/partners/add" element={finalIsAuthenticated ? <AuthenticatedLayout><AddPartner /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/partners/all" element={finalIsAuthenticated ? <AuthenticatedLayout><AllPartners /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/partners/edit/:id" element={finalIsAuthenticated ? <AuthenticatedLayout><EditPartner /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/partners/requests" element={finalIsAuthenticated ? <AuthenticatedLayout><PartnerRequests /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/roles/add" element={finalIsAuthenticated ? <AuthenticatedLayout><AddRole /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/roles/list" element={finalIsAuthenticated ? <AuthenticatedLayout><ListRoles /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/roles/edit/:id" element={finalIsAuthenticated ? <AuthenticatedLayout><EditRole /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/roles/permissions/list" element={finalIsAuthenticated ? <AuthenticatedLayout><RolePermissionList /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/roles/permissions/add" element={finalIsAuthenticated ? <AuthenticatedLayout><AddEditRolePermission /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/roles/permissions/edit/:id" element={finalIsAuthenticated ? <AuthenticatedLayout><AddEditRolePermission /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/property/add" element={finalIsAuthenticated ? <AuthenticatedLayout><AddProperty /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/property/list" element={finalIsAuthenticated ? <AuthenticatedLayout><PropertyList /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/profile" element={finalIsAuthenticated ? <AuthenticatedLayout><Profile /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/blogs/add" element={finalIsAuthenticated ? <AuthenticatedLayout><AddBlog /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/blogs/all" element={finalIsAuthenticated ? <AuthenticatedLayout><AllBlogs /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/blogs/edit/:id" element={finalIsAuthenticated ? <AuthenticatedLayout><EditBlog /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/jobs/add" element={finalIsAuthenticated ? <AuthenticatedLayout><AddJobs /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/jobs/list" element={finalIsAuthenticated ? <AuthenticatedLayout><ListJobs /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/payments" element={finalIsAuthenticated ? <AuthenticatedLayout><Payments /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/notifications" element={finalIsAuthenticated ? <AuthenticatedLayout><Notifications /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/support" element={finalIsAuthenticated ? <AuthenticatedLayout><Support /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/permissions-test" element={finalIsAuthenticated ? <AuthenticatedLayout><PermissionsTest /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/sub-users/add" element={finalIsAuthenticated ? <AuthenticatedLayout><AddSubUser /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/sub-users/all" element={finalIsAuthenticated ? <AuthenticatedLayout><AllSubUsers /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/establishment/list" element={finalIsAuthenticated ? <AuthenticatedLayout><EstablishmentList /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/establishment/add" element={finalIsAuthenticated ? <AuthenticatedLayout><AddEstablishment /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/establishment/edit/:id" element={finalIsAuthenticated ? <AuthenticatedLayout><EditEstablishment /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/space-types/list" element={finalIsAuthenticated ? <AuthenticatedLayout><SpaceTypeList /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/sub-types/list" element={finalIsAuthenticated ? <AuthenticatedLayout><SubTypeList /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        
        {/* Amenities Routes */}
        <Route path="/amenities/add" element={finalIsAuthenticated ? <AuthenticatedLayout><AddAmenityMaster /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
        <Route path="/amenities/list" element={finalIsAuthenticated ? <AuthenticatedLayout><ListAmenitiesMaster /></AuthenticatedLayout> : <Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
