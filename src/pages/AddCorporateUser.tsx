import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilUser, cilEnvelopeOpen, cilSave, cilBuilding, cilPhone, cilLocationPin, cilShieldAlt } from '@coreui/icons';
import CustomAlert from '../components/CustomAlert';
import { corporateService, CorporateUser } from '../services/corporateService';

const AddCorporateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CorporateUser>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    organizationName: '',
    mobile: '',
    userType: '5',
    city: '',
    address: '',
    lat: '',
    long: ''
  });

  // Alert state
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info'
  });

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setAlertConfig({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await corporateService.addCorporateUser(formData);
      console.log('Corporate user created successfully:', result);
      showAlert('Success', 'Corporate user created successfully', 'success');
    } catch (error) {
      console.error('Error creating corporate user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create corporate user. Please try again.';
      showAlert('Error', errorMessage, 'error');
    }
  };

  return (
    <div className="add-user-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="d-flex align-items-center gap-3">
          <div>
            <h1>Add Corporate User</h1>
            <p>Create a new corporate user account</p>
          </div>
        </div>
      </div>

      {/* Add Corporate User Form */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="firstName" className="form-label">
                  <CIcon icon={cilUser} className="me-2" />
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="lastName" className="form-label">
                  <CIcon icon={cilUser} className="me-2" />
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">
                  <CIcon icon={cilEnvelopeOpen} className="me-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="password" className="form-label">
                  <CIcon icon={cilShieldAlt} className="me-2" />
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="organizationName" className="form-label">
                  <CIcon icon={cilBuilding} className="me-2" />
                  Organization Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="organizationName"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="mobile" className="form-label">
                  <CIcon icon={cilPhone} className="me-2" />
                  Mobile Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="city" className="form-label">
                  <CIcon icon={cilLocationPin} className="me-2" />
                  City
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="address" className="form-label">
                  <CIcon icon={cilLocationPin} className="me-2" />
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="lat" className="form-label">
                  <CIcon icon={cilLocationPin} className="me-2" />
                  Latitude
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lat"
                  name="lat"
                  value={formData.lat}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="long" className="form-label">
                  <CIcon icon={cilLocationPin} className="me-2" />
                  Longitude
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="long"
                  name="long"
                  value={formData.long}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions d-flex gap-3">
              <button type="submit" className="btn btn-primary d-flex align-items-center gap-2">
                <CIcon icon={cilSave} />
                Submit
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/corporate/list')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <CustomAlert
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        showConfirm={true}
        confirmText="OK"
        onConfirm={() => {
          closeAlert();
          if (alertConfig.type === 'success') {
            navigate('/corporate/list');
          }
        }}
      />
    </div>
  );
};

export default AddCorporateUser;

