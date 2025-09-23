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

const ListAmenities: React.FC = () => {
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

  useEffect(() => {
    let filtered = amenities;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(amenity =>
        amenity.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        amenity.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        amenity.category.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchQuery('');
    setCategoryFilter('all');
  };

  const handleAddAmenity = () => {
    navigate('/amenities/add');
  };

  const handleEditAmenity = (amenity: Amenity) => {
    navigate(`/amenities/edit/${amenity.id}`);
  };

  const handleDeleteAmenity = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    showAlert(
      'Confirm Deletion',
      `Are you sure you want to delete the amenity "${amenity.label}"? This action cannot be undone.`,
      'warning',
      confirmDeleteAmenity
    );
  };

  const confirmDeleteAmenity = async () => {
    if (!selectedAmenity) return;

    try {
      setActionLoading(true);
      await amenityService.deleteAmenity(selectedAmenity.id);
      showAlert('Success', 'Amenity deleted successfully!', 'success');
      fetchAmenities(); // Refresh the list
    } catch (error: any) {
      showAlert('Error', error.message || 'Failed to delete amenity', 'error');
    } finally {
      setActionLoading(false);
      setSelectedAmenity(null);
    }
  };

  const getUniqueCategories = () => {
    const categories = amenities.map(amenity => amenity.category);
    return Array.from(new Set(categories));
  };

  const getCategoryBadgeClass = (category: string) => {
    const categoryClasses: { [key: string]: string } = {
      common: 'bg-primary',
      workspace: 'bg-success',
      facilities: 'bg-info',
      access: 'bg-warning',
      community: 'bg-secondary'
    };
    return categoryClasses[category] || 'bg-light text-dark';
  };

  return (
    <div className="list-amenities-page">
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
            onClick={handleAddAmenity}
            className="btn btn-primary"
          >
            <CIcon icon={cilPlus} className="me-2" />
            Add Amenity
          </button>
        </div>

        {/* Filters and Search */}
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
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleSearch}
                  >
                    <CIcon icon={cilSearch} />
                  </button>
                </div>
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {getUniqueCategories().map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={handleReset}
                >
                  <CIcon icon={cilX} className="me-2" />
                  Reset
                </button>
              </div>

              <div className="col-md-3">
                <div className="text-muted small">
                  Showing {filteredAmenities.length} of {amenities.length} amenities
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities List */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading amenities...</p>
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              {filteredAmenities.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No amenities found</p>
                  <button
                    onClick={handleAddAmenity}
                    className="btn btn-primary"
                  >
                    <CIcon icon={cilPlus} className="me-2" />
                    Add First Amenity
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Key</th>
                        <th>Label</th>
                        <th>Category</th>
                        <th>Created</th>
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
                              {amenity.category.charAt(0).toUpperCase() + amenity.category.slice(1)}
                            </span>
                          </td>
                          <td>
                            {amenity.createdAt ? new Date(amenity.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEditAmenity(amenity)}
                                title="Edit amenity"
                              >
                                <CIcon icon={cilPencil} />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteAmenity(amenity)}
                                disabled={actionLoading}
                                title="Delete amenity"
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
        )}
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

export default ListAmenities;
