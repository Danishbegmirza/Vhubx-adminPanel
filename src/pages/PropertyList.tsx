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
  categoryName?: string;
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
  wp_status?: number;
  contact_number?: string;
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
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([]);
  const [subCategories, setSubCategories] = useState<Array<{id: number, name: string}>>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  
  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Property>>({});
  const [editLoading, setEditLoading] = useState(false);
  
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

  const handleCategoryFilterChange = (categoryId: string) => {
    setCategoryFilter(categoryId);
    setSubCategoryFilter('all'); // Reset sub category when category changes
    setCurrentPage(1);
    
    // Fetch sub categories if a category is selected
    if (categoryId !== 'all') {
      fetchSubCategories(Number(categoryId));
    } else {
      setSubCategories([]);
    }
  };

  const handleSubCategoryFilterChange = (subCategoryId: string) => {
    setSubCategoryFilter(subCategoryId);
    setCurrentPage(1);
  };

  const handleLocationFilterChange = (location: string) => {
    setLocationFilter(location);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchQuery('');
    setCategoryFilter('all');
    setSubCategoryFilter('all');
    setSubCategories([]);
    setLocationFilter('all');
    setCurrentPage(1);
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await apiService.authFetch(`${config.API_BASE_URL}/property/category`, {
        method: 'GET'
      });

      const data = await response.json();

      if (response.ok && data.status) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch sub categories based on selected parent category ID
  const fetchSubCategories = async (parentId: number) => {
    setLoadingSubCategories(true);
    try {
      const response = await apiService.authFetch(`${config.API_BASE_URL}/property/category?parentId=${parentId}`, {
        method: 'GET'
      });

      const data = await response.json();

      if (response.ok && data.status) {
        setSubCategories(data.data);
      } else {
        setSubCategories([]);
      }
    } catch (error) {
      console.error('Error fetching sub categories:', error);
      setSubCategories([]);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  const fetchProperties = async (page: number = 1, search: string = '', categoryId: string = 'all', subCategoryId: string = 'all', location: string = 'all') => {
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
      
      if (categoryId !== 'all') {
        url += `&categoryId=${encodeURIComponent(categoryId)}`;
      }

      if (subCategoryId !== 'all') {
        url += `&subcategoryId=${encodeURIComponent(subCategoryId)}`;
      }

      if (location !== 'all') {
        url += `&city=${encodeURIComponent(location)}`;
      }

      const response = await apiService.authFetch(url, {
        method: 'GET'
      });

      const data: ApiResponse = await response.json();

      if (response.ok && data.status) {
        // Filter out properties with wp_status === 3
        const filteredProperties = data.data.spaceList.filter(property => property.wp_status !== 3);
        
        setProperties(filteredProperties);
        setTotalProperties(filteredProperties.length);
        setTotalPages(1); // Assuming single page for now
        
        // Extract unique locations for filters
        const uniqueLocations = Array.from(new Set(filteredProperties
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
      const response = await apiService.authFetch(`${config.API_BASE_URL}/workspace/delete/${propertyId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok && data.status) {
        showAlert('Success', 'Property deleted successfully!', 'success');
        fetchProperties(currentPage, searchQuery, categoryFilter, subCategoryFilter, locationFilter);
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
    setEditFormData({
      id: property.id,
      property_id: property.property_id,
      name_of_establishment: property.name_of_establishment,
      brand: property.brand,
      product_types: property.product_types,
      product_sub_types: property.product_sub_types,
      city: property.city,
      state_region: property.state_region,
      locality_micro_market: property.locality_micro_market,
      latitude: property.latitude,
      longitude: property.longitude,
      contact_number: property.contact_number,
      price: property.price,
      area_in_sqft: property.area_in_sqft,
      num_of_seats_available_for_coworking: property.num_of_seats_available_for_coworking,
      seating_capacity: property.seating_capacity,
      parking: property.parking,
      metro_connectivity: property.metro_connectivity,
      is_popular: property.is_popular,
      furnishing: property.furnishing,
      developer: property.developer,
      building_grade: property.building_grade,
      year_built: property.year_built,
      center_type: property.center_type,
      cabins: property.cabins,
      current_occupancy_percentage: property.current_occupancy_percentage,
      min_lock_in_months: property.min_lock_in_months,
      min_inventory_unit: property.min_inventory_unit,
      inventory_type: property.inventory_type,
      solutions: property.solutions,
      status: property.status
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : Number(value)) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: checked ? 1 : 0
    }));
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditFormData({});
  };

  const handleUpdateProperty = async () => {
    if (!editFormData.id) return;
    
    setEditLoading(true);
    
    try {
      const response = await apiService.authFetch(`${config.API_BASE_URL}/property/update/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });

      const data = await response.json();

      if (response.ok && data.status) {
        showAlert('Success', 'Property updated successfully!', 'success');
        closeEditModal();
        fetchProperties(currentPage, searchQuery, categoryFilter, subCategoryFilter, locationFilter);
      } else {
        showAlert('Error', data.message || 'Failed to update property', 'error');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      showAlert('Error', 'An error occurred while updating the property', 'error');
    } finally {
      setEditLoading(false);
    }
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
    fetchProperties(currentPage, searchQuery, categoryFilter, subCategoryFilter, locationFilter);
  }, [currentPage, searchQuery, categoryFilter, subCategoryFilter, locationFilter]);

  useEffect(() => {
    fetchCategories();
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
                  value={categoryFilter}
                  onChange={(e) => handleCategoryFilterChange(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              {categoryFilter !== 'all' && (
                <div className="col-md-2">
                  <select
                    className="form-select"
                    value={subCategoryFilter}
                    onChange={(e) => handleSubCategoryFilterChange(e.target.value)}
                    disabled={loadingSubCategories}
                  >
                    <option value="all">
                      {loadingSubCategories ? 'Loading...' : 'All Sub Categories'}
                    </option>
                    {subCategories.map((subCategory) => (
                      <option key={subCategory.id} value={subCategory.id}>{subCategory.name}</option>
                    ))}
                  </select>
                </div>
              )}

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
                        <th>Property Id</th>
                        <th>Property Name</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>City</th>
                        <th>Contact</th>
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
                                
                                <div>
                                  <h6 className="mb-1">{property?.name_of_establishment || 'Unnamed Property'}</h6>
                                  {/* <small className="text-muted">{property.product_types}</small> */}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="fw-bold">{property.categoryName || 'N/A'}</div>
                              </div>
                            </td>
                            <td>
                              <div>
                              <div className="fw-bold">{property.brand || 'N/A'}</div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="fw-bold">{property.city ? `${property.city}` : 'N/A'}</div>
                                
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="fw-bold">{property.contact_number ? `${property.contact_number}` : 'N/A'}</div>
                                
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

      {/* Edit Property Modal */}
      {isEditModalOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <CIcon icon={cilPencil} className="me-2" />
                  Edit Property
                </h5>
                <button type="button" className="btn-close" onClick={closeEditModal} disabled={editLoading}></button>
              </div>
              <div className="modal-body">
                <form>
                  {/* Basic Information */}
                  <h6 className="text-primary mb-3 border-bottom pb-2">Basic Information</h6>
                  <div className="row mb-4">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Property ID</label>
                      <input
                        type="text"
                        className="form-control"
                        name="property_id"
                        value={editFormData.property_id || ''}
                        onChange={handleEditInputChange}
                        disabled
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Name of Establishment *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name_of_establishment"
                        value={editFormData.name_of_establishment || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Brand</label>
                      <input
                        type="text"
                        className="form-control"
                        name="brand"
                        value={editFormData.brand || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Product Type</label>
                      <input
                        type="text"
                        className="form-control"
                        name="product_types"
                        value={editFormData.product_types || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Product Sub Type</label>
                      <input
                        type="text"
                        className="form-control"
                        name="product_sub_types"
                        value={editFormData.product_sub_types || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Center Type</label>
                      <input
                        type="text"
                        className="form-control"
                        name="center_type"
                        value={editFormData.center_type || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>

                  {/* Location Information */}
                  <h6 className="text-primary mb-3 border-bottom pb-2">Location Information</h6>
                  <div className="row mb-4">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={editFormData.city || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">State/Region</label>
                      <input
                        type="text"
                        className="form-control"
                        name="state_region"
                        value={editFormData.state_region || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Locality/Micro Market</label>
                      <input
                        type="text"
                        className="form-control"
                        name="locality_micro_market"
                        value={editFormData.locality_micro_market || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Latitude</label>
                      <input
                        type="text"
                        className="form-control"
                        name="latitude"
                        value={editFormData.latitude || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Longitude</label>
                      <input
                        type="text"
                        className="form-control"
                        name="longitude"
                        value={editFormData.longitude || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <h6 className="text-primary mb-3 border-bottom pb-2">Contact Information</h6>
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Contact Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="contact_number"
                        value={editFormData.contact_number || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>

                  {/* Property Details */}
                  <h6 className="text-primary mb-3 border-bottom pb-2">Property Details</h6>
                  <div className="row mb-4">
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={editFormData.price ?? ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Area (sq ft)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="area_in_sqft"
                        value={editFormData.area_in_sqft ?? ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Seats Available</label>
                      <input
                        type="number"
                        className="form-control"
                        name="num_of_seats_available_for_coworking"
                        value={editFormData.num_of_seats_available_for_coworking ?? ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Seating Capacity</label>
                      <input
                        type="number"
                        className="form-control"
                        name="seating_capacity"
                        value={editFormData.seating_capacity ?? ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Cabins</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cabins"
                        value={editFormData.cabins || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Min Lock-in (Months)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="min_lock_in_months"
                        value={editFormData.min_lock_in_months ?? ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Min Inventory Unit</label>
                      <input
                        type="number"
                        className="form-control"
                        name="min_inventory_unit"
                        value={editFormData.min_inventory_unit ?? ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Current Occupancy (%)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="current_occupancy_percentage"
                        value={editFormData.current_occupancy_percentage || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>

                  {/* Building Information */}
                  <h6 className="text-primary mb-3 border-bottom pb-2">Building Information</h6>
                  <div className="row mb-4">
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Furnishing</label>
                      <select
                        className="form-select"
                        name="furnishing"
                        value={editFormData.furnishing || ''}
                        onChange={handleEditInputChange}
                      >
                        <option value="">Select</option>
                        <option value="Furnished">Furnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Developer</label>
                      <input
                        type="text"
                        className="form-control"
                        name="developer"
                        value={editFormData.developer || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Building Grade</label>
                      <select
                        className="form-select"
                        name="building_grade"
                        value={editFormData.building_grade || ''}
                        onChange={handleEditInputChange}
                      >
                        <option value="">Select</option>
                        <option value="A">Grade A</option>
                        <option value="B">Grade B</option>
                        <option value="C">Grade C</option>
                      </select>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Year Built</label>
                      <input
                        type="text"
                        className="form-control"
                        name="year_built"
                        value={editFormData.year_built || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Inventory Type</label>
                      <input
                        type="text"
                        className="form-control"
                        name="inventory_type"
                        value={editFormData.inventory_type || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Solutions</label>
                      <input
                        type="text"
                        className="form-control"
                        name="solutions"
                        value={editFormData.solutions || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <h6 className="text-primary mb-3 border-bottom pb-2">Features</h6>
                  <div className="row mb-4">
                    <div className="col-md-3 mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="parking"
                          name="parking"
                          checked={editFormData.parking === 1}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor="parking">Parking Available</label>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="metro_connectivity"
                          name="metro_connectivity"
                          checked={editFormData.metro_connectivity === 1}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor="metro_connectivity">Metro Connectivity</label>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="is_popular"
                          name="is_popular"
                          checked={editFormData.is_popular === 1}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor="is_popular">Popular Property</label>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={editFormData.status ?? ''}
                        onChange={handleEditInputChange}
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeEditModal} disabled={editLoading}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleUpdateProperty}
                  disabled={editLoading}
                >
                  {editLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilCheck} className="me-2" />
                      Update Property
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList; 