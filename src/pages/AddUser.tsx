import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilUser, cilEnvelopeOpen, cilShieldAlt, cilSave, cilArrowLeft, cilPhone } from '@coreui/icons';
import CustomAlert from '../components/CustomAlert';
import { apiService } from '../services/api';

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    mobile: '',
    password: '',
    user_type: 1
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
      const response = await apiService.authFetch('http://3.110.153.105:3000/api/v1/register', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          device_id: ''
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('User created successfully:', result);
        // Show success alert
        showAlert('Success', 'User created successfully', 'success');
      } else {
        const data = await response.json().catch(() => ({}));
        console.error('Failed to create user:', response.statusText);
        // Show error alert
        showAlert('Error', data?.message || 'Failed to create user. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      // Show error alert
      showAlert('Error', 'An error occurred while creating user. Please try again.', 'error');
    }
  };

  return (
    <div className="add-user-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="d-flex align-items-center gap-3">
          {/* <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
            <CIcon icon={cilArrowLeft} />
            Back
          </button> */}
          <div>
            <h1>Add New User</h1>
            <p>Create a new user account</p>
          </div>
        </div>
      </div>

      {/* Add User Form */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
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

            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                <CIcon icon={cilUser} className="me-2" />
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
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

            <div className="mb-3">
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

            <div className="form-actions d-flex gap-3">
              <button type="submit" className="btn btn-primary d-flex align-items-center gap-2">
                <CIcon icon={cilSave} />
                Submit
              </button>
              {/* <button type="button" className="btn btn-outline-secondary">
                Cancel
              </button> */}
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
            navigate('/users/all');
          }
        }}
      />
    </div>
  );
};

export default AddUser; 