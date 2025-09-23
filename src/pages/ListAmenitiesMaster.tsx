import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { 
  cilArrowLeft, 
  cilPlus, 
  cilSearch, 
  cilPencil, 
  cilTrash,
  cilFilter,
  cilX
} from '@coreui/icons';
import CustomAlert from '../components/CustomAlert';
import { amenityService, Amenity } from '../services/amenityService';

const ListAmenitiesMaster: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [filteredAmenities, setFilteredAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);

  // Alert state
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

  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const data = await amenityService.getAmenities();
      setAmenities(data);
      setFilteredAmenities(data);
    } catch (error: any) {
      showAlert('Error', error.message || 'Failed to fetch amenities', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  // Filter amenities based on search and category
  useEffect(() => {
    let filtered = amenities;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(amenity =>
        amenity.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        amenity.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(amenity => amenity.category === categoryFilter);
    }

    setFilteredAmenities(filtered);
  }, [amenities, searchQuery, categoryFilter]);

  const handleSearch = () => {
    setSearchQuery(searchTerm);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchQuery('');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSearchQuery('');
    setCategoryFilter('all');
  };

  const handleDeleteAmenity = async (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    showAlert(
      'Confirm Delete',
      `Are you sure you want to delete the amenity "${amenity.label}"? This action cannot be undone.`,
      'warning',
      async () => {
        try {
          setActionLoading(true);
          await amenityService.deleteAmenity(amenity.id);
          showAlert('Success', 'Amenity deleted successfully!', 'success');
          fetchAmenities(); // Refresh the list
        } catch (error: any) {
          showAlert('Error', error.message || 'Failed to delete amenity', 'error');
        } finally {
          setActionLoading(false);
          setSelectedAmenity(null);
        }
      }
    );
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category.toLowerCase()) {
      case 'workspace amenities': return 'bg-primary';
      case 'facilities': return 'bg-success';
      case 'access & convenience': return 'bg-warning';
      case 'community/value add': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category.toLowerCase()) {
      case 'workspace amenities': return 'Workspace Amenities';
      case 'facilities': return 'Facilities';
      case 'access & convenience': return 'Access & Convenience';
      case 'community/value add': return 'Community/Value Add';
      default: return category;
    }
  };

  return (
    <div className="list-amenities-master-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline-secondary me-3"
            >
              <CIcon icon={cilArrowLeft} />
            </button>
            <div>
              <h2 className="mb-0">Amenities & Facilities</h2>
              <p className="text-muted mb-0">Manage amenities and facilities for properties</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/amenities/add')}
            className="btn btn-primary"
          >
            <CIcon icon={cilPlus} className="me-2" />
            Add Amenity
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search amenities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={handleSearch}
                  >
                    <CIcon icon={cilSearch} />
                  </button>
                  {searchQuery && (
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={clearSearch}
                    >
                      <CIcon icon={cilX} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="Workspace Amenities">Workspace Amenities</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Access & Convenience">Access & Convenience</option>
                  <option value="Community/Value Add">Community/Value Add</option>
                </select>
              </div>
              
              <div className="col-md-2">
                <button 
                  className="btn btn-outline-secondary w-100"
                  onClick={clearFilters}
                >
                  <CIcon icon={cilFilter} className="me-2" />
                  Clear Filters
                </button>
              </div>
              
              <div className="col-md-3">
                <div className="text-muted">
                  Showing {filteredAmenities.length} of {amenities.length} amenities
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities List */}
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Amenities List</h5>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading amenities...</p>
              </div>
            ) : filteredAmenities.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">No amenities found.</p>
                {searchQuery || categoryFilter !== 'all' ? (
                  <button 
                    className="btn btn-outline-primary"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/amenities/add')}
                  >
                    <CIcon icon={cilPlus} className="me-2" />
                    Add First Amenity
                  </button>
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Key</th>
                      <th>Label</th>
                      <th>Category</th>
                      <th>Created Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAmenities.map((amenity) => (
                      <tr key={amenity.id}>
                        <td>
                          <code className="text-primary">{amenity.key}</code>
                        </td>
                        <td>
                          <strong>{amenity.label}</strong>
                        </td>
                        <td>
                          <span className={`badge ${getCategoryBadgeClass(amenity.category)}`}>
                            {getCategoryDisplayName(amenity.category)}
                          </span>
                        </td>
                        <td>
                          {amenity.createdAt ? 
                            new Date(amenity.createdAt).toLocaleDateString() : 
                            'N/A'
                          }
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => navigate(`/amenities/edit/${amenity.id}`)}
                              title="Edit"
                            >
                              <CIcon icon={cilPencil} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteAmenity(amenity)}
                              disabled={actionLoading}
                              title="Delete"
                            >
                              <CIcon icon={cilTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Alert */}
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

export default ListAmenitiesMaster; 