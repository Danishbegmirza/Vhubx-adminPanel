import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilPlus, cilArrowBottom, cilFilter, cilCheck, cilX, cilArrowLeft, cilPencil, cilTrash, cilMap, cilBuilding, cilPhone, cilEnvelopeOpen } from '@coreui/icons';
import CustomAlert from '../components/CustomAlert';
import { apiService } from '../services/api';
import { config } from '../config/env';

interface Partner {
  id: number;
  organization_id: number | null;
  fullname: string;
  email: string;
  mobile: string;
  user_type: string;
  profile_image: string | null;
  device_id: string | null;
  type_of_establishment: string;
  name_of_establishment: string;
  ownership_of_property: string;
  working_days: string;
  opening_time: string | null;
  internet_type: string;
  no_of_seat_available_of_coworking: number;
  area_in_sqft: number;
  total_seating_capacity: number;
  cabins: number;
  current_occupancy_capacity: number;
  complete_address: string;
  pictures_of_the_space: string | null;
  city: string;
  status: number;
  userText: string;
  created_at: string;
}

interface ApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: Partner[];
  };
}

const AllPartners = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPartners, setTotalPartners] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [cities, setCities] = useState<string[]>([]);
  
  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  
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

  const handleAddPartner = () => {
    navigate('/partners/add');
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

  const handleCityFilterChange = (city: string) => {
    setCityFilter(city);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchQuery('');
    setSelectedFilter('all');
    setStatusFilter('all');
    setCityFilter('all');
    setCurrentPage(1);
  };

  const fetchPartners = async (page: number = 1, search: string = '', status: string = 'all', city: string = 'all') => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `${config.API_BASE_URL}/vendor/list?page=${page}&limit=10`;
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      if (status !== 'all') {
        url += `&status=${status}`;
      }
      
      if (city !== 'all') {
        url += `&city=${encodeURIComponent(city)}`;
      }

      const response = await apiService.authFetch(url, {
        method: 'GET'
      });

      if (response.ok) {
        const result: ApiResponse = await response.json();
        setPartners(result.data.data);
        setTotalPartners(result.data.total);
        setTotalPages(Math.ceil(result.data.total / result.data.limit));
        
        // Extract unique cities for filter
        const uniqueCities = Array.from(new Set(result.data.data.map(partner => partner.city)));
        setCities(uniqueCities);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Failed to fetch partners');
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
      setError('An error occurred while fetching partners');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (partnerId: number, newStatus: number) => {
    setActionLoading(true);
    setActionError(null);
    
    try {
      const response = await apiService.authFetch(`${config.API_BASE_URL}/vendor/status/${partnerId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        showAlert('Success', 'Partner status updated successfully', 'success');
        // Refresh the partners list
        fetchPartners(currentPage, searchQuery, statusFilter, cityFilter);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setActionError(errorData.message || 'Failed to update partner status');
        showAlert('Error', errorData.message || 'Failed to update partner status', 'error');
      }
    } catch (error) {
      console.error('Error updating partner status:', error);
      setActionError('An error occurred while updating partner status');
      showAlert('Error', 'An error occurred while updating partner status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (partner: Partner) => {
    setSelectedPartner(partner);
    showAlert(
      'Confirm Delete',
      `Are you sure you want to delete ${partner.name_of_establishment}? This action cannot be undone.`,
      'warning',
      () => {
        if (selectedPartner) {
          deletePartner(selectedPartner.id);
        }
      }
    );
  };

  const deletePartner = async (partnerId: number) => {
    setActionLoading(true);
    setActionError(null);
    
    try {
      const response = await apiService.authFetch(`${config.API_BASE_URL}/vendor/delete/${partnerId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showAlert('Success', 'Partner deleted successfully', 'success');
        // Refresh the partners list
        fetchPartners(currentPage, searchQuery, statusFilter, cityFilter);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setActionError(errorData.message || 'Failed to delete partner');
        showAlert('Error', errorData.message || 'Failed to delete partner', 'error');
      }
    } catch (error) {
      console.error('Error deleting partner:', error);
      setActionError('An error occurred while deleting partner');
      showAlert('Error', 'An error occurred while deleting partner', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (partner: Partner) => {
    // Navigate to edit page with partner data
    navigate(`/partners/edit/${partner.id}`, { state: { partner } });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status: number, userText?: string) => {
    switch (status) {
      case 1:
        return <span className="badge bg-success">Active</span>;
      case 0:
        return <span className="badge bg-warning">Pending</span>;
      case 3:
        return <span className="badge bg-danger">Suspended</span>;
      default:
        return <span className="badge bg-secondary">{userText || 'Unknown'}</span>;
    }
  };

  const getStatusText = (status: number, userText?: string) => {
    switch (status) {
      case 1:
        return 'Active';
      case 0:
        return 'Pending';
      case 3:
        return 'Suspended';
      default:
        return userText || 'Unknown';
    }
  };

  useEffect(() => {
    fetchPartners(currentPage, searchQuery, statusFilter, cityFilter);
  }, [currentPage, searchQuery, statusFilter, cityFilter]);

  if (loading && partners.length === 0) {
    return (
      <div className="all-partners-container">
        <div className="page-header">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h1>All Partners</h1>
              <p>Manage all partner accounts</p>
            </div>
            <div className="action-buttons">
              <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleAddPartner}>
                <CIcon icon={cilPlus} />
                Add Partner
              </button>
            </div>
          </div>
        </div>
        
        <div className="card shadow-sm border-0">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading partners...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="all-partners-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h1>All Partners</h1>
            <p>Manage all partner accounts</p>
          </div>
          <div className="action-buttons">
            <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleAddPartner}>
              <CIcon icon={cilPlus} />
              Add Partner
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-lg-4 col-md-6">
              <div className="search-box">
                <CIcon icon={cilSearch} className="search-icon" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search partners by name, email, or establishment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button className="btn btn-primary search-btn" onClick={handleSearch}>
                  <CIcon icon={cilSearch} className="me-1" />
                  Search
                </button>
              </div>
            </div>
            
            <div className="col-lg-2 col-md-6">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="1">Active</option>
                <option value="0">Pending</option>
                <option value="3">Suspended</option>
              </select>
            </div>
            
            <div className="col-lg-2 col-md-6">
              <select
                className="form-select"
                value={cityFilter}
                onChange={(e) => handleCityFilterChange(e.target.value)}
              >
                <option value="all">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div className="col-lg-2 col-md-6 d-flex align-items-end justify-content-end">
              <button className="btn btn-outline-secondary" onClick={handleReset}>
                <CIcon icon={cilX} className="me-1" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-semibold">Partners List</h5>
            <div className="text-muted">
              <small>Total: {totalPartners} partners</small>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {error && (
            <div className="alert alert-danger m-3" role="alert">
              {error}
            </div>
          )}
          
          {actionError && (
            <div className="alert alert-danger m-3" role="alert">
              {actionError}
            </div>
          )}

          {partners.length === 0 && !loading ? (
            <div className="text-center py-5">
              <CIcon icon={cilBuilding} size="3xl" className="text-muted mb-3" />
              <h5 className="text-muted">No partners found</h5>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-0 py-3 px-4 fw-semibold text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>Partner</th>
                    <th className="border-0 py-3 fw-semibold text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>Establishment</th>
                    <th className="border-0 py-3 fw-semibold text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>Contact</th>
                    <th className="border-0 py-3 fw-semibold text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>Location</th>
                    <th className="border-0 py-3 fw-semibold text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>Capacity</th>
                    <th className="border-0 py-3 fw-semibold text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>Status</th>
                    <th className="border-0 py-3 fw-semibold text-uppercase text-end" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => (
                    <tr key={partner.id} className="border-bottom">
                      <td className="py-3 px-4">
                        <div className="partner-info">
                          <div className="avatar-circle">
                            <span>{partner.fullname.split(' ').map(name => name.charAt(0)).join('')}</span>
                          </div>
                          <div className="partner-details">
                            <div className="partner-name">{partner.fullname}</div>
                            <div className="partner-email">{partner.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div>
                          <div className="fw-semibold text-dark">{partner.name_of_establishment}</div>
                          <small className="text-muted">{partner.type_of_establishment}</small>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilPhone} className="me-2 text-muted" size="sm" />
                          <small className="text-dark">{partner.mobile}</small>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilMap} className="me-2 text-muted" size="sm" />
                          <small className="text-dark">{partner.city}</small>
                        </div>
                      </td>
                      <td className="py-3">
                        <div>
                          <div className="fw-semibold text-dark">
                            {partner.current_occupancy_capacity} / {partner.total_seating_capacity}
                          </div>
                          <small className="text-muted">{partner.cabins} cabins</small>
                        </div>
                      </td>
                      <td className="py-3">
                        {getStatusBadge(partner.status, partner.userText)}
                      </td>
                      <td className="py-3 text-end">
                        <div className="action-buttons-table">
                          <button
                            className="btn btn-sm btn-outline-info action-btn action-btn-view me-2"
                            onClick={() => handleEdit(partner)}
                            title="View Partner"
                          >
                            <CIcon icon={cilSearch} size="sm" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary action-btn action-btn-edit me-2"
                            onClick={() => handleEdit(partner)}
                            title="Edit Partner"
                          >
                            <CIcon icon={cilPencil} size="sm" />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger action-btn action-btn-delete"
                            onClick={() => handleDelete(partner)}
                            title="Delete Partner"
                          >
                            <CIcon icon={cilTrash} size="sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card-footer bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalPartners)} of {totalPartners} partners
                  </small>
                </div>
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      );
                    })}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>

      <CustomAlert
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        showConfirm={true}
        confirmText="OK"
        onConfirm={handleAlertConfirm}
      />
    </div>
  );
};

export default AllPartners; 