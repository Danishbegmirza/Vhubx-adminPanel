import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilUser, cilEnvelopeOpen, cilSave, cilBuilding, cilPhone, cilLocationPin, cilShieldAlt, cilReload } from '@coreui/icons';
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

  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [geocodeStatus, setGeocodeStatus] = useState<'idle' | 'success' | 'error'>('idle');

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

  // Geocoding function using OpenStreetMap Nominatim API
  const geocodeAddress = useCallback(async (address: string, city: string) => {
    if (!address || !city) {
      setGeocodeStatus('idle');
      setFormData(prev => ({ ...prev, lat: '', long: '' }));
      return;
    }

    const fullAddress = `${address}, ${city}`;
    setIsGeocodingLoading(true);
    setGeocodeStatus('idle');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setFormData(prev => ({
          ...prev,
          lat: lat,
          long: lon
        }));
        setGeocodeStatus('success');
      } else {
        setFormData(prev => ({ ...prev, lat: '', long: '' }));
        setGeocodeStatus('error');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setFormData(prev => ({ ...prev, lat: '', long: '' }));
      setGeocodeStatus('error');
    } finally {
      setIsGeocodingLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle address blur to trigger geocoding
  const handleAddressBlur = () => {
    geocodeAddress(formData.address, formData.city);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if lat/long are available
    if (!formData.lat || !formData.long) {
      showAlert('Warning', 'Unable to get location coordinates. Please verify the address and city.', 'warning');
      return;
    }
    
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
                  onBlur={handleAddressBlur}
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
                  onBlur={handleAddressBlur}
                  required
                />
              </div>
            </div>

            {/* Location Status Indicator */}
            <div className="row mb-3">
              <div className="col-12">
                <div className={`location-status p-3 rounded d-flex align-items-center gap-2 ${
                  geocodeStatus === 'success' ? 'bg-success bg-opacity-10 border border-success' :
                  geocodeStatus === 'error' ? 'bg-danger bg-opacity-10 border border-danger' :
                  'bg-light border'
                }`}>
                  {isGeocodingLoading ? (
                    <>
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <span className="text-muted">Fetching location coordinates...</span>
                    </>
                  ) : geocodeStatus === 'success' ? (
                    <>
                      <CIcon icon={cilLocationPin} className="text-success" />
                      <span className="text-success">
                        Location found: {parseFloat(formData.lat || '0').toFixed(6)}, {parseFloat(formData.long || '0').toFixed(6)}
                      </span>
                    </>
                  ) : geocodeStatus === 'error' ? (
                    <>
                      <CIcon icon={cilLocationPin} className="text-danger" />
                      <span className="text-danger">Could not find location. Please verify the address.</span>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-primary ms-auto d-flex align-items-center gap-1"
                        onClick={() => geocodeAddress(formData.address, formData.city)}
                      >
                        <CIcon icon={cilReload} size="sm" />
                        Retry
                      </button>
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilLocationPin} className="text-muted" />
                      <span className="text-muted">Enter city and address to auto-detect location coordinates</span>
                    </>
                  )}
                </div>
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

