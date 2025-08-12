import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CCard, CCardHeader, CCardBody, CForm, CFormLabel, CFormInput, CFormTextarea, CButton, CAlert, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilArrowLeft, cilPencil } from '@coreui/icons';
import { apiService } from '../services/api';
import { config } from '../config/env';

// Type casting for CoreUI components
const CCardComponent = CCard as React.ComponentType<any>;
const CCardHeaderComponent = CCardHeader as React.ComponentType<any>;
const CCardBodyComponent = CCardBody as React.ComponentType<any>;
const CFormComponent = CForm as React.ComponentType<any>;
const CFormLabelComponent = CFormLabel as React.ComponentType<any>;
const CFormInputComponent = CFormInput as React.ComponentType<any>;
const CFormTextareaComponent = CFormTextarea as React.ComponentType<any>;
const CButtonComponent = CButton as React.ComponentType<any>;
const CAlertComponent = CAlert as React.ComponentType<any>;
const CSpinnerComponent = CSpinner as React.ComponentType<any>;

interface RoleFormData {
  name: string;
  description: string;
}

const EditRole: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchRole = async () => {
    setFetching(true);
    setError(null);

    try {
      // First, fetch all roles to get the current role data
      const response = await apiService.authFetch(`${config.API_BASE_URL}/role/list`, {
        method: 'GET'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch role');
      }

      const roles = data.data || data || [];
      const currentRole = roles.find((role: any) => role.id === parseInt(id || '0'));

      if (!currentRole) {
        throw new Error('Role not found');
      }

      setFormData({
        name: currentRole.name,
        description: currentRole.description
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching the role');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRole();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.authFetch(`${config.API_BASE_URL}/role/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update role');
      }

      setSuccess('Role updated successfully!');
      
      // Redirect to roles list after 2 seconds
      setTimeout(() => {
        navigate('/roles/list');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'An error occurred while updating the role');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinnerComponent size="lg" />
      </div>
    );
  }

  return (
    <div className="edit-role-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Edit Role</h2>
        <CButtonComponent
          color="secondary"
          variant="outline"
          onClick={() => navigate('/roles/list')}
          className="d-flex align-items-center"
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Back to Roles
        </CButtonComponent>
      </div>

      <CCardComponent>
        <CCardHeaderComponent>
          <h4 className="mb-0">Update Role Information</h4>
          <p className="text-muted mb-0">Modify the role details below</p>
        </CCardHeaderComponent>
        <CCardBodyComponent>
          {error && (
            <CAlertComponent color="danger" dismissible onClose={() => setError(null)}>
              {error}
            </CAlertComponent>
          )}
          
          {success && (
            <CAlertComponent color="success" dismissible onClose={() => setSuccess(null)}>
              {success}
            </CAlertComponent>
          )}

          <CFormComponent onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <CFormLabelComponent htmlFor="name">Role Name *</CFormLabelComponent>
                <CFormInputComponent
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter role name (e.g., admin, user, moderator)"
                  required
                  disabled={loading}
                />
                <div className="form-text">
                  Use lowercase with underscores (e.g., super_admin, content_manager)
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <CFormLabelComponent htmlFor="description">Description *</CFormLabelComponent>
                <CFormTextareaComponent
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the role's permissions and responsibilities"
                  rows={3}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <CButtonComponent
                color="secondary"
                variant="outline"
                onClick={() => navigate('/roles/list')}
                disabled={loading}
              >
                Cancel
              </CButtonComponent>
              <CButtonComponent
                type="submit"
                color="primary"
                disabled={loading || !formData.name || !formData.description}
                className="d-flex align-items-center"
              >
                {loading ? (
                  <>
                    <CSpinnerComponent size="sm" className="me-2" />
                    Updating Role...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilPencil} className="me-2" />
                    Update Role
                  </>
                )}
              </CButtonComponent>
            </div>
          </CFormComponent>
        </CCardBodyComponent>
      </CCardComponent>
    </div>
  );
};

export default EditRole; 