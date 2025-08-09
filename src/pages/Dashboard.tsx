import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilPeople, cilBasket, cilDollar, cilChart, cilHome } from '@coreui/icons';
import { dashboardService, DashboardStats } from '../services/dashboardService';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  console.log('Dashboard component rendered'); // Debug log
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPartners: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalSubUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const dashboardStats = await dashboardService.getDashboardStats();
        setStats(dashboardStats);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  const statsCards = [
    { 
      title: 'Total Users', 
      value: stats.totalUsers.toLocaleString(), 
      icon: cilPeople, 
      color: 'primary',
      route: '/users/all'
    },
    { 
      title: 'Total Partners', 
      value: stats.totalPartners.toLocaleString(), 
      icon: cilBasket, 
      color: 'success',
      route: '/partners/all'
    },
    { 
      title: 'Total Properties', 
      value: stats.totalProperties.toLocaleString(), 
      icon: cilDollar, 
      color: 'warning',
      route: '/property/list'
    },
    { 
      title: 'Bookings', 
      value: stats.totalBookings.toLocaleString(), 
      icon: cilChart, 
      color: 'info',
      route: '/bookings'
    },
  ];

  // Conditionally add Sub Users card if user has Partner User view permission
  const showSubUsers = hasPermission('Partner User', 'view');
  if (showSubUsers) {
    statsCards.push({
      title: 'Sub Users',
      value: (stats.totalSubUsers || 0).toLocaleString(),
      icon: cilPeople,
      color: 'secondary',
      route: '/sub-users/all'
    });
  }

  const recentActivities = [
    { user: 'John Doe', action: 'Added new property', time: '2 minutes ago', type: 'property' },
    { user: 'Jane Smith', action: 'Updated user profile', time: '5 minutes ago', type: 'user' },
    { user: 'Mike Johnson', action: 'Processed payment', time: '10 minutes ago', type: 'payment' },
    { user: 'Sarah Wilson', action: 'Created new listing', time: '15 minutes ago', type: 'listing' },
  ];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="page-header mb-4">
          <h1 className="page-title">
            <CIcon icon={cilHome} className="me-2" />
            Dashboard
          </h1>
          <p className="page-subtitle">Loading dashboard data...</p>
        </div>
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="page-header mb-4">
          <h1 className="page-title">
            <CIcon icon={cilHome} className="me-2" />
            Dashboard
          </h1>
          <p className="page-subtitle">Error loading dashboard data</p>
        </div>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="page-header mb-4">
        <h1 className="page-title">
          <CIcon icon={cilHome} className="me-2" />
          Dashboard
        </h1>
        <p className="page-subtitle">Welcome to your Admin Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {statsCards.map((stat, index) => (
          <div key={index} className="col-sm-6 col-lg-3 mb-3">
            <div 
              className="card stat-card" 
              style={{ cursor: 'pointer' }}
              onClick={() => handleCardClick(stat.route)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <CIcon icon={stat.icon} size="xl" className={`text-${stat.color}`} />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="fs-4 fw-semibold">{stat.value}</div>
                    <div className="text-muted">{stat.title}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Row */}
      <div className="row">
        {/* Recent Activities */}
        <div className="col-lg-8 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Recent Activities</h5>
            </div>
            <div className="card-body">
              <div className="activity-list">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="activity-item d-flex align-items-center py-3 border-bottom">
                    <div className="activity-icon me-3">
                      <div className={`activity-badge bg-${activity.type === 'property' ? 'primary' : activity.type === 'user' ? 'success' : activity.type === 'payment' ? 'warning' : 'info'} rounded-circle d-flex align-items-center justify-content-center`}>
                        <CIcon icon={cilPeople} size="sm" className="text-white" />
                      </div>
                    </div>
                    <div className="activity-content flex-grow-1">
                      <div className="fw-semibold">{activity.user}</div>
                      <div className="text-muted small">{activity.action}</div>
                    </div>
                    <div className="activity-time text-muted small">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/users/add')}
                >
                  <CIcon icon={cilPeople} className="me-2" />
                  Add New User
                </button>
                <button 
                  className="btn btn-success"
                  onClick={() => navigate('/property/add')}
                >
                  <CIcon icon={cilBasket} className="me-2" />
                  Add Property
                </button>
                <button 
                  className="btn btn-warning"
                  onClick={() => navigate('/payments')}
                >
                  <CIcon icon={cilDollar} className="me-2" />
                  View Payments
                </button>
                <button className="btn btn-info">
                  <CIcon icon={cilChart} className="me-2" />
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">System Overview</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>System Status</h6>
                  <div className="d-flex align-items-center mb-2">
                    <div className="status-indicator bg-success me-2"></div>
                    <span>All systems operational</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <div className="status-indicator bg-success me-2"></div>
                    <span>Database connected</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <div className="status-indicator bg-success me-2"></div>
                    <span>API services running</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <h6>Quick Stats</h6>
                  <div className="row">
                    <div className="col-6">
                      <div className="text-center">
                        <div className="fs-4 fw-bold text-primary">98%</div>
                        <div className="text-muted small">Uptime</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center">
                        <div className="fs-4 fw-bold text-success">1.2s</div>
                        <div className="text-muted small">Avg Response</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 