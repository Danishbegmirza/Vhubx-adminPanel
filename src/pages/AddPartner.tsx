import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { 
  cilUser, 
  cilEnvelopeOpen, 
  cilShieldAlt, 
  cilSave, 
  cilArrowLeft, 
  cilPhone, 
  cilBuilding, 
  cilClock, 
  cilSettings, 
  cilPeople, 
  cilMap, 
  cilHome,
  cilCalendar,
  cilChart,
  cilList
} from '@coreui/icons';
import CustomAlert from '../components/CustomAlert';
import { apiService } from '../services/api';
import { config } from '../config/env';

const AddPartner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    password: '',
    type_of_establishment: '',
    working_days: '',
    opening_time: '',
    internet_type: '',
    no_of_seat_available_of_coworking: '',
    area_in_sqft: '',
    total_seating_capacity: '',
    cabins: '',
    current_occupancy_capacity: '',
    name_of_establishment: '',
    complete_address: '',
    ownership_of_property: '',
    city: ''
  });

  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    
    try {
      const response = await apiService.authFetch(`${config.API_BASE_URL}/vender/add`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Partner created successfully:', result);
        showAlert('Success', 'Partner created successfully!', 'success');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to create partner:', response.statusText, errorData);
        showAlert('Error', errorData.message || 'Failed to create partner. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error creating partner:', error);
      showAlert('Error', 'An error occurred while creating partner. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-partner-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="d-flex align-items-center gap-3">
          <div>
            <h1>Add New Partner</h1>
            <p>Create a new partner/vendor account</p>
          </div>
        </div>
      </div>

      {/* Add Partner Form */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="row mb-4">
              <div className="col-12">
                <h5 className="mb-3 text-primary">
                  <CIcon icon={cilUser} className="me-2" />
                  Personal Information
                </h5>
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="first_name" className="form-label">
                  <CIcon icon={cilUser} className="me-2" />
                  First Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="last_name" className="form-label">
                  <CIcon icon={cilUser} className="me-2" />
                  Last Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">
                  <CIcon icon={cilEnvelopeOpen} className="me-2" />
                  Email Address *
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
                <label htmlFor="phone" className="form-label">
                  <CIcon icon={cilPhone} className="me-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="alternatePhone" className="form-label">
                  <CIcon icon={cilPhone} className="me-2" />
                  Alternate Phone
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="alternatePhone"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="password" className="form-label">
                  <CIcon icon={cilShieldAlt} className="me-2" />
                  Password *
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

            {/* Establishment Information Section */}
            <div className="row mb-4">
              <div className="col-12">
                <h5 className="mb-3 text-primary">
                  <CIcon icon={cilBuilding} className="me-2" />
                  Establishment Information
                </h5>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="name_of_establishment" className="form-label">
                  <CIcon icon={cilBuilding} className="me-2" />
                  Name of Establishment *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name_of_establishment"
                  name="name_of_establishment"
                  value={formData.name_of_establishment}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="type_of_establishment" className="form-label">
                  <CIcon icon={cilBuilding} className="me-2" />
                  Type of Establishment *
                </label>
                <select
                  className="form-control"
                  id="type_of_establishment"
                  name="type_of_establishment"
                  value={formData.type_of_establishment}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Coworking">Coworking</option>
                  <option value="Office">Office</option>
                  <option value="Meeting Room">Meeting Room</option>
                  <option value="Event Space">Event Space</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="working_days" className="form-label">
                  <CIcon icon={cilCalendar} className="me-2" />
                  Working Days *
                </label>
                <select
                  className="form-control"
                  id="working_days"
                  name="working_days"
                  value={formData.working_days}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Working Days</option>
                  <option value="Mon-Fri">Mon-Fri</option>
                  <option value="Mon-Sat">Mon-Sat</option>
                  <option value="Sun-Sat">Sun-Sat</option>
                  <option value="Weekdays">Weekdays (Mon-Fri)</option>
                  <option value="Weekends">Weekends (Sat-Sun)</option>
                  <option value="All Days">All Days</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="opening_time" className="form-label">
                  <CIcon icon={cilClock} className="me-2" />
                  Opening Time *
                </label>
                <select
                  className="form-control"
                  id="opening_time"
                  name="opening_time"
                  value={formData.opening_time}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Opening Time</option>
                  <option value="12:00 AM">12:00 AM</option>
                  <option value="1:00 AM">1:00 AM</option>
                  <option value="2:00 AM">2:00 AM</option>
                  <option value="3:00 AM">3:00 AM</option>
                  <option value="4:00 AM">4:00 AM</option>
                  <option value="5:00 AM">5:00 AM</option>
                  <option value="6:00 AM">6:00 AM</option>
                  <option value="7:00 AM">7:00 AM</option>
                  <option value="8:00 AM">8:00 AM</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="6:00 PM">6:00 PM</option>
                  <option value="7:00 PM">7:00 PM</option>
                  <option value="8:00 PM">8:00 PM</option>
                  <option value="9:00 PM">9:00 PM</option>
                  <option value="10:00 PM">10:00 PM</option>
                  <option value="11:00 PM">11:00 PM</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="internet_type" className="form-label">
                  <CIcon icon={cilSettings} className="me-2" />
                  Internet Type *
                </label>
                <select
                  className="form-control"
                  id="internet_type"
                  name="internet_type"
                  value={formData.internet_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Internet Type</option>
                  <option value="Fiber">Fiber</option>
                  <option value="Broadband">Broadband</option>
                  <option value="WiFi">WiFi</option>
                  <option value="4G/5G">4G/5G</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="ownership_of_property" className="form-label">
                  <CIcon icon={cilHome} className="me-2" />
                  Ownership of Property *
                </label>
                <select
                  className="form-control"
                  id="ownership_of_property"
                  name="ownership_of_property"
                  value={formData.ownership_of_property}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Ownership</option>
                  <option value="Owned">Owned</option>
                  <option value="Rented">Rented</option>
                  <option value="Leased">Leased</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Capacity Information Section */}
            <div className="row mb-4">
              <div className="col-12">
                <h5 className="mb-3 text-primary">
                  <CIcon icon={cilPeople} className="me-2" />
                  Capacity Information
                </h5>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="no_of_seat_available_of_coworking" className="form-label">
                  <CIcon icon={cilList} className="me-2" />
                  Available Coworking Seats *
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="no_of_seat_available_of_coworking"
                  name="no_of_seat_available_of_coworking"
                  value={formData.no_of_seat_available_of_coworking}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="total_seating_capacity" className="form-label">
                  <CIcon icon={cilPeople} className="me-2" />
                  Total Seating Capacity *
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="total_seating_capacity"
                  name="total_seating_capacity"
                  value={formData.total_seating_capacity}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="cabins" className="form-label">
                  <CIcon icon={cilBuilding} className="me-2" />
                  Number of Cabins *
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="cabins"
                  name="cabins"
                  value={formData.cabins}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="current_occupancy_capacity" className="form-label">
                  <CIcon icon={cilPeople} className="me-2" />
                  Current Occupancy Capacity *
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="current_occupancy_capacity"
                  name="current_occupancy_capacity"
                  value={formData.current_occupancy_capacity}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="area_in_sqft" className="form-label">
                  <CIcon icon={cilChart} className="me-2" />
                  Area in Square Feet *
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="area_in_sqft"
                  name="area_in_sqft"
                  value={formData.area_in_sqft}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Address Information Section */}
            <div className="row mb-4">
              <div className="col-12">
                <h5 className="mb-3 text-primary">
                  <CIcon icon={cilMap} className="me-2" />
                  Address Information
                </h5>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="city" className="form-label">
                  <CIcon icon={cilMap} className="me-2" />
                  City *
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

              <div className="col-md-12 mb-3">
                <label htmlFor="complete_address" className="form-label">
                  <CIcon icon={cilMap} className="me-2" />
                  Complete Address *
                </label>
                <textarea
                  className="form-control"
                  id="complete_address"
                  name="complete_address"
                  value={formData.complete_address}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const { name, value } = e.target;
                    setFormData(prev => ({
                      ...prev,
                      [name]: value
                    }));
                  }}
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="form-actions d-flex gap-3">
              <button 
                type="submit" 
                className="btn btn-primary d-flex align-items-center gap-2"
                disabled={isLoading}
              >
                <CIcon icon={cilSave} />
                {isLoading ? 'Creating Partner...' : 'Create Partner'}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/partners/all')}
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
            navigate('/partners/all');
          }
        }}
      />
    </div>
  );
};

export default AddPartner; 