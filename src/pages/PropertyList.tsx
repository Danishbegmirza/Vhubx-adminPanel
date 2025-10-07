import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { 
  cilSearch, 
  cilPlus, 
  cilFilter, 
  cilCheck, 
  cilX, 
  cilArrowLeft, 
  cilPencil, 
  cilTrash, 
  cilMap, 
  cilBuilding, 
  cilPhone, 
  cilEnvelopeOpen,
  cilLocationPin,
  cilStar,
  cilCart,
  cilSpeedometer
} from '@coreui/icons';
import CustomAlert from '../components/CustomAlert';
import { apiService } from '../services/api';
import { config } from '../config/env';

interface Consultant {
  id: number;
  name: string;
  phone: string;
  photo_url: string;
}

interface Coupon {
  id: number;
  type: string;
  title: string;
  value: number;
  valid_to: string;
  image_url: string;
  valid_from: string;
}

interface Property {
  id: number;
  property_id: string;
  name_of_establishment: string;
  userid: number | null;
  categoryId: number;
  partnerSubmissionId: number | null;
  subcategoryId: number;
  brand: string | null;
  product_types: string;
  product_sub_types?: string;
  inventory_type: string | null;
  parking: number;
  metro_connectivity: number;
  is_popular: number;
  price: number | null;
  min_lock_in_months: number | null;
  latitude: string;
  longitude: string;
  furnishing: string | null;
  developer: string | null;
  building_grade: string | null;
  year_built: string | null;
  solutions: string | null;
  status: number;
  created_date: string | null;
  center_type: string | null;
  num_of_seats_available_for_coworking: number | null;
  area_in_sqft: number | null;
  cabins: string | null;
  current_occupancy_percentage: string | null;
  min_inventory_unit: number | null;
  seating_capacity: number | null;
  consultant: Consultant | {};
  coupons: Coupon[] | null;
  city?: string;
  state_region?: string;
  locality_micro_market?: string;
}

interface ApiResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    spaceList: Property[];
  };
}

const PropertyList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState('all');
  const [subProductTypeFilter, setSubProductTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [subProductTypes, setSubProductTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [productTypesData, setProductTypesData] = useState<Array<{id: number, name: string}>>([]);
  const [subProductTypesData, setSubProductTypesData] = useState<Array<{id: number, name: string}>>([]);
  
  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Custom alert states
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    onConfirm: null as (() => void) | null
  });

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info', onConfirm?: () => void) => {
    setAlertConfig({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: onConfirm || null
    });
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleAlertConfirm = () => {
    if (alertConfig.onConfirm) {
      alertConfig.onConfirm();
    }
    closeAlert();
  };

  const handleAddProperty = () => {
    navigate('/property/add');
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleProductTypeFilterChange = (productType: string) => {
    setProductTypeFilter(productType);
    setSubProductTypeFilter('all'); // Reset sub product type when product type changes
    setCurrentPage(1);
    
    // Fetch sub product types if a product type is selected
    if (productType !== 'all') {
      const selectedProductType = productTypesData.find(type => type.name === productType);
      if (selectedProductType) {
        fetchSubProductTypes(selectedProductType.id);
      }
    } else {
      setSubProductTypesData([]);
      setSubProductTypes([]);
    }
  };

  const handleSubProductTypeFilterChange = (subProductType: string) => {
    setSubProductTypeFilter(subProductType);
    setCurrentPage(1);
  };

  const handleLocationFilterChange = (location: string) => {
    setLocationFilter(location);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchQuery('');
    setProductTypeFilter('all');
    setSubProductTypeFilter('all');
    setLocationFilter('all');
    setCurrentPage(1);
  };

  // Fetch product types from API
  const fetchProductTypes = async () => {
    try {
      const response = await apiService.authFetch(`${config.API_BASE_URL}/property/category`, {
        method: 'GET'
      });

      const data = await response.json();

      if (response.ok && data.status) {
        setProductTypesData(data.data);
        const uniqueProductTypes = Array.from(new Set(data.data.map((type: any) => type.name).filter((name: any) => typeof name === 'string'))) as string[];
        setProductTypes(uniqueProductTypes);
      }
    } catch (error) {
      console.error('Error fetching product types:', error);
    }
  };

  // Fetch sub product types based on selected parent
  const fetchSubProductTypes = async (parentId: number) => {
    try {
      const response = await apiService.authFetch(`${config.API_BASE_URL}/property/category?parentId=${parentId}`, {
        method: 'GET'
      });

      const data = await response.json();

      if (response.ok && data.status) {
        setSubProductTypesData(data.data);
        const uniqueSubProductTypes = Array.from(new Set(data.data.map((type: any) => type.name).filter((name: any) => typeof name === 'string'))) as string[];
        setSubProductTypes(uniqueSubProductTypes);
      } else {
        setSubProductTypesData([]);
        setSubProductTypes([]);
      }
    } catch (error) {
      console.error('Error fetching sub product types:', error);
      setSubProductTypesData([]);
      setSubProductTypes([]);
    }
  };

  const fetchProperties = async (page: number = 1, search: string = '', productType: string = 'all', subProductType: string = 'all', location: string = 'all') => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `${config.API_BASE_URL}/property/list?page=${page}`;
      
      // If userType !== 2, pass organization_id from localStorage
      const storedUserType = localStorage.getItem('userType');
      const userTypeValue = storedUserType ? parseInt(storedUserType) : null;
      if (userTypeValue !== null && userTypeValue !== 4) {
        try {
          const userDataRaw = localStorage.getItem('userData');
          const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
          const organizationId = userData.organizationId ?? userData.organization_id ?? null;
          if (organizationId) {
            url += `&organization_id=${encodeURIComponent(String(organizationId))}`;
          }
        } catch (e) {
          console.warn('Failed to parse userData for organization_id', e);
        }
      }
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      if (productType !== 'all') {
        url += `&product_type=${encodeURIComponent(productType)}`;
      }

      if (subProductType !== 'all') {
        url += `&product_sub_type=${encodeURIComponent(subProductType)}`;
      }

      if (location !== 'all') {
        url += `&city=${encodeURIComponent(location)}`;
      }

      const response = await apiService.authFetch(url, {
        method: 'GET'
      });

      const data: ApiResponse = await response.json();

      if (response.ok && data.status) {
        setProperties(data.data.spaceList);
        setTotalProperties(data.data.spaceList.length);
        setTotalPages(1); // Assuming single page for now
        
        // Extract unique product types for filters
        const uniqueProductTypes = Array.from(new Set(data.data.spaceList.map(property => property.product_types)));
        setProductTypes(uniqueProductTypes);
        
        // Extract unique locations for filters
        const uniqueLocations = Array.from(new Set(data.data.spaceList
          .map(property => property.city)
          .filter(city => city && city.trim() !== '')
        ));
        setLocations(uniqueLocations);
      } else {
        setError(data.message || 'Failed to fetch properties');
        showAlert('Error', data.message || 'Failed to fetch properties', 'error');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('An error occurred while fetching properties');
      showAlert('Error', 'An error occurred while fetching properties', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (property: Property) => {
    setSelectedProperty(property);
    showAlert(
      'Confirm Delete',
      `Are you sure you want to delete this property?`,
      'warning',
      () => deleteProperty(property.id)
    );
  };

  const deleteProperty = async (propertyId: number) => {
    if (!selectedProperty) return;
    
    setActionLoading(true);
    
    try {
      const response = await apiService.authFetch(`${config.API_BASE_URL}/property/delete/${propertyId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok && data.status) {
        showAlert('Success', 'Property deleted successfully!', 'success');
        fetchProperties(currentPage, searchQuery, productTypeFilter, subProductTypeFilter, locationFilter);
      } else {
        showAlert('Error', data.message || 'Failed to delete property', 'error');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      showAlert('Error', 'An error occurred while deleting the property', 'error');
    } finally {
      setActionLoading(false);
      setSelectedProperty(null);
    }
  };

  const handleEdit = (property: Property) => {
    navigate(`/property/edit/${property.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getFeatureIcons = (property: Property) => {
    const icons = [];
    
    if (property.parking) {
      icons.push(<CIcon key="parking" icon={cilCart} className="text-success me-1" title="Parking Available" />);
    }
    
    if (property.metro_connectivity) {
      icons.push(<CIcon key="metro" icon={cilLocationPin} className="text-primary me-1" title="Metro Connectivity" />);
    }
    
    if (property.is_popular) {
      icons.push(<CIcon key="popular" icon={cilStar} className="text-warning me-1" title="Popular Property" />);
    }
    
    return icons;
  };

  const getConsultantInfo = (property: Property) => {
    if (property.consultant && typeof property.consultant === 'object' && 'name' in property.consultant) {
      const consultant = property.consultant as Consultant;
      return {
        name: consultant.name,
        phone: consultant.phone,
        photo: consultant.photo_url
      };
    }
    return null;
  };

  useEffect(() => {
    fetchProperties(currentPage, searchQuery, productTypeFilter, subProductTypeFilter, locationFilter);
  }, [currentPage, searchQuery, productTypeFilter, subProductTypeFilter, locationFilter]);

  useEffect(() => {
    fetchProductTypes();
  }, []);

  return (
    <div className="property-list-page">
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn btn-outline-secondary me-3"
            >
              <CIcon icon={cilArrowLeft} />
            </button>
            <div>
              <h2 className="mb-0">Property Management</h2>
              <p className="text-muted mb-0">Manage all properties in the system</p>
            </div>
          </div>
          <button
            onClick={handleAddProperty}
            className="btn btn-primary"
          >
            <CIcon icon={cilPlus} className="me-2" />
            Add Property
          </button>
        </div>

        {/* Filters and Search */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text">
                    <CIcon icon={cilSearch} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
              
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={productTypeFilter}
                  onChange={(e) => handleProductTypeFilterChange(e.target.value)}
                >
                  <option value="all">All Product Types</option>
                  {productTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <select
                  className="form-select"
                  value={subProductTypeFilter}
                  onChange={(e) => handleSubProductTypeFilterChange(e.target.value)}
                  disabled={productTypeFilter === 'all'}
                >
                  <option value="all">All Sub Types</option>
                  {subProductTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <select
                  className="form-select"
                  value={locationFilter}
                  onChange={(e) => handleLocationFilterChange(e.target.value)}
                >
                  <option value="all">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-2">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={handleReset}
                >
                  <CIcon icon={cilX} className="me-1" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading properties...</p>
              </div>
            ) : error ? (
              <div className="text-center py-5">
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-5">
                <CIcon icon={cilBuilding} size="3xl" className="text-muted mb-3" />
                <h5 className="text-muted">No properties found</h5>
                <p className="text-muted">Try adjusting your search criteria or add a new property.</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Property ID</th>
                        <th>Property</th>
                        {/* <th>Brand</th> */}
                        <th>Location</th>
                        <th>Contact</th>
                        <th>Details</th>
                        <th>Features</th>
                        {/* <th>Price</th> */}
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => {
                        const consultantInfo = getConsultantInfo(property);
                        return (
                          <tr key={property.id}>
                            <td>{property?.property_id}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="bg-light rounded me-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                  <CIcon icon={cilBuilding} className="text-muted" />
                                </div>
                                <div>
                                  <h6 className="mb-1">{property?.name_of_establishment || 'Unnamed Property'}</h6>
                                  <small className="text-muted">{property.product_types}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="fw-bold">{property.city || 'N/A'}</div>
                                <small className="text-muted">
                                  {property.locality_micro_market || 'N/A'}
                                </small>
                                <br />
                                <small className="text-muted">
                                  Lat: {property.latitude}, Long: {property.longitude}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div>
                                {consultantInfo ? (
                                  <>
                                    <div className="fw-bold">{consultantInfo.name}</div>
                                    <small className="text-muted">
                                      <CIcon icon={cilPhone} className="me-1" />
                                      {consultantInfo.phone}
                                    </small>
                                  </>
                                ) : (
                                  <small className="text-muted">No consultant assigned</small>
                                )}
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="fw-bold">{property.area_in_sqft ? `${property.area_in_sqft} sq ft` : 'N/A'}</div>
                                <small className="text-muted">
                                  {property.num_of_seats_available_for_coworking ? `${property.num_of_seats_available_for_coworking} seats` : 'N/A'}
                                </small>
                                <br />
                                <small className="text-muted">
                                  {property.center_type || 'N/A'}
                                </small>
                                {property.product_sub_types && (
                                  <>
                                    <br />
                                    <small className="text-info">
                                      Sub Type: {property.product_sub_types}
                                    </small>
                                  </>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                {getFeatureIcons(property)}
                                <small className="text-muted">
                                  {property.product_types}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="fw-bold">
                                  {property.price ? `₹${property.price.toLocaleString()}` : 'N/A'}
                                </div>
                                <small className="text-muted">
                                  {property.min_lock_in_months ? `${property.min_lock_in_months} months min` : 'N/A'}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(property)}
                                  title="Edit Property"
                                >
                                  <CIcon icon={cilPencil} />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(property)}
                                  title="Delete Property"
                                  disabled={actionLoading}
                                >
                                  <CIcon icon={cilTrash} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav aria-label="Property pagination" className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}

                {/* Summary */}
                <div className="text-center mt-3">
                  <small className="text-muted">
                    Showing {properties.length} of {totalProperties} properties
                  </small>
                </div>
              </>
            )}
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
        showConfirm={!!alertConfig.onConfirm}
        onConfirm={handleAlertConfirm}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default PropertyList; 