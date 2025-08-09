import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CForm, CFormLabel, CFormInput, CFormTextarea, CButton, CAlert, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilEnvelopeClosed, cilPhone, cilLocationPin, cilCalendar, cilBuilding, cilShieldAlt, cilPencil, cilSave, cilX } from '@coreui/icons';
import './Profile.css';

// Type casting for CoreUI components
const CCardComponent = CCard as React.ComponentType<any>;
const CCardBodyComponent = CCardBody as React.ComponentType<any>;
const CCardHeaderComponent = CCardHeader as React.ComponentType<any>;
const CColComponent = CCol as React.ComponentType<any>;
const CRowComponent = CRow as React.ComponentType<any>;
const CFormComponent = CForm as React.ComponentType<any>;
const CFormLabelComponent = CFormLabel as React.ComponentType<any>;
const CFormInputComponent = CFormInput as React.ComponentType<any>;
const CFormTextareaComponent = CFormTextarea as React.ComponentType<any>;
const CButtonComponent = CButton as React.ComponentType<any>;
const CAlertComponent = CAlert as React.ComponentType<any>;
const CSpinnerComponent = CSpinner as React.ComponentType<any>;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  
  // Form state for editing
  const [formData, setFormData] = useState({
    name: user?.name || user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || user?.phone_number || '',
    address: user?.address || '',
    company: user?.company || user?.company_name || '',
    role: user?.role || user?.user_type || '',
    bio: user?.bio || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || user?.phone_number || '',
      address: user?.address || '',
      company: user?.company || user?.company_name || '',
      role: user?.role || user?.user_type || '',
      bio: user?.bio || ''
    });
    setMessage(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Here you would typically make an API call to update the user profile
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
      setIsEditing(false);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitials = () => {
    const name = user?.name || user?.full_name || '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserRole = () => {
    const role = user?.role || user?.user_type;
    if (typeof role === 'number') {
      switch (role) {
        case 1: return 'User';
        case 2: return 'Partner';
        case 3: return 'Agent';
        case 4: return 'Admin';
        default: return 'Unknown';
      }
    }
    return role || 'Unknown';
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinnerComponent />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Profile</h2>
          <p className="text-muted mb-0">Manage your account information and preferences</p>
        </div>
        {!isEditing && (
          <CButtonComponent 
            color="primary" 
            onClick={handleEdit}
            className="d-flex align-items-center"
          >
            <CIcon icon={cilPencil} className="me-2" />
            Edit Profile
          </CButtonComponent>
        )}
      </div>

      {message && (
        <CAlertComponent color={message.type === 'success' ? 'success' : message.type === 'error' ? 'danger' : 'info'} className="mb-4">
          {message.text}
        </CAlertComponent>
      )}

      <CRowComponent>
        <CColComponent lg={4} md={12} className="mb-4">
          <CCardComponent className="profile-card">
            <CCardBodyComponent className="text-center">
              <div className="profile-avatar mb-3">
                <div className="avatar-circle">
                  <span>{getUserInitials()}</span>
                </div>
              </div>
              <h4 className="mb-2">{user?.name || user?.full_name || 'User Name'}</h4>
              <p className="text-muted mb-3">{getUserRole()}</p>
              
              <div className="profile-stats">
                <div className="stat-item">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Properties</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Partners</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Users</div>
                </div>
              </div>
            </CCardBodyComponent>
          </CCardComponent>
        </CColComponent>

        <CColComponent lg={8} md={12}>
          <CCardComponent>
            <CCardHeaderComponent>
              <h5 className="mb-0">Personal Information</h5>
            </CCardHeaderComponent>
            <CCardBodyComponent>
              <CFormComponent>
                <CRowComponent>
                  <CColComponent md={6} className="mb-3">
                    <CFormLabelComponent htmlFor="name">
                      <CIcon icon={cilUser} className="me-2" />
                      Full Name
                    </CFormLabelComponent>
                    <CFormInputComponent
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </CColComponent>
                  
                  <CColComponent md={6} className="mb-3">
                    <CFormLabelComponent htmlFor="email">
                      <CIcon icon={cilEnvelopeClosed} className="me-2" />
                      Email Address
                    </CFormLabelComponent>
                    <CFormInputComponent
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your email"
                    />
                  </CColComponent>
                </CRowComponent>

                <CRowComponent>
                  <CColComponent md={6} className="mb-3">
                    <CFormLabelComponent htmlFor="phone">
                      <CIcon icon={cilPhone} className="me-2" />
                      Phone Number
                    </CFormLabelComponent>
                    <CFormInputComponent
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                    />
                  </CColComponent>
                  
                  <CColComponent md={6} className="mb-3">
                    <CFormLabelComponent htmlFor="company">
                      <CIcon icon={cilBuilding} className="me-2" />
                      Company
                    </CFormLabelComponent>
                    <CFormInputComponent
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your company name"
                    />
                  </CColComponent>
                </CRowComponent>

                <CRowComponent>
                  <CColComponent md={6} className="mb-3">
                    <CFormLabelComponent htmlFor="role">
                      <CIcon icon={cilShieldAlt} className="me-2" />
                      Role
                    </CFormLabelComponent>
                    <CFormInputComponent
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled={true}
                      placeholder="Your role"
                    />
                  </CColComponent>
                  
                  <CColComponent md={6} className="mb-3">
                    <CFormLabelComponent htmlFor="address">
                      <CIcon icon={cilLocationPin} className="me-2" />
                      Address
                    </CFormLabelComponent>
                    <CFormInputComponent
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your address"
                    />
                  </CColComponent>
                </CRowComponent>

                <CRowComponent>
                  <CColComponent md={12} className="mb-3">
                    <CFormLabelComponent htmlFor="bio">
                      <CIcon icon={cilUser} className="me-2" />
                      Bio
                    </CFormLabelComponent>
                    <CFormTextareaComponent
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </CColComponent>
                </CRowComponent>

                {isEditing && (
                  <div className="d-flex gap-2">
                    <CButtonComponent 
                      color="primary" 
                      onClick={handleSave}
                      disabled={isLoading}
                      className="d-flex align-items-center"
                    >
                      {isLoading ? (
                        <>
                          <CSpinnerComponent size="sm" className="me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CIcon icon={cilSave} className="me-2" />
                          Save Changes
                        </>
                      )}
                    </CButtonComponent>
                    <CButtonComponent 
                      color="secondary" 
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="d-flex align-items-center"
                    >
                      <CIcon icon={cilX} className="me-2" />
                      Cancel
                    </CButtonComponent>
                  </div>
                )}
              </CFormComponent>
            </CCardBodyComponent>
          </CCardComponent>
        </CColComponent>
      </CRowComponent>
    </div>
  );
};

export default Profile; 