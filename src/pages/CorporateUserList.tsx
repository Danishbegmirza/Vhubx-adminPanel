import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilPlus, cilArrowBottom, cilPencil, cilTrash, cilArrowLeft } from '@coreui/icons';
import CustomAlert from '../components/CustomAlert';
import { corporateService } from '../services/corporateService';

interface CorporateUser {
  userid: number;
  fullname: string;
  email: string;
  mobile: string | null;
  status: number;
  user_type: string;
  createdAt: string;
  corporate_info: {
    id: number;
    userid: number;
    organization_name: string;
    city: string;
    complete_address: string;
    latitude: string;
    longitude: string;
    status: number;
  } | null;
}

const CorporateUserList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [corporateUsers, setCorporateUsers] = useState<CorporateUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Custom alert states
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    onConfirm: null as (() => void) | null
  });

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info', onConfirm?: () => void) => {
    setAlertConfig({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: onConfirm || null
    });
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleAlertConfirm = () => {
    if (alertConfig.onConfirm) {
      alertConfig.onConfirm();
    }
    closeAlert();
  };

  const handleAddCorporateUser = () => {
    navigate('/corporate/add');
  };

  const handleSearch = () => {
    // Implement search logic if needed
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchTerm('');
  };

  const fetchCorporateUsers = async () => {
    try {
      setLoading(true);
      const response = await corporateService.getCorporateUsers();
      
      if (response.status) {
        // The API returns data in response.data.data structure
        const users = response.data?.data || [];
        setCorporateUsers(users);
      } else {
        setError(response.message || 'Failed to fetch corporate users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching corporate users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    showAlert(
      'Confirm Delete',
      'Are you sure you want to delete this corporate user?',
      'warning',
      async () => {
        try {
          await corporateService.deleteCorporateUser(id.toString());
          showAlert('Success', 'Corporate user deleted successfully', 'success');
          fetchCorporateUsers();
        } catch (err) {
          showAlert('Error', 'Failed to delete corporate user', 'error');
        }
      }
    );
  };

  useEffect(() => {
    fetchCorporateUsers();
  }, []);

  const filteredUsers = corporateUsers.filter(user => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.fullname?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.corporate_info?.organization_name?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
          <button 
            className="btn btn-outline-danger ms-3" 
            onClick={() => fetchCorporateUsers()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
        <div className="card-body p-4">
          {/* Header Section */}
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h2 className="mb-1 fw-bold text-dark">Corporate User Management</h2>
              <p className="text-muted mb-0">Manage corporate users and their organizations</p>
            </div>
            <div className="d-flex gap-3">
              <button 
                className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2" 
                style={{ borderRadius: '8px' }}
                onClick={handleAddCorporateUser}
              >
                <CIcon icon={cilPlus} />
                Add Corporate User
              </button>
              <button className="btn btn-outline-secondary d-flex align-items-center gap-2 px-4 py-2" style={{ borderRadius: '8px' }}>
                <CIcon icon={cilArrowBottom} />
                Export
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="card mb-4 border-0" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <div className="card-body p-3">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex gap-2">
                    <div className="position-relative flex-grow-1">
                      <CIcon 
                        icon={cilSearch} 
                        className="position-absolute" 
                        style={{ 
                          left: '14px', 
                          top: '50%', 
                          transform: 'translateY(-50%)', 
                          color: '#6c757d',
                          fontSize: '16px'
                        }} 
                      />
                    
                      <input
                        type="text"
                        className="form-control ps-4 py-2"
                        style={{ backgroundColor: 'white', marginLeft: '10px', border: '1px solid #dee2e6' }}
                        placeholder="  Search corporate users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                    <button 
                      className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2" 
                      style={{ borderRadius: '8px', marginLeft: '10px' }}
                      onClick={handleSearch}
                    >
                      <CIcon icon={cilSearch} />
                      Search
                    </button>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex gap-2 justify-content-end">
                    <button 
                      className="btn btn-outline-secondary d-flex align-items-center gap-2 px-3 py-2" 
                      style={{ borderRadius: '8px' }}
                      onClick={handleReset}
                    >
                      <CIcon icon={cilArrowLeft} />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Corporate Users Table */}
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                  <th className="border-0 py-3 fw-semibold text-dark">Name</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Organization</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Email</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Mobile</th>
                  <th className="border-0 py-3 fw-semibold text-dark">City</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const nameParts = user.fullname?.split(' ') || ['U'];
                  const initials = nameParts.map(n => n[0]).join('').substring(0, 2).toUpperCase();
                  
                  return (
                    <tr key={user.userid} style={{ borderBottom: '1px solid #f8f9fa' }}>
                      <td className="py-3">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center me-3 text-white fw-medium"
                            style={{ 
                              width: '40px', 
                              height: '40px', 
                              fontSize: '14px',
                              backgroundColor: '#0d6efd'
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="fw-medium text-dark">{user.fullname || 'N/A'}</div>
                            <small className="text-muted">ID: {user.userid}</small>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-dark">{user.corporate_info?.organization_name || 'N/A'}</td>
                      <td className="py-3 text-dark">{user.email || 'N/A'}</td>
                      <td className="py-3 text-dark">{user.mobile || 'N/A'}</td>
                      <td className="py-3 text-dark">{user.corporate_info?.city || 'N/A'}</td>
                      <td className="py-3">
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center" 
                            style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                            title="Edit"
                            onClick={() => navigate(`/corporate/edit/${user.userid}`)}
                          >
                            <CIcon icon={cilPencil} />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center" 
                            style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                            title="Delete"
                            onClick={() => handleDelete(user.userid)}
                          >
                            <CIcon icon={cilTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      No corporate users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="d-flex justify-content-between align-items-center mt-4 pt-3" style={{ borderTop: '1px solid #dee2e6' }}>
            <div className="text-muted">
              Showing {filteredUsers.length} corporate user{filteredUsers.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
      <CustomAlert
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        onConfirm={handleAlertConfirm}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        showConfirm={alertConfig.type === 'warning'}
        confirmText={alertConfig.type === 'warning' ? 'Delete' : 'OK'}
        cancelText="Cancel"
      />
    </div>
  );
};

export default CorporateUserList;

