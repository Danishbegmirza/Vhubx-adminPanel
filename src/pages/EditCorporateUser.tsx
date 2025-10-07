import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilUser, cilEnvelopeOpen, cilSave, cilBuilding, cilPhone, cilLocationPin, cilArrowLeft } from '@coreui/icons';
import CustomAlert from '../components/CustomAlert';
import { corporateService, CorporateUser } from '../services/corporateService';

const EditCorporateUser = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CorporateUser>({
    firstName: '',
    lastName: '',
    email: '',
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

  useEffect(() => {
    const fetchCorporateUser = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await corporateService.getCorporateUsers();
        
        if (response.status && response.data?.data) {
          const user = response.data.data.find((u: any) => 
            u.userid === parseInt(id) || u.userid === id
          );
          
          if (user) {
            // Split fullname into first and last name
            const nameParts = user.fullname?.split(' ') || ['', ''];
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            setFormData({
              firstName: firstName,
              lastName: lastName,
              email: user.email || '',
              organizationName: user.corporate_info?.organization_name || '',
              mobile: user.mobile || '',
              userType: user.user_type || '5',
              city: user.corporate_info?.city || '',
              address: user.corporate_info?.complete_address || '',
              lat: user.corporate_info?.latitude || '',
              long: user.corporate_info?.longitude || ''
            });
          } else {
            showAlert('Error', 'Corporate user not found', 'error');
          }
        }
      } catch (error) {
        console.error('Error fetching corporate user:', error);
        showAlert('Error', 'Failed to fetch corporate user details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCorporateUser();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      showAlert('Error', 'Invalid corporate user ID', 'error');
      return;
    }

    try {
      // Create update data without password if not changed
      const updateData: Partial<CorporateUser> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        organizationName: formData.organizationName,
        mobile: formData.mobile,
        userType: formData.userType,
        city: formData.city,
        address: formData.address,
        lat: formData.lat,
        long: formData.long
      };

      const result = await corporateService.updateCorporateUser(id, updateData);
      console.log('Corporate user updated successfully:', result);
      showAlert('Success', 'Corporate user updated successfully', 'success');
    } catch (error) {
      console.error('Error updating corporate user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update corporate user. Please try again.';
      showAlert('Error', errorMessage, 'error');
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-user-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={() => navigate('/corporate/list')}
          >
            <CIcon icon={cilArrowLeft} />
            Back
          </button>
          <div>
            <h1>Edit Corporate User</h1>
            <p>Update corporate user information</p>
          </div>
        </div>
      </div>

      {/* Edit Corporate User Form */}
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
            </div>

            <div className="row">
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
            </div>

            <div className="mb-3">
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
                Update
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

export default EditCorporateUser;

