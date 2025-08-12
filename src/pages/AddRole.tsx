import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CCard, CCardHeader, CCardBody, CForm, CFormLabel, CFormInput, CFormTextarea, CButton, CAlert, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilArrowLeft } from '@coreui/icons';
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

const AddRole: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.authFetch(`${config.API_BASE_URL}/role/add`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add role');
      }

      setSuccess('Role added successfully!');
      setFormData({ name: '', description: '' });
      
      // Redirect to roles list after 2 seconds
      setTimeout(() => {
        navigate('/roles/list');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'An error occurred while adding the role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-role-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Add New Role</h2>
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
          <h4 className="mb-0">Role Information</h4>
          <p className="text-muted mb-0">Fill in the details to create a new role</p>
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
                    Adding Role...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-2" />
                    Add Role
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

export default AddRole; 