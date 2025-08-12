import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilPlus, cilArrowBottom, cilFilter, cilCheck, cilX, cilArrowLeft } from '@coreui/icons';
import CustomAlert from '../components/CustomAlert';
import { apiService } from '../services/api';
import { config } from '../config/env';

interface User {
  userid: number;
  fullname: string;
  email: string;
  mobile: string;
  status: number;
  user_type: string;
  profile_image: string | null;
  device_id: string | null;
  otp: number | null;
  createdAt: string;
  updatedAt: string;
  userText: string;
}

interface ApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: User[];
  };
}

const AllUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<User | null>(null);
  
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

  const handleAddUser = () => {
    navigate('/users/add');
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchQuery('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const fetchUsers = async (page: number = 1, search: string = '', status: string = 'all') => {
    try {
      setLoading(true);
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const statusParam = status !== 'all' ? `&status=${status}` : '';
      const response = await apiService.authFetch(`${config.API_BASE_URL}/user/list?page=${page}&limit=10${searchParam}${statusParam}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.status) {
        setUsers(data.data.data);
        setTotalUsers(data.data.total);
        setTotalPages(Math.ceil(data.data.total / data.data.limit));
        setCurrentPage(data.data.page);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: number) => {
    if (!selectedRequest?.userid) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await apiService.authFetch(
        `${config.API_BASE_URL}/user/status/${selectedRequest.userid}`,
        {
          method: 'PUT',
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert(status === 1 ? 'Accepted!' : 'Rejected!');
      // Refresh the user list
      await fetchUsers(currentPage, searchQuery, statusFilter);
    } catch (err) {
      setActionError('Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = (user: User) => {
    setSelectedRequest(user);
    handleStatusChange(1);
  };

  const handleReject = (user: User) => {
    setSelectedRequest(user);
    handleStatusChange(2);
  };

  useEffect(() => {
    fetchUsers(currentPage, searchQuery, statusFilter);
  }, [currentPage, searchQuery, statusFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredUsers = users;

  const getStatusBadge = (status: number) => {
    return status === 1 ? 'badge bg-primary' : 'badge bg-danger';
  };

  const getStatusText = (status: number) => {
    return status === 1 ? 'Active' : 'Inactive';
  };

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
            onClick={() => fetchUsers(currentPage)}
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
              <h2 className="mb-1 fw-bold text-dark">User Management</h2>
              <p className="text-muted mb-0">Manage users, roles, and access permissions</p>
            </div>
            <div className="d-flex gap-3">
              <button 
                className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2" 
                style={{ borderRadius: '8px' }}
                onClick={handleAddUser}
              >
                <CIcon icon={cilPlus} />
                Add User
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
                        placeholder="  Search users..."
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
                    <select
                      className="form-select"
                      style={{ backgroundColor: 'white', maxWidth: '120px', border: '1px solid #dee2e6' }}
                      value={statusFilter}
                      onChange={(e) => handleStatusFilterChange(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="1">Active</option>
                      <option value="2">Inactive</option>
                    </select>
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

          {/* Users Table */}
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                  <th className="border-0 py-3 fw-semibold text-dark">Name</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Email</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Mobile</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Status</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Created At</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.userid} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td className="py-3">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center me-3 text-white fw-medium"
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            fontSize: '14px',
                            backgroundColor: '#6c757d'
                          }}
                        >
                          {user.fullname ? user.fullname.split(' ').map(n => n[0]).join('') : 'U'}
                        </div>
                        <div>
                          <div className="fw-medium text-dark">{user.fullname || 'N/A'}</div>
                          <small className="text-muted">ID: {user.userid}</small>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-dark">{user.email || 'N/A'}</td>
                    <td className="py-3 text-dark">{user.mobile || 'N/A'}</td>
                    <td className="py-3">
                      <span className={`${getStatusBadge(user.status)} px-3 py-1`} style={{ borderRadius: '20px', fontSize: '12px' }}>
                        {getStatusText(user.status)}
                      </span>
                    </td>
                    <td className="py-3">
                      <small className="text-muted">{user.createdAt}</small>
                    </td>
                    <td className="py-3">
                      <div className="d-flex gap-2">
                        {/* <button 
                          className="btn btn-sm btn-outline-success d-flex align-items-center justify-content-center" 
                          style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                          title="Accept"
                          onClick={() => handleAccept(user)}
                          disabled={actionLoading}
                        >
                          ✓
                        </button> */}
                        <button 
                          className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center" 
                          style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                          title="Reject"
                          onClick={() => handleReject(user)}
                          disabled={actionLoading}
                        >
                          ✗
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-4 pt-3" style={{ borderTop: '1px solid #dee2e6' }}>
            <div className="text-muted">
              Showing {filteredUsers.length} of {totalUsers} users
            </div>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link border-0" 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ borderRadius: '6px', marginRight: '4px' }}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button 
                      className="page-link border-0" 
                      onClick={() => handlePageChange(page)}
                      style={{ borderRadius: '6px', marginRight: '4px' }}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link border-0" 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ borderRadius: '6px' }}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
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
      />
    </div>
  );
};

export default AllUsers; 