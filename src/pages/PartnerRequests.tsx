import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilArrowBottom, cilArrowLeft, cilInfo, cilCheck, cilX } from '@coreui/icons';
import CustomAlert from '../components/CustomAlert';
import { apiService } from '../services/api';

interface PartnerRequest {
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
  user: {
    userid: number;
    fullname: string;
    email: string;
    mobile: string;
    profile_image: string | null;
    status: number;
  };
}

interface ApiResponse {
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

const PartnerRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<PartnerRequest | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  
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

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchQuery('');
    setCurrentPage(1);
    fetchPartnerRequests(1);
  };

  const fetchPartnerRequests = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `http://3.110.153.105:3000/api/v1/partner/list?page=${page}&limit=20`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await apiService.authFetch(url, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.status) {
        // Filter only requests with status 0 (pending)
        const pendingRequests = data.data.data.filter(request => request.status === 0);
        setPartnerRequests(pendingRequests);
        setTotalRequests(pendingRequests.length);
        setTotalPages(Math.ceil(pendingRequests.length / 20));
      } else {
        throw new Error(data.message || 'Failed to fetch partner requests');
      }
    } catch (err) {
      console.error('Error fetching partner requests:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching partner requests');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPartnerRequests(page, searchQuery);
  };

  const handleViewDetails = (request: PartnerRequest) => {
    setSelectedRequest(request);
    setShowInfoModal(true);
  };

  const handleApproveRequest = async (requestId: number) => {
    try {
      // Placeholder for approve API
      showAlert('Success', 'Partner request approved successfully', 'success', () => {
        fetchPartnerRequests(currentPage, searchQuery);
      });
    } catch (err) {
      showAlert('Error', 'Failed to approve request', 'error');
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      // Placeholder for reject API
      showAlert('Success', 'Partner request rejected successfully', 'success', () => {
        fetchPartnerRequests(currentPage, searchQuery);
      });
    } catch (err) {
      showAlert('Error', 'Failed to reject request', 'error');
    }
  };

  useEffect(() => {
    fetchPartnerRequests(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  // Filter requests based on search term
  const filteredRequests = partnerRequests.filter(request => {
    const searchLower = searchQuery.toLowerCase();
    return (
      request.user.fullname.toLowerCase().includes(searchLower) ||
      request.user.email.toLowerCase().includes(searchLower) ||
      request.user.mobile.includes(searchQuery) ||
      request.type_of_establishment.toLowerCase().includes(searchLower) ||
      request.name_of_establishment.toLowerCase().includes(searchLower) ||
      request.ownership_of_property.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
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
            onClick={() => fetchPartnerRequests(currentPage)}
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
              <h2 className="mb-1 fw-bold text-dark">Partner Requests</h2>
              <p className="text-muted mb-0">Manage pending partner requests and applications</p>
            </div>
            <div className="d-flex gap-3">
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
                        placeholder="Search partner requests..."
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

          {/* Partner Requests Table */}
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                  <th className="border-0 py-3 fw-semibold text-dark">Name</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Email</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Mobile</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Type of Establishment</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Name of Establishment</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Ownership</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Details</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
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
                          {request.user.fullname ? request.user.fullname.split(' ').map(n => n[0]).join('') : 'U'}
                        </div>
                        <div>
                          <div className="fw-medium text-dark">{request.user.fullname || 'N/A'}</div>
                          <small className="text-muted">ID: {request.user.userid}</small>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-dark">{request.user.email || 'N/A'}</td>
                    <td className="py-3 text-dark">{request.user.mobile || 'N/A'}</td>
                    <td className="py-3 text-dark">{request.type_of_establishment || 'N/A'}</td>
                    <td className="py-3 text-dark">{request.name_of_establishment || 'N/A'}</td>
                    <td className="py-3 text-dark">{request.ownership_of_property || 'N/A'}</td>
                    <td className="py-3">
                      <button 
                        className="btn btn-sm btn-outline-info d-flex align-items-center justify-content-center" 
                        style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                        title="View Details"
                        onClick={() => handleViewDetails(request)}
                      >
                        <CIcon icon={cilInfo} />
                      </button>
                    </td>
                    <td className="py-3">
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline-success d-flex align-items-center justify-content-center" 
                          style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                          title="Approve"
                          onClick={() => handleApproveRequest(request.id)}
                        >
                          ✓
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center" 
                          style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                          title="Reject"
                          onClick={() => handleRejectRequest(request.id)}
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
              Showing {filteredRequests.length} of {totalRequests} requests
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

      {/* Info Modal */}
      {showInfoModal && selectedRequest && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Partner Request Details</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowInfoModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">User Information</h6>
                    <div className="mb-2">
                      <strong>Name:</strong> {selectedRequest.user.fullname || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>Email:</strong> {selectedRequest.user.email || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>Mobile:</strong> {selectedRequest.user.mobile || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>User ID:</strong> {selectedRequest.user.userid}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Establishment Details</h6>
                    <div className="mb-2">
                      <strong>Type:</strong> {selectedRequest.type_of_establishment || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>Name:</strong> {selectedRequest.name_of_establishment || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>Ownership:</strong> {selectedRequest.ownership_of_property || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>City:</strong> {selectedRequest.city || 'N/A'}
                    </div>
                  </div>
                </div>
                
                <hr />
                
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Space Details</h6>
                    <div className="mb-2">
                      <strong>Working Days:</strong> {selectedRequest.working_days || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>Opening Time:</strong> {selectedRequest.opning_time || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>Internet Type:</strong> {selectedRequest.internet_type || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>Seats Available:</strong> {selectedRequest.no_of_seat_available_of_coworking || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>Total Seating Capacity:</strong> {selectedRequest.total_seating_capacity || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>Current Occupancy:</strong> {selectedRequest.current_occupancy_capacity || 'N/A'}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Property Details</h6>
                    <div className="mb-2">
                      <strong>Area (sq ft):</strong> {selectedRequest.area_in_sqft || 'N/A'}
                    </div>
                    <div className="mb-2">
                      <strong>Cabins Available:</strong> {selectedRequest.cabins ? 'Yes' : 'No'}
                    </div>
                    <div className="mb-2">
                      <strong>Status:</strong> 
                      <span className="badge bg-warning ms-2">Pending</span>
                    </div>
                    <div className="mb-2">
                      <strong>Created:</strong> {selectedRequest.createdAtFormatted || 'N/A'}
                    </div>
                  </div>
                </div>
                
                <hr />
                
                <div className="row">
                  <div className="col-12">
                    <h6 className="fw-bold mb-3">Complete Address</h6>
                    <p className="text-muted">{selectedRequest.complete_address || 'N/A'}</p>
                  </div>
                </div>
                
                {selectedRequest.pictures_of_the_space && selectedRequest.pictures_of_the_space.length > 0 && (
                  <>
                    <hr />
                    <div className="row">
                      <div className="col-12">
                        <h6 className="fw-bold mb-3">Space Images</h6>
                        <div className="row">
                          {selectedRequest.pictures_of_the_space.map((pic, index) => (
                            <div key={index} className="col-md-4 mb-3">
                              <img 
                                src={pic.url} 
                                alt={`Space ${index + 1}`}
                                className="img-fluid rounded"
                                style={{ maxHeight: '150px', objectFit: 'cover' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowInfoModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default PartnerRequests; 