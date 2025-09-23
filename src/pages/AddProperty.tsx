import React, { useState, useEffect } from 'react';
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
import { config } from '../config/env';
import { amenityService, Amenity } from '../services/amenityService';

interface PropertyFormData {
  // New fields at the top
  property_name: string;
  brand_chain_name: string;
  establishment_type: string;
  status: string;
  listing_type: string;
  
  // Location fields
  country: string;
  state_region: string;
  city: string;
  locality_micro_market: string;
  full_address: string;
  pincode_zip_code: string;
  nearest_metro_transport: string;
  
  // Property Owner/Operator Details
  operator_company_name: string;
  contact_person: string;
  designation: string;
  contact_number: string;
  email_address: string;
  website_booking_link: string;
  support_contact: string;
  
  // Dynamic Amenities & Facilities
  selectedAmenities: number[];
  
  // Existing fields
  type_of_establishment: string;
  name_of_establishment: string;
  ownership_of_property: string;
  complete_address: string;
  working_days: string;
  opening_time: string;
  internet_type: string;
  num_of_seats_available_for_coworking: string;
  pictures_of_the_space: File | null;
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
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(true);

  // Fetch amenities from API
  const fetchAmenities = async () => {
    try {
      setAmenitiesLoading(true);
      const data = await amenityService.getAmenities();
      setAmenities(data);
    } catch (error) {
      console.error('Error fetching amenities:', error);
      showAlert('Error', 'Failed to load amenities', 'error');
    } finally {
      setAmenitiesLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const [formData, setFormData] = useState<PropertyFormData>({
    // New fields with default values
    property_name: '',
    brand_chain_name: '',
    establishment_type: '',
    status: 'Active',
    listing_type: 'Standard',
    
    // Location fields
    country: '',
    state_region: '',
    city: '',
    locality_micro_market: '',
    full_address: '',
    pincode_zip_code: '',
    nearest_metro_transport: '',
    
    // Property Owner/Operator Details
    operator_company_name: '',
    contact_person: '',
    designation: '',
    contact_number: '',
    email_address: '',
    website_booking_link: '',
    support_contact: '',
    
    // Dynamic Amenities & Facilities
    selectedAmenities: [],
    
    // Existing fields
    type_of_establishment: '',
    name_of_establishment: '',
    ownership_of_property: '',
    complete_address: '',
    working_days: '',
    opening_time: '',
    internet_type: '',
    num_of_seats_available_for_coworking: '',
    pictures_of_the_space: null,
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
  const [establishmentTypes, setEstablishmentTypes] = useState<Array<{id: number, establishment_type: string, status: number}>>([]);

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

  const handleAmenityChange = (amenityId: number, isChecked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedAmenities: isChecked
        ? [...prev.selectedAmenities, amenityId]
        : prev.selectedAmenities.filter(id => id !== amenityId)
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

  // Fetch establishment types on component mount
  useEffect(() => {
    const fetchEstablishmentTypes = async () => {
      try {
        const response = await fetch('http://107.22.44.203:3000/api/v1/workspace/establishment/list');
        const data = await response.json();
        
        if (data.status && data.data?.data) {
          setEstablishmentTypes(data.data.data);
        }
      } catch (error) {
        console.error('Error fetching establishment types:', error);
      }
    };

    fetchEstablishmentTypes();
  }, []);

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
      
      // Map form fields to API parameters
      formDataToSend.append('type_of_establishment', formData.establishment_type || formData.type_of_establishment);
      formDataToSend.append('name_of_establishment', formData.name_of_establishment || formData.property_name);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('state', formData.state_region);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('locality', formData.locality_micro_market);
      formDataToSend.append('pin_code', formData.pincode_zip_code);
      formDataToSend.append('complete_address', formData.full_address || formData.complete_address);
      formDataToSend.append('owner_company_name', formData.operator_company_name);
      formDataToSend.append('contact_person', formData.contact_person);
      formDataToSend.append('contact_number', formData.contact_number);
      formDataToSend.append('designation', formData.designation);
      formDataToSend.append('email_address', formData.email_address);
      formDataToSend.append('support_contact', formData.support_contact);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('subcategoryId', formData.subcategoryId);
      formDataToSend.append('latitude', formData.latitude);
      formDataToSend.append('longitude', formData.longitude);
      formDataToSend.append('brand', formData.brand_chain_name || formData.brand);
      formDataToSend.append('product_types', formData.product_types);
      formDataToSend.append('parking', formData.parking.toString());
      formDataToSend.append('metro_connectivity', formData.metro_connectivity.toString());
      formDataToSend.append('is_popular', formData.is_popular.toString());

      // Handle connectivity array
      formData.connectivity.forEach((item) => {
        formDataToSend.append('connectivity[]', JSON.stringify({
          station_name: item.station_name,
          metro_line: item.metro_line,
          distance_in_m: item.distance_in_m
        }));
      });

      // Handle pictures
      if (formData.pictures_of_the_space) {
        formDataToSend.append('pictures_of_the_space', formData.pictures_of_the_space);
      }

      // Handle amenities - convert selectedAmenities array to the expected format
      formData.selectedAmenities.forEach((amenityId) => {
        formDataToSend.append('amenities[]', JSON.stringify({
          amenity_id: amenityId,
          is_included: true
        }));
      });

      // Add unselected amenities as false (if needed by API)
      const allAmenityIds = amenities.map(a => a.id);
      const unselectedAmenities = allAmenityIds.filter(id => !formData.selectedAmenities.includes(id));
      unselectedAmenities.forEach((amenityId) => {
        formDataToSend.append('amenities[]', JSON.stringify({
          amenity_id: amenityId,
          is_included: false
        }));
      });

      // Conditionally append organization_id for non-type-4 users
      try {
        const storedUserType = localStorage.getItem('userType');
        const userTypeValue = storedUserType ? parseInt(storedUserType) : null;
        if (userTypeValue !== null && userTypeValue !== 4) {
          const userDataRaw = localStorage.getItem('userData');
          const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
          const organizationId = userData.organizationId ?? userData.organization_id ?? null;
          if (organizationId) {
            formDataToSend.append('orgnization_id', String(organizationId)); // Note: API uses 'orgnization_id' (typo in API)
          }
        }
      } catch (e) {
        console.warn('Failed to parse userData for organization_id', e);
      }

      const response = await fetch(`${config.API_BASE_URL}/add/property`, {
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
              {/* New Property Overview Section */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="mb-3">
                    <CIcon icon={cilStar} className="me-2" />
                    Property Overview
                  </h5>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Property Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="property_name"
                      value={formData.property_name}
                      onChange={handleInputChange}
                      placeholder="Enter property name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Brand/Chain Name</label>
                    <select
                      className="form-select"
                      name="brand_chain_name"
                      value={formData.brand_chain_name}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Brand/Chain</option>
                      <option value="WeWork">WeWork</option>
                      <option value="Regus">Regus</option>
                      <option value="Awfis">Awfis</option>
                      <option value="91springboard">91springboard</option>
                      <option value="Innov8">Innov8</option>
                      <option value="IndiQube">IndiQube</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Status *</label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Coming Soon">Coming Soon</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Listing Type *</label>
                    <select
                      className="form-select"
                      name="listing_type"
                      value={formData.listing_type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Standard">Standard</option>
                      <option value="Featured">Featured</option>
                      <option value="Partner Listing">Partner Listing</option>
                    </select>
                  </div>

                  
                </div>
              </div>

              <hr />

              {/* Location Details */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="mb-3">
                    <CIcon icon={cilLocationPin} className="me-2" />
                    Location Details
                  </h5>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Country *</label>
                    <select
                      className="form-select"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Singapore">Singapore</option>
                      <option value="UAE">UAE</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">State/Region *</label>
                    <select
                      className="form-select"
                      name="state_region"
                      value={formData.state_region}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select State/Region</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Pune">Pune</option>
                      <option value="Gurgaon">Gurgaon</option>
                      <option value="Noida">Noida</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">City *</label>
                    <select
                      className="form-select"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select City</option>
                      <option value="New Delhi">New Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Pune">Pune</option>
                      <option value="Gurgaon">Gurgaon</option>
                      <option value="Noida">Noida</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Locality / Micro-market *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="locality_micro_market"
                      value={formData.locality_micro_market}
                      onChange={handleInputChange}
                      placeholder="e.g., Connaught Place, Bandra Kurla Complex"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Full Address *</label>
                    <textarea
                      className="form-control"
                      name="full_address"
                      value={formData.full_address}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Enter complete address with building name, floor, etc."
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Pincode/Zip Code *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="pincode_zip_code"
                      value={formData.pincode_zip_code}
                      onChange={handleInputChange}
                      placeholder="e.g., 110001"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-12">
                  <h6 className="mb-3">
                    <CIcon icon={cilMap} className="me-2" />
                    Google Map Coordinates
                  </h6>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Latitude *</label>
                        <input
                          type="number"
                          step="any"
                          className="form-control"
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          placeholder="e.g., 28.6139"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Longitude *</label>
                        <input
                          type="number"
                          step="any"
                          className="form-control"
                          name="longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          placeholder="e.g., 77.2090"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="alert alert-info">
                    <small>
                      <CIcon icon={cilMap} className="me-1" />
                      You can get coordinates from Google Maps by right-clicking on the location and selecting "What's here?"
                    </small>
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-12">
                  <h6 className="mb-3">
                    <CIcon icon={cilLocationPin} className="me-2" />
                    Metro Connectivity Details
                  </h6>
                  
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

              {/* Space Information */}
              <div className="row">
                <div className="col-12">
                  <h5 className="mb-3">
                    <CIcon icon={cilBuilding} className="me-2" />
                    Space Information
                  </h5>
                </div>
                
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-md-6">
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
                        <label className="form-label">Type of Establishment *</label>
                        <select
                          className="form-select"
                          name="type_of_establishment"
                          value={formData.type_of_establishment}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Establishment Type</option>
                          {establishmentTypes.map(type => (
                            <option key={type.id} value={type.establishment_type}>{type.establishment_type}</option>
                          ))}
                        </select>
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
                    </div>

                    <div className="col-md-6">
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

                      <div className="mb-3">
                        <label className="form-label">Product Types</label>
                        <select
                          className="form-select"
                          name="product_types"
                          value={formData.product_types}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Product Type</option>
                          <option value="Coworking Space">Coworking Space</option>
                          <option value="Meeting Room">Meeting Room</option>
                          <option value="Private Office">Private Office</option>
                          <option value="Virtual Office">Virtual Office</option>
                          <option value="Day Pass">Day Pass</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-12">
                      <h6 className="mb-3">
                        <CIcon icon={cilStar} className="me-2" />
                        Additional Features
                      </h6>
                    </div>
                    
                    <div className="col-md-4">
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

                    <div className="col-md-4">
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

                    <div className="col-md-4">
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
              </div>

              <hr />


              {/* Property Details
              <div className="row">
                <div className="col-md-6">
                  <h5 className="mb-3">
                    <CIcon icon={cilHome} className="me-2" />
                    Property Details
                  </h5>
                  
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
              </div> */}

              {/* <hr /> */}

              {/* Dynamic Amenities & Facilities */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="mb-3">
                    <CIcon icon={cilSettings} className="me-2" />
                    Amenities & Facilities
                  </h5>
                  <p className="text-muted mb-4">Select all amenities and facilities available at this property</p>
                </div>

                {amenitiesLoading ? (
                  <div className="col-12 text-center py-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading amenities...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading amenities...</p>
                  </div>
                ) : (
                  <>
                    {/* Group amenities by category */}
                    {['Workspace Amenities', 'Facilities', 'Access & Convenience', 'Community/Value Add'].map((category) => {
                      const categoryAmenities = amenities.filter(amenity => amenity.category === category);
                      
                      if (categoryAmenities.length === 0) return null;

                      const getCategoryIcon = (cat: string) => {
                        switch (cat) {
                          case 'Workspace Amenities': return cilBuilding;
                          case 'Facilities': return cilSettings;
                          case 'Access & Convenience': return cilLocationPin;
                          case 'Community/Value Add': return cilPeople;
                          default: return cilSettings;
                        }
                      };

                      return (
                        <div key={category} className="col-md-6 mb-4">
                          <h6 className="mb-3 text-primary">
                            <CIcon icon={getCategoryIcon(category)} className="me-2" />
                            {category}
                          </h6>
                          
                          <div className="row">
                            {categoryAmenities.map((amenity, index) => (
                              <div key={amenity.id} className="col-md-6 mb-3">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`amenity-${amenity.id}`}
                                    checked={formData.selectedAmenities.includes(amenity.id)}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      setFormData(prev => ({
                                        ...prev,
                                        selectedAmenities: isChecked
                                          ? [...prev.selectedAmenities, amenity.id]
                                          : prev.selectedAmenities.filter(id => id !== amenity.id)
                                      }));
                                    }}
                                  />
                                  <label className="form-check-label" htmlFor={`amenity-${amenity.id}`}>
                                    {amenity.label}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              <hr />

               {/* Property Owner / Operator Details */}
               <div className="row">
                <div className="col-md-6">
                  <h5 className="mb-3">
                    <CIcon icon={cilUser} className="me-2" />
                    Property Owner / Operator Details
                  </h5>
                  
                  <div className="mb-3">
                    <label className="form-label">Operator/Owner Company Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="operator_company_name"
                      value={formData.operator_company_name}
                      onChange={handleInputChange}
                      placeholder="Enter company name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Contact Person (Onsite Manager) *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleInputChange}
                      placeholder="Enter contact person name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Designation *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="e.g., Property Manager, Operations Head"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Contact Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <h5 className="mb-3">
                    <CIcon icon={cilEnvelopeOpen} className="me-2" />
                    Contact & Support Information
                  </h5>
                  
                  <div className="mb-3">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email_address"
                      value={formData.email_address}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Website / Booking Link</label>
                    <input
                      type="url"
                      className="form-control"
                      name="website_booking_link"
                      value={formData.website_booking_link}
                      onChange={handleInputChange}
                      placeholder="https://example.com or booking link"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Support Contact (24/7 Helpline)</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="support_contact"
                      value={formData.support_contact}
                      onChange={handleInputChange}
                      placeholder="24/7 helpline number (optional)"
                    />
                  </div>
                </div>
              </div>

              <hr />

              {/* Additional Details */}
              {/* <div className="row">
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
              </div> */}

              {/* <hr /> */}

              {/* Building Information */}
              {/* <div className="row">
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
                      Nearest Metro/Transport Access
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
              </div> */}

              {/* <hr /> */}

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