import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilBuilding, cilArrowLeft, cilSave } from '@coreui/icons';
import { establishmentService, CreateEstablishmentTypeRequest } from '../services/establishmentService';
import { useAuth } from '../contexts/AuthContext';

const AddEstablishment: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  
  const [formData, setFormData] = useState<CreateEstablishmentTypeRequest>({
    establishment_type: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.establishment_type.trim()) {
      setError('Establishment type is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await establishmentService.createEstablishmentType(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/establishment/list');
      }, 2000);
    } catch (err) {
      console.error('Error creating establishment type:', err);
      setError(err instanceof Error ? err.message : 'Failed to create establishment type');
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission('Property Management', 'create')) {
    return (
      <div className="establishment-add-container">
        <div className="alert alert-danger" role="alert">
          You don't have permission to create establishment types.
        </div>
      </div>
    );
  }

  return (
    <div className="establishment-add-container">
      {/* Page Header */}
      <div className="page-header mb-4">
        <div className="d-flex align-items-center mb-3">
          <button
            className="btn btn-outline-secondary me-3"
            onClick={() => navigate('/establishment/list')}
          >
            <CIcon icon={cilArrowLeft} className="me-2" />
            Back to List
          </button>
          <h1 className="page-title mb-0">
            <CIcon icon={cilBuilding} className="me-2" />
            Add New Establishment Type
          </h1>
        </div>
        <p className="page-subtitle">Create a new establishment type</p>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="alert alert-success" role="alert">
          Establishment type created successfully! Redirecting to list...
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Establishment Type Information</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Basic Information */}
              <div className="col-md-6 mb-3">
                <label htmlFor="establishment_type" className="form-label">
                  Establishment Type <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="establishment_type"
                  name="establishment_type"
                  value={formData.establishment_type}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter establishment type (e.g., Cafe, Restaurant, Hotel)"
                />
                <div className="form-text">
                  Examples: Cafe, Bar/Lounge/Pub, Restaurant (Fine Dining), Hotel (FnB), Coworking space, Office Space, Business Center, Hotel (Non-FnB coworking), Bare Shell
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/establishment/list')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-2" />
                    Create Establishment Type
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEstablishment; 