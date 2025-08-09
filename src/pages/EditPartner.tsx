import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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

interface Partner {
  id: number;
  organization_id: number | null;
  fullname: string;
  email: string;
  mobile: string;
  user_type: string;
  profile_image: string | null;
  device_id: string | null;
  type_of_establishment: string;
  name_of_establishment: string;
  ownership_of_property: string;
  working_days: string;
  opening_time: string | null;
  internet_type: string;
  no_of_seat_available_of_coworking: number;
  area_in_sqft: number;
  total_seating_capacity: number;
  cabins: number;
  current_occupancy_capacity: number;
  complete_address: string;
  pictures_of_the_space: string | null;
  city: string;
  status: number;
  userText: string;
  created_at: string;
}

const EditPartner = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    password: '',
    organization_id: '',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const initializePartnerData = () => {
    // Get partner data from navigation state
    const partnerData = location.state?.partner as Partner;
    
    if (!partnerData) {
      setError('Partner data not found. Please go back and try again.');
      return;
    }
    
    setPartner(partnerData);
    
    // Split fullname into first and last name
    const nameParts = partnerData.fullname.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    setFormData({
      first_name: firstName,
      last_name: lastName,
      email: partnerData.email,
      phone: partnerData.mobile,
      alternatePhone: '',
      password: '',
      organization_id: partnerData.organization_id?.toString() || '',
      type_of_establishment: partnerData.type_of_establishment,
      working_days: partnerData.working_days,
      opening_time: partnerData.opening_time || '',
      internet_type: partnerData.internet_type,
      no_of_seat_available_of_coworking: partnerData.no_of_seat_available_of_coworking.toString(),
      area_in_sqft: partnerData.area_in_sqft.toString(),
      total_seating_capacity: partnerData.total_seating_capacity.toString(),
      cabins: partnerData.cabins.toString(),
      current_occupancy_capacity: partnerData.current_occupancy_capacity.toString(),
      name_of_establishment: partnerData.name_of_establishment,
      complete_address: partnerData.complete_address,
      ownership_of_property: partnerData.ownership_of_property,
      city: partnerData.city
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await apiService.authFetch(`http://3.110.153.105:3000/api/v1/vendor/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        showAlert('Success', 'Partner updated successfully', 'success');
        // Navigate back to partners list after a short delay
        setTimeout(() => {
          navigate('/partners/all');
        }, 1500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        showAlert('Error', errorData.message || 'Failed to update partner', 'error');
      }
    } catch (error) {
      console.error('Error updating partner:', error);
      showAlert('Error', 'An error occurred while updating partner', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/partners/all');
  };

  useEffect(() => {
    initializePartnerData();
  }, []);



  if (error) {
    return (
      <div className="edit-partner-container">
        <div className="page-header">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={handleBack}>
              <CIcon icon={cilArrowLeft} />
              Back
            </button>
            <div>
              <h1>Edit Partner</h1>
              <p>Update partner information</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-partner-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={handleBack}>
            <CIcon icon={cilArrowLeft} />
            Back
          </button>
          <div>
            <h1>Edit Partner</h1>
            <p>Update partner information</p>
          </div>
        </div>
      </div>

      {/* Edit Partner Form */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="first_name" className="form-label">
                    <CIcon icon={cilUser} className="me-2" />
                    First Name
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
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="last_name" className="form-label">
                    <CIcon icon={cilUser} className="me-2" />
                    Last Name
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
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
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
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    <CIcon icon={cilPhone} className="me-2" />
                    Phone Number
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
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
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
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <CIcon icon={cilShieldAlt} className="me-2" />
                    Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="organization_id" className="form-label">
                    <CIcon icon={cilBuilding} className="me-2" />
                    Organization ID
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="organization_id"
                    name="organization_id"
                    value={formData.organization_id}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="type_of_establishment" className="form-label">
                    <CIcon icon={cilBuilding} className="me-2" />
                    Type of Establishment
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="type_of_establishment"
                    name="type_of_establishment"
                    value={formData.type_of_establishment}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="working_days" className="form-label">
                    <CIcon icon={cilCalendar} className="me-2" />
                    Working Days
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="working_days"
                    name="working_days"
                    value={formData.working_days}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="opening_time" className="form-label">
                    <CIcon icon={cilClock} className="me-2" />
                    Opening Time
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="opening_time"
                    name="opening_time"
                    value={formData.opening_time}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="internet_type" className="form-label">
                    <CIcon icon={cilSettings} className="me-2" />
                    Internet Type
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="internet_type"
                    name="internet_type"
                    value={formData.internet_type}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="no_of_seat_available_of_coworking" className="form-label">
                    <CIcon icon={cilPeople} className="me-2" />
                    Available Coworking Seats
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
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="area_in_sqft" className="form-label">
                    <CIcon icon={cilChart} className="me-2" />
                    Area in Sq Ft
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
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="total_seating_capacity" className="form-label">
                    <CIcon icon={cilPeople} className="me-2" />
                    Total Seating Capacity
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
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="cabins" className="form-label">
                    <CIcon icon={cilBuilding} className="me-2" />
                    Number of Cabins
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
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="current_occupancy_capacity" className="form-label">
                    <CIcon icon={cilPeople} className="me-2" />
                    Current Occupancy Capacity
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
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="name_of_establishment" className="form-label">
                    <CIcon icon={cilBuilding} className="me-2" />
                    Name of Establishment
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
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="ownership_of_property" className="form-label">
                    <CIcon icon={cilHome} className="me-2" />
                    Ownership of Property
                  </label>
                  <select
                    className="form-select"
                    id="ownership_of_property"
                    name="ownership_of_property"
                    value={formData.ownership_of_property}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select ownership type</option>
                    <option value="Owned">Owned</option>
                    <option value="Rented">Rented</option>
                    <option value="Leased">Leased</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="city" className="form-label">
                    <CIcon icon={cilMap} className="me-2" />
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
            </div>

            <div className="mb-3">
              <label htmlFor="complete_address" className="form-label">
                <CIcon icon={cilMap} className="me-2" />
                Complete Address
              </label>
              <textarea
                className="form-control"
                id="complete_address"
                name="complete_address"
                rows={3}
                value={formData.complete_address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary d-flex align-items-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Saving...</span>
                    </div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} />
                    Update Partner
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleBack}
                disabled={saving}
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
        showConfirm={false}
      />
    </div>
  );
};

export default EditPartner; 