import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { 
  cilBuilding, 
  cilMap, 
  cilHome, 
  cilSave, 
  cilArrowLeft, 
  cilPhone, 
  cilEnvelopeOpen, 
  cilUser, 
  cilClock, 
  cilSettings, 
  cilPeople, 
  cilCalendar,
  cilChart,
  cilList,
  cilLocationPin,
  cilImage,
  cilCreditCard,
  cilCart,
  cilSpeedometer,
  cilStar,
  cilX,
  cilPlus
} from '@coreui/icons';
import CustomAlert from '../components/CustomAlert';

interface PropertyFormData {
  type_of_establishment: string;
  name_of_establishment: string;
  ownership_of_property: string;
  city: string;
  complete_address: string;
  working_days: string;
  opening_time: string;
  internet_type: string;
  num_of_seats_available_for_coworking: string;
  pictures_of_the_space: File | null;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  categoryId: string;
  subcategoryId: string;
  latitude: string;
  longitude: string;
  area_in_sqft: string;
  cabins: string;
  current_occupancy_percentage: string;
  brand: string;
  center_type: string;
  inventory_type: string;
  product_types: string;
  parking: boolean;
  metro_connectivity: boolean;
  is_popular: boolean;
  price: string;
  min_lock_in_months: string;
  furnishing: string;
  developer: string;
  building_grade: string;
  year_built: string;
  solutions: string;
  connectivity: Array<{
    station_name: string;
    metro_line: string;
    distance_in_m: number;
  }>;
}

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PropertyFormData>({
    type_of_establishment: '',
    name_of_establishment: '',
    ownership_of_property: '',
    city: '',
    complete_address: '',
    working_days: '',
    opening_time: '',
    internet_type: '',
    num_of_seats_available_for_coworking: '',
    pictures_of_the_space: null,
    first_name: '',
    last_name: '',
    mobile: '',
    email: '',
    categoryId: '1',
    subcategoryId: '4',
    latitude: '',
    longitude: '',
    area_in_sqft: '',
    cabins: '',
    current_occupancy_percentage: '',
    brand: '',
    center_type: '',
    inventory_type: '',
    product_types: '',
    parking: false,
    metro_connectivity: false,
    is_popular: false,
    price: '',
    min_lock_in_months: '',
    furnishing: '',
    developer: '',
    building_grade: '',
    year_built: '',
    solutions: '',
    connectivity: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [connectivityIndex, setConnectivityIndex] = useState(0);

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
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      pictures_of_the_space: file
    }));
  };

  const addConnectivity = () => {
    setFormData(prev => ({
      ...prev,
      connectivity: [...prev.connectivity, {
        station_name: '',
        metro_line: '',
        distance_in_m: 0
      }]
    }));
    setConnectivityIndex(prev => prev + 1);
  };

  const removeConnectivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      connectivity: prev.connectivity.filter((_, i) => i !== index)
    }));
  };

  const updateConnectivity = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      connectivity: prev.connectivity.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showAlert('Error', 'Authentication token not found. Please login again.', 'error');
        setIsLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      const payload = { ...formData, categoryId: '1' };
      
      // Add all form fields to FormData
      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'pictures_of_the_space' && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (key === 'connectivity') {
          // Handle connectivity array
          (value as Array<any>).forEach((item, index) => {
            formDataToSend.append(`connectivity[]`, JSON.stringify(item));
          });
        } else if (typeof value === 'boolean') {
          formDataToSend.append(key, value.toString());
        } else {
          formDataToSend.append(key, value as string);
        }
      });

      // Conditionally append organization_id for non-type-2 users
      try {
        const storedUserType = localStorage.getItem('userType');
        const userTypeValue = storedUserType ? parseInt(storedUserType) : null;
        if (userTypeValue !== null && userTypeValue !== 4) {
          const userDataRaw = localStorage.getItem('userData');
          const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
          const organizationId = userData.organizationId ?? userData.organization_id ?? null;
          if (organizationId) {
            formDataToSend.append('organization_id', String(organizationId));
          }
        }
      } catch (e) {
        console.warn('Failed to parse userData for organization_id', e);
      }

      const response = await fetch('http://3.110.153.105:3000/api/v1/add/property', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('Success', 'Property added successfully!', 'success');
        setTimeout(() => {
          navigate('/property/list');
        }, 2000);
      } else {
        showAlert('Error', data.message || 'Failed to add property', 'error');
      }
    } catch (error) {
      console.error('Error adding property:', error);
      showAlert('Error', 'An error occurred while adding the property', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/property/list');
  };

  return (
    <div className="add-property-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button 
              onClick={handleBack}
              className="btn btn-outline-secondary me-3"
            >
              <CIcon icon={cilArrowLeft} />
            </button>
            <div>
              <h2 className="mb-0">Add New Property</h2>
              <p className="text-muted mb-0">Add a new property to the system</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Basic Information */}
                <div className="col-md-6">
                  <h5 className="mb-3">
                    <CIcon icon={cilBuilding} className="me-2" />
                    Basic Information
                  </h5>
                  
                  <div className="mb-3">
                    <label className="form-label">Type of Establishment *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="type_of_establishment"
                      value={formData.type_of_establishment}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="1">Managed office</option>
                      <option value="2">Coworking Space</option>
                      <option value="3">Meeting room</option>
                      <option value="4">Virtual office</option>
                      <option value="5">Day pass</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Name of Establishment *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name_of_establishment"
                      value={formData.name_of_establishment}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Ownership of Property *</label>
                    <select
                      className="form-select"
                      name="ownership_of_property"
                      value={formData.ownership_of_property}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Ownership</option>
                      <option value="Owned">Owned</option>
                      <option value="Leased">Leased</option>
                      <option value="Rented">Rented</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Complete Address *</label>
                    <textarea
                      className="form-control"
                      name="complete_address"
                      value={formData.complete_address}
                      onChange={handleInputChange}
                      rows={3}
                      required
                    />
                  </div>
                </div>

                {/* Working Details */}
                <div className="col-md-6">
                  <h5 className="mb-3">
                    <CIcon icon={cilClock} className="me-2" />
                    Working Details
                  </h5>
                  
                  <div className="mb-3">
                    <label className="form-label">Working Days *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="working_days"
                      value={formData.working_days}
                      onChange={handleInputChange}
                      placeholder="e.g., 6 days in a week"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Opening Time *</label>
                    <input
                      type="time"
                      className="form-control"
                      name="opening_time"
                      value={formData.opening_time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Internet Type *</label>
                    <select
                      className="form-select"
                      name="internet_type"
                      value={formData.internet_type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Internet Type</option>
                      <option value="Fiber Optic">Fiber Optic</option>
                      <option value="Broadband">Broadband</option>
                      <option value="WiFi">WiFi</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Number of Seats Available *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="num_of_seats_available_for_coworking"
                      value={formData.num_of_seats_available_for_coworking}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Pictures of the Space</label>
                    <input
                      type="file"
                      className="form-control"
                      name="pictures_of_the_space"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>

              <hr />

              {/* Contact Information */}
              <div className="row">
                <div className="col-md-6">
                  <h5 className="mb-3">
                    <CIcon icon={cilUser} className="me-2" />
                    Contact Information
                  </h5>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Mobile *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Property Details */}
                <div className="col-md-6">
                  <h5 className="mb-3">
                    <CIcon icon={cilHome} className="me-2" />
                    Property Details
                  </h5>
                  
                  {/* <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Subcategory ID *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="subcategoryId"
                        value={formData.subcategoryId}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div> */}

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Latitude *</label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Longitude *</label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Area in Sq Ft *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="area_in_sqft"
                      value={formData.area_in_sqft}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <hr />

              {/* Additional Details */}
              <div className="row">
                <div className="col-md-6">
                  <h5 className="mb-3">
                    <CIcon icon={cilSettings} className="me-2" />
                    Additional Details
                  </h5>
                  
                  <div className="mb-3">
                    <label className="form-label">Cabins</label>
                    <select
                      className="form-select"
                      name="cabins"
                      value={formData.cabins}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Cabin Status</option>
                      <option value="Available">Available</option>
                      <option value="Not Available">Not Available</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Current Occupancy Percentage</label>
                    <select
                      className="form-select"
                      name="current_occupancy_percentage"
                      value={formData.current_occupancy_percentage}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Occupancy</option>
                      <option value="0-20%">0-20%</option>
                      <option value="20-50%">20-50%</option>
                      <option value="50-80%">50-80%</option>
                      <option value="80-100%">80-100%</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Brand</label>
                    <input
                      type="text"
                      className="form-control"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Center Type</label>
                    <input
                      type="text"
                      className="form-control"
                      name="center_type"
                      value={formData.center_type}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Inventory Type</label>
                    <input
                      type="text"
                      className="form-control"
                      name="inventory_type"
                      value={formData.inventory_type}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <h5 className="mb-3">
                    <CIcon icon={cilCreditCard} className="me-2" />
                    Pricing & Features
                  </h5>
                  
                  <div className="mb-3">
                    <label className="form-label">Product Types</label>
                    <select
                      className="form-select"
                      name="product_types"
                      value={formData.product_types}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Product Type</option>
                      <option value="day_pass">Day Pass</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Minimum Lock-in Months</label>
                    <input
                      type="number"
                      className="form-control"
                      name="min_lock_in_months"
                      value={formData.min_lock_in_months}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Furnishing</label>
                    <select
                      className="form-select"
                      name="furnishing"
                      value={formData.furnishing}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Furnishing</option>
                      <option value="Furnished">Furnished</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Solutions</label>
                    <input
                      type="text"
                      className="form-control"
                      name="solutions"
                      value={formData.solutions}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <hr />

              {/* Building Information */}
              <div className="row">
                <div className="col-md-6">
                  <h5 className="mb-3">
                    <CIcon icon={cilBuilding} className="me-2" />
                    Building Information
                  </h5>
                  
                  <div className="mb-3">
                    <label className="form-label">Developer</label>
                    <input
                      type="text"
                      className="form-control"
                      name="developer"
                      value={formData.developer}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Building Grade</label>
                    <select
                      className="form-select"
                      name="building_grade"
                      value={formData.building_grade}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Grade</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Year Built</label>
                    <input
                      type="number"
                      className="form-control"
                      name="year_built"
                      value={formData.year_built}
                      onChange={handleInputChange}
                      min="1900"
                      max="2030"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <h5 className="mb-3">
                    <CIcon icon={cilStar} className="me-2" />
                    Features
                  </h5>
                  
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="parking"
                        checked={formData.parking}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label">
                        Parking Available
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="metro_connectivity"
                        checked={formData.metro_connectivity}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label">
                        Metro Connectivity
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="is_popular"
                        checked={formData.is_popular}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label">
                        Popular Property
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              {/* Metro Connectivity Details */}
              <div className="row">
                <div className="col-12">
                  <h5 className="mb-3">
                    <CIcon icon={cilLocationPin} className="me-2" />
                    Metro Connectivity Details
                  </h5>
                  
                  {formData.connectivity.map((item, index) => (
                    <div key={index} className="row mb-3 border rounded p-3">
                      <div className="col-md-4">
                        <label className="form-label">Station Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={item.station_name}
                          onChange={(e) => updateConnectivity(index, 'station_name', e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Metro Line</label>
                        <input
                          type="text"
                          className="form-control"
                          value={item.metro_line}
                          onChange={(e) => updateConnectivity(index, 'metro_line', e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Distance (m)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={item.distance_in_m}
                          onChange={(e) => updateConnectivity(index, 'distance_in_m', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="col-md-1 d-flex align-items-end">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeConnectivity(index)}
                        >
                          <CIcon icon={cilX} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={addConnectivity}
                  >
                    <CIcon icon={cilPlus} className="me-2" />
                    Add Metro Station
                  </button>
                </div>
              </div>

              <hr />

              {/* Submit Button */}
              <div className="d-flex justify-content-end gap-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBack}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Adding Property...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilSave} className="me-2" />
                      Add Property
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
};

export default AddProperty; 