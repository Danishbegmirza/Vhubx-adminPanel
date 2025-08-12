import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilBuilding, cilArrowLeft, cilSave } from '@coreui/icons';
import { establishmentService, EstablishmentType, UpdateEstablishmentTypeRequest } from '../services/establishmentService';
import { useAuth } from '../contexts/AuthContext';

const EditEstablishment: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { hasPermission } = useAuth();
  
  const [establishmentType, setEstablishmentType] = useState<EstablishmentType | null>(null);
  const [formData, setFormData] = useState<UpdateEstablishmentTypeRequest>({
    establishment_type: '',
    status: 1
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEstablishmentType(parseInt(id));
    }
  }, [id]);

  const fetchEstablishmentType = async (establishmentTypeId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await establishmentService.getEstablishmentTypeById(establishmentTypeId);
      setEstablishmentType(data);
      setFormData({
        establishment_type: data.establishment_type,
        status: data.status
      });
    } catch (err) {
      console.error('Error fetching establishment type:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch establishment type');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.establishment_type.trim()) {
      setError('Establishment type is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await establishmentService.updateEstablishmentType(parseInt(id!), formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/establishment/list');
      }, 2000);
    } catch (err) {
      console.error('Error updating establishment type:', err);
      setError(err instanceof Error ? err.message : 'Failed to update establishment type');
    } finally {
      setSaving(false);
    }
  };

  if (!hasPermission('Property Management', 'edit')) {
    return (
      <div className="establishment-edit-container">
        <div className="alert alert-danger" role="alert">
          You don't have permission to edit establishment types.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="establishment-edit-container">
        <div className="page-header mb-4">
          <h1 className="page-title">
            <CIcon icon={cilBuilding} className="me-2" />
            Edit Establishment Type
          </h1>
          <p className="page-subtitle">Loading establishment type...</p>
        </div>
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !establishmentType) {
    return (
      <div className="establishment-edit-container">
        <div className="page-header mb-4">
          <h1 className="page-title">
            <CIcon icon={cilBuilding} className="me-2" />
            Edit Establishment Type
          </h1>
        </div>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/establishment/list')}
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="establishment-edit-container">
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
            Edit Establishment Type
          </h1>
        </div>
        <p className="page-subtitle">Update establishment type information</p>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="alert alert-success" role="alert">
          Establishment type updated successfully! Redirecting to list...
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
                  placeholder="Enter establishment type"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="status" className="form-label">
                  Status <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/establishment/list')}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-2" />
                    Update Establishment Type
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

export default EditEstablishment; 