import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilArrowBottom, cilTrash, cilCheckCircle, cilArrowLeft } from '@coreui/icons';
import CustomAlert from '../components/CustomAlert';
import { requirementService, Requirement } from '../services/requirementService';

const RequirementList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequirements, setTotalRequirements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterStatus, setFilterStatus] = useState<'all' | 'seen' | 'unseen'>('all');
  
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
    // Implement search logic if needed
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setCurrentPage(1);
  };

  const fetchRequirements = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await requirementService.getRequirements(page, 10);
      
      if (response.status && response.data) {
        setRequirements(response.data.data || []);
        setTotalRequirements(response.data.total);
        setTotalPages(Math.ceil(response.data.total / response.data.limit));
        setCurrentPage(response.data.page);
      } else {
        setError(response.message || 'Failed to fetch requirements');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching requirements');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSeen = async (id: number) => {
    showAlert(
      'Confirm Action',
      'Are you sure you want to mark this requirement as seen?',
      'warning',
      async () => {
        try {
          await requirementService.markAsSeen(id);
          showAlert('Success', 'Requirement marked as seen successfully', 'success');
          fetchRequirements(currentPage);
        } catch (err) {
          showAlert('Error', 'Failed to mark requirement as seen', 'error');
        }
      }
    );
  };

  const handleDelete = async (id: number) => {
    showAlert(
      'Confirm Delete',
      'Are you sure you want to delete this requirement?',
      'warning',
      async () => {
        try {
          await requirementService.deleteRequirement(id);
          showAlert('Success', 'Requirement deleted successfully', 'success');
          fetchRequirements(currentPage);
        } catch (err) {
          showAlert('Error', 'Failed to delete requirement', 'error');
        }
      }
    );
  };

  useEffect(() => {
    fetchRequirements(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredRequirements = requirements.filter(req => {
    // Filter by search term
    const matchesSearch = !searchTerm || 
      req.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.mobile?.includes(searchTerm);

    // Filter by seen status
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'seen' && req.is_seen === 1) ||
      (filterStatus === 'unseen' && req.is_seen === 0);

    return matchesSearch && matchesStatus;
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
            onClick={() => fetchRequirements(currentPage)}
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
              <h2 className="mb-1 fw-bold text-dark">Requirements Management</h2>
              <p className="text-muted mb-0">View and manage customer requirements</p>
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
                        placeholder="  Search requirements..."
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
                      style={{ backgroundColor: 'white', maxWidth: '150px', border: '1px solid #dee2e6' }}
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as 'all' | 'seen' | 'unseen')}
                    >
                      <option value="all">All Status</option>
                      <option value="unseen">Unseen</option>
                      <option value="seen">Seen</option>
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

          {/* Requirements Table */}
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                  <th className="border-0 py-3 fw-semibold text-dark">Name</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Email</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Mobile</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Company</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Interested In</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Team Size</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Status</th>
                  <th className="border-0 py-3 fw-semibold text-dark">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequirements.map((requirement) => (
                  <tr key={requirement.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
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
                          {requirement.name?.[0]?.toUpperCase() || 'R'}
                        </div>
                        <div>
                          <div className="fw-medium text-dark">{requirement.name || 'N/A'}</div>
                          <small className="text-muted">ID: {requirement.id}</small>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-dark">{requirement.email || 'N/A'}</td>
                    <td className="py-3 text-dark">{requirement.mobile || 'N/A'}</td>
                    <td className="py-3 text-dark">{requirement.company_name || 'N/A'}</td>
                    <td className="py-3 text-dark">{requirement.interested_in || 'N/A'}</td>
                    <td className="py-3 text-dark">{requirement.team_size || 'N/A'}</td>
                    <td className="py-3">
                      {requirement.is_seen === 1 ? (
                        <span className="badge bg-success px-3 py-1" style={{ borderRadius: '20px', fontSize: '12px' }}>
                          Seen
                        </span>
                      ) : (
                        <span className="badge bg-warning px-3 py-1" style={{ borderRadius: '20px', fontSize: '12px' }}>
                          Unseen
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="d-flex gap-2">
                        {requirement.is_seen === 0 && (
                          <button 
                            className="btn btn-sm btn-outline-success d-flex align-items-center justify-content-center" 
                            style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                            title="Mark as Seen"
                            onClick={() => handleMarkAsSeen(requirement.id)}
                          >
                            <CIcon icon={cilCheckCircle} />
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center" 
                          style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                          title="Delete"
                          onClick={() => handleDelete(requirement.id)}
                        >
                          <CIcon icon={cilTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRequirements.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">
                      No requirements found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-4 pt-3" style={{ borderTop: '1px solid #dee2e6' }}>
            <div className="text-muted">
              Showing {filteredRequirements.length} of {totalRequirements} requirements
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
        showConfirm={alertConfig.type === 'warning'}
        confirmText={alertConfig.type === 'warning' ? 'Confirm' : 'OK'}
        cancelText="Cancel"
      />
    </div>
  );
};

export default RequirementList;
