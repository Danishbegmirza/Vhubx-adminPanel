import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilSave } from '@coreui/icons';
import CustomAlert from '../components/CustomAlert';
import { amenityService, UpdateAmenityRequest, Amenity } from '../services/amenityService';

const EditAmenity: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [amenity, setAmenity] = useState<Amenity | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<UpdateAmenityRequest>({
    key: '',
    label: '',
    category: 'common'
  });

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

  const fetchAmenity = async () => {
    if (!id) {
      showAlert('Error', 'Invalid amenity ID', 'error', () => navigate('/amenities/list'));
      return;
    }

    try {
      setInitialLoading(true);
      // Since we don't have a get single amenity endpoint, we'll fetch all and find the one
      const amenities = await amenityService.getAmenities();
      const foundAmenity = amenities.find(a => a.id === parseInt(id));
      
      if (!foundAmenity) {
        showAlert('Error', 'Amenity not found', 'error', () => navigate('/amenities/list'));
        return;
      }

      setAmenity(foundAmenity);
      setFormData({
        key: foundAmenity.key,
        label: foundAmenity.label,
        category: foundAmenity.category
      });
    } catch (error: any) {
      showAlert('Error', error.message || 'Failed to fetch amenity', 'error', () => navigate('/amenities/list'));
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenity();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.key.trim()) {
      showAlert('Validation Error', 'Amenity key is required', 'error');
      return false;
    }
    if (!formData.label.trim()) {
      showAlert('Validation Error', 'Amenity label is required', 'error');
      return false;
    }
    if (!formData.category.trim()) {
      showAlert('Validation Error', 'Category is required', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !amenity) {
      return;
    }

    setLoading(true);
    try {
      await amenityService.updateAmenity(amenity.id, formData);
      showAlert(
        'Success', 
        'Amenity updated successfully!', 
        'success',
        () => navigate('/amenities/list')
      );
    } catch (error: any) {
      showAlert('Error', error.message || 'Failed to update amenity', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (amenity) {
      setFormData({
        key: amenity.key,
        label: amenity.label,
        category: amenity.category
      });
    }
  };

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Loading amenity...</span>
      </div>
    );
  }

  if (!amenity) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">Amenity not found</p>
        <button onClick={() => navigate('/amenities/list')} className="btn btn-primary">
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="edit-amenity-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button 
              onClick={() => navigate('/amenities/list')}
              className="btn btn-outline-secondary me-3"
            >
              <CIcon icon={cilArrowLeft} />
            </button>
            <div>
              <h2 className="mb-0">Edit Amenity</h2>
              <p className="text-muted mb-0">Update amenity details</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="row">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Amenity Details</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="key" className="form-label">
                        Amenity Key <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="key"
                        name="key"
                        value={formData.key}
                        onChange={handleInputChange}
                        placeholder="e.g., phone_booths"
                        required
                      />
                      <div className="form-text">
                        Unique identifier for the amenity (use underscores for spaces)
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="label" className="form-label">
                        Amenity Label <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="label"
                        name="label"
                        value={formData.label}
                        onChange={handleInputChange}
                        placeholder="e.g., Phone Booths"
                        required
                      />
                      <div className="form-text">
                        Display name for the amenity
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="category" className="form-label">
                        Category <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="common">Common</option>
                        <option value="workspace">Workspace</option>
                        <option value="facilities">Facilities</option>
                        <option value="access">Access & Convenience</option>
                        <option value="community">Community/Value Add</option>
                      </select>
                      <div className="form-text">
                        Category to group the amenity
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      <CIcon icon={cilSave} className="me-2" />
                      {loading ? 'Updating...' : 'Update Amenity'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleReset}
                      disabled={loading}
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">Current Details</h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <strong>ID:</strong> {amenity.id}
                </div>
                <div className="mb-3">
                  <strong>Created:</strong> {amenity.createdAt ? new Date(amenity.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-header">
                <h6 className="mb-0">Guidelines</h6>
              </div>
              <div className="card-body">
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <strong>Key:</strong> Use lowercase with underscores (e.g., high_speed_wifi)
                  </li>
                  <li className="mb-2">
                    <strong>Label:</strong> User-friendly display name (e.g., High Speed WiFi)
                  </li>
                  <li className="mb-2">
                    <strong>Category:</strong> Group similar amenities together
                  </li>
                </ul>
              </div>
            </div>
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

export default EditAmenity;
