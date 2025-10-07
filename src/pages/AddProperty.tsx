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

interface ProductType {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  status: number;
  createdAt: string;
  updatedAt: string;
}

interface SpaceType {
  type: string;
  enabled: boolean;
  config: any;
}

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
  
  // Furnishing Types (Optional)
  furnishing_types: string[];
  
  // Space & Layout Details (Optional)
  space_layout_details: {
    total_built_up_area_sqft: string;
    carpet_area_sqft: string;
    super_built_up_area_sqft: string;
    available_space_area_sqft: string;
    building_floors: string;
    available_unit_floor: string;
    floor_plate_size_sqft: string;
    seating_capacity: string;
    distribution: {
      cabins: string;
      conference_rooms: string;
      workstations: string;
    };
    floor_to_ceiling_height_ft: string;
    washrooms: {
      male: string;
      female: string;
      unisex: string;
    };
    availability_date: string;
  };
  
  // Building & Project Details (Optional)
  building_project_details: {
    building_name: string;
    developer_owner: string;
    building_age: string;
    building_type: string;
    total_floors: string;
    basement_available: string;
    power_load_total_kva: string;
    power_per_sqft: string;
    car_parking_ratio: string;
    nbc_compliance: string;
    sez_status: string;
  };
  
  // Health, Safety & Wellness (Optional)
  health_safety: {
    emergency_exits_signages: string;
    indoor_air_quality: string;
    natural_ventilation: string;
    first_aid_wellness_room: string;
    covid_compliant: string;
    fire_exits_assembly: string;
    ergonomic_seating: string;
    accessibility_disabled: string;
  };
  
  // Sustainability & Utilities (Optional)
  sustainability: {
    water_supply_source: string;
    stp_available: string;
    rainwater_harvesting: string;
    renewable_energy: string;
    energy_efficient_equipment: string;
    waste_segregation: string;
    ev_charging_stations: string;
  };
  
  // Statutory & Regulatory Compliance (Optional)
  compliance_documents: {
    occupancy_certificate: File | null;
    fire_noc: File | null;
    pollution_control_noc: File | null;
    environmental_clearance: File | null;
    zoning_clearance: File | null;
    lift_safety_certificate: File | null;
    dg_set_approval: File | null;
    building_completion_certificate: File | null;
    structural_stability_certificate: File | null;
    sez_notification: File | null;
    disaster_management_plan: File | null;
  };
  
  // Certifications & Ratings (Optional)
  certifications: {
    leed_igbc: string;
    well_building: string;
    smart_building: string;
    iso_certifications: string[];
    nbc_compliance: string;
    other_certification: string;
  };
  
  // Dynamic Amenities & Facilities
  selectedAmenities: number[];
  
  // Space Configuration
  total_capacity: string;
  available_seats: string;
  space_types: {
    hot_desk: {
      enabled: boolean;
      flexible_count: string;
    };
    dedicated_desk: {
      enabled: boolean;
      count: string;
    };
    private_cabin: {
      enabled: boolean;
      capacity: string;
      count: string;
    };
    meeting_room: {
      enabled: boolean;
      rooms: Array<{
        name: string;
        capacity: string;
        hourly_price: string;
        daily_price: string;
      }>;
    };
    conference_room: {
      enabled: boolean;
      capacity: string;
      pricing: string;
    };
    event_space: {
      enabled: boolean;
      capacity: string;
      pricing: string;
    };
    virtual_office: {
      enabled: boolean;
      business_address: boolean;
      mail_handling: boolean;
      call_handling: boolean;
    };
    enterprise_solutions: {
      enabled: boolean;
      description: string;
    };
  };

  // Pricing Configuration
  pricing_options: {
    day_pass: {
      enabled: boolean;
      price_per_seat: string;
    };
    weekly_pass: {
      enabled: boolean;
      price_per_seat: string;
    };
    monthly_hot_desk: {
      enabled: boolean;
      price_per_seat: string;
    };
    monthly_dedicated_desk: {
      enabled: boolean;
      price_per_seat: string;
    };
    private_cabins_pricing: {
      enabled: boolean;
      plans: Array<{
        capacity: string;
        price_per_month: string;
      }>;
    };
    meeting_rooms_pricing: {
      enabled: boolean;
      rooms: Array<{
        name: string;
        capacity: string;
        price_per_hour: string;
        price_per_day: string;
      }>;
    };
    conference_rooms_pricing: {
      enabled: boolean;
      capacity: string;
      price_per_hour: string;
      price_per_day: string;
    };
    event_space_pricing: {
      enabled: boolean;
      capacity: string;
      price_per_hour: string;
      price_per_day: string;
    };
    virtual_office_plans: {
      enabled: boolean;
      business_address_price: string;
      mail_handling_price: string;
      gst_registration_price: string;
      combined_price: string;
    };
    enterprise_deals: {
      enabled: boolean;
      custom_quote: string;
      brochure_file: File | null;
    };
  };
  
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
  product_sub_types: string; // New field for sub types
  
  // Dynamic fields from API
  seating_capacity: string;
  min_inventory_unit: string;
  min_lock_in_months: string;
  parking: boolean;
  metro_connectivity: boolean;
  is_popular: boolean;
  price: string;
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
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [productSubTypes, setProductSubTypes] = useState<ProductType[]>([]);
  const [productTypesLoading, setProductTypesLoading] = useState(true);
  const [productSubTypesLoading, setProductSubTypesLoading] = useState(false);
  const [dynamicFields, setDynamicFields] = useState<{[key: string]: string}>({});
  const [dynamicFieldsLoading, setDynamicFieldsLoading] = useState(false);

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

  // Fetch product types from API
  const fetchProductTypes = async () => {
    try {
      setProductTypesLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showAlert('Error', 'Authentication token not found. Please login again.', 'error');
        return;
      }

      const response = await fetch('http://107.22.44.203:3000/api/v1/property/category', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.status && data.data) {
        // Filter only parent categories (parentId is null)
        const parentCategories = data.data.filter((item: ProductType) => item.parentId === null);
        setProductTypes(parentCategories);
      } else {
        showAlert('Error', data.message || 'Failed to load product types', 'error');
      }
    } catch (error) {
      console.error('Error fetching product types:', error);
      showAlert('Error', 'Failed to load product types', 'error');
    } finally {
      setProductTypesLoading(false);
    }
  };

  // Fetch product sub types based on selected parent
  const fetchProductSubTypes = async (parentId: number) => {
    try {
      setProductSubTypesLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showAlert('Error', 'Authentication token not found. Please login again.', 'error');
        return;
      }

      const response = await fetch(`http://107.22.44.203:3000/api/v1/property/category?parentId=${parentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.status && data.data) {
        setProductSubTypes(data.data);
      } else {
        setProductSubTypes([]);
      }
    } catch (error) {
      console.error('Error fetching product sub types:', error);
      showAlert('Error', 'Failed to load product sub types', 'error');
      setProductSubTypes([]);
    } finally {
      setProductSubTypesLoading(false);
    }
  };

  // Fetch dynamic fields based on product sub type
  const fetchDynamicFields = async (productType: string) => {
    try {
      setDynamicFieldsLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        showAlert('Error', 'Authentication token not found. Please login again.', 'error');
        return;
      }

      const response = await fetch(`http://107.22.44.203:3000/api/v1/workspace/product/dynamic-field?product_type=${productType}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.status && data.data?.dynamicFields) {
        setDynamicFields(data.data.dynamicFields);
        // Update form data with dynamic field values
        setFormData(prev => ({
          ...prev,
          ...data.data.dynamicFields
        }));
      } else {
        setDynamicFields({});
      }
    } catch (error) {
      console.error('Error fetching dynamic fields:', error);
      showAlert('Error', 'Failed to load dynamic fields', 'error');
      setDynamicFields({});
    } finally {
      setDynamicFieldsLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
    fetchProductTypes();
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
    
    // Furnishing Types (Optional)
    furnishing_types: [],
    
    // Space & Layout Details (Optional)
    space_layout_details: {
      total_built_up_area_sqft: '',
      carpet_area_sqft: '',
      super_built_up_area_sqft: '',
      available_space_area_sqft: '',
      building_floors: '',
      available_unit_floor: '',
      floor_plate_size_sqft: '',
      seating_capacity: '',
      distribution: {
        cabins: '',
        conference_rooms: '',
        workstations: '',
      },
      floor_to_ceiling_height_ft: '',
      washrooms: {
        male: '',
        female: '',
        unisex: '',
      },
      availability_date: '',
    },
    
    // Building & Project Details (Optional)
    building_project_details: {
      building_name: '',
      developer_owner: '',
      building_age: '',
      building_type: '',
      total_floors: '',
      basement_available: '',
      power_load_total_kva: '',
      power_per_sqft: '',
      car_parking_ratio: '',
      nbc_compliance: '',
      sez_status: '',
    },
    
    // Health, Safety & Wellness (Optional)
    health_safety: {
      emergency_exits_signages: '',
      indoor_air_quality: '',
      natural_ventilation: '',
      first_aid_wellness_room: '',
      covid_compliant: '',
      fire_exits_assembly: '',
      ergonomic_seating: '',
      accessibility_disabled: '',
    },
    
    // Sustainability & Utilities (Optional)
    sustainability: {
      water_supply_source: '',
      stp_available: '',
      rainwater_harvesting: '',
      renewable_energy: '',
      energy_efficient_equipment: '',
      waste_segregation: '',
      ev_charging_stations: '',
    },
    
    // Statutory & Regulatory Compliance (Optional)
    compliance_documents: {
      occupancy_certificate: null,
      fire_noc: null,
      pollution_control_noc: null,
      environmental_clearance: null,
      zoning_clearance: null,
      lift_safety_certificate: null,
      dg_set_approval: null,
      building_completion_certificate: null,
      structural_stability_certificate: null,
      sez_notification: null,
      disaster_management_plan: null,
    },
    
    // Certifications & Ratings (Optional)
    certifications: {
      leed_igbc: '',
      well_building: '',
      smart_building: '',
      iso_certifications: [],
      nbc_compliance: '',
      other_certification: '',
    },
    
    // Dynamic Amenities & Facilities
    selectedAmenities: [],
    
    // Space Configuration
    total_capacity: '',
    available_seats: '',
    space_types: {
      hot_desk: {
        enabled: false,
        flexible_count: ''
      },
      dedicated_desk: {
        enabled: false,
        count: ''
      },
      private_cabin: {
        enabled: false,
        capacity: '',
        count: ''
      },
      meeting_room: {
        enabled: false,
        rooms: []
      },
      conference_room: {
        enabled: false,
        capacity: '',
        pricing: ''
      },
      event_space: {
        enabled: false,
        capacity: '',
        pricing: ''
      },
      virtual_office: {
        enabled: false,
        business_address: false,
        mail_handling: false,
        call_handling: false
      },
      enterprise_solutions: {
        enabled: false,
        description: ''
      }
    },
    
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
    product_sub_types: '',
    parking: false,
    metro_connectivity: false,
    is_popular: false,
    price: '',
    furnishing: '',
    developer: '',
    building_grade: '',
    year_built: '',
    solutions: '',
    connectivity: [],

    // Dynamic fields from API
    seating_capacity: '',
    min_inventory_unit: '',
    min_lock_in_months: '',

    // Pricing Configuration
    pricing_options: {
      day_pass: {
        enabled: false,
        price_per_seat: ''
      },
      weekly_pass: {
        enabled: false,
        price_per_seat: ''
      },
      monthly_hot_desk: {
        enabled: false,
        price_per_seat: ''
      },
      monthly_dedicated_desk: {
        enabled: false,
        price_per_seat: ''
      },
      private_cabins_pricing: {
        enabled: false,
        plans: []
      },
      meeting_rooms_pricing: {
        enabled: false,
        rooms: []
      },
      conference_rooms_pricing: {
        enabled: false,
        capacity: '',
        price_per_hour: '',
        price_per_day: ''
      },
      event_space_pricing: {
        enabled: false,
        capacity: '',
        price_per_hour: '',
        price_per_day: ''
      },
      virtual_office_plans: {
        enabled: false,
        business_address_price: '',
        mail_handling_price: '',
        gst_registration_price: '',
        combined_price: ''
      },
      enterprise_deals: {
        enabled: false,
        custom_quote: '',
        brochure_file: null
      }
    }
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

      // If product type is selected, fetch sub types
      if (name === 'product_types' && value) {
        const selectedProductType = productTypes.find(type => type.name === value);
        if (selectedProductType) {
          fetchProductSubTypes(selectedProductType.id);
          // Reset sub type selection when product type changes
          setFormData(prev => ({
            ...prev,
            product_sub_types: ''
          }));
        }
      } else if (name === 'product_types' && !value) {
        // Clear sub types when no product type is selected
        setProductSubTypes([]);
        setFormData(prev => ({
          ...prev,
          product_sub_types: ''
        }));
      }

      // If product sub type is selected, fetch dynamic fields
      if (name === 'product_sub_types' && value) {
        // For now, using hardcoded value as requested
        fetchDynamicFields('managed_office');
      } else if (name === 'product_sub_types' && !value) {
        // Clear dynamic fields when no sub type is selected
        setDynamicFields({});
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      pictures_of_the_space: file
    }));
  };

  const handleFurnishingTypeChange = (furnishingType: string, isChecked: boolean) => {
    setFormData(prev => ({
      ...prev,
      furnishing_types: isChecked
        ? [...prev.furnishing_types, furnishingType]
        : prev.furnishing_types.filter(type => type !== furnishingType)
    }));
  };

  const handleSpaceLayoutChange = (field: string, value: string, nestedField?: string) => {
    setFormData(prev => {
      if (nestedField) {
        const nestedObj = prev.space_layout_details[field as keyof typeof prev.space_layout_details];
        if (typeof nestedObj === 'object' && nestedObj !== null) {
          return {
            ...prev,
            space_layout_details: {
              ...prev.space_layout_details,
              [field]: {
                ...(nestedObj as Record<string, string>),
                [nestedField]: value
              }
            }
          };
        }
      }
      return {
        ...prev,
        space_layout_details: {
          ...prev.space_layout_details,
          [field]: value
        }
      };
    });
  };

  const handleBuildingProjectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      building_project_details: {
        ...prev.building_project_details,
        [field]: value
      }
    }));
  };

  const handleHealthSafetyChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      health_safety: {
        ...prev.health_safety,
        [field]: value
      }
    }));
  };

  const handleSustainabilityChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      sustainability: {
        ...prev.sustainability,
        [field]: value
      }
    }));
  };

  const handleComplianceDocumentChange = (documentType: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      compliance_documents: {
        ...prev.compliance_documents,
        [documentType]: file
      }
    }));
  };

  const handleCertificationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: {
        ...prev.certifications,
        [field]: value
      }
    }));
  };

  const handleISOCertificationChange = (value: string, isChecked: boolean) => {
    setFormData(prev => ({
      ...prev,
      certifications: {
        ...prev.certifications,
        iso_certifications: isChecked
          ? [...prev.certifications.iso_certifications, value]
          : prev.certifications.iso_certifications.filter(cert => cert !== value)
      }
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

  // Space configuration handlers
  const handleSpaceTypeToggle = (spaceType: string, enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      space_types: {
        ...prev.space_types,
        [spaceType]: {
          ...prev.space_types[spaceType as keyof typeof prev.space_types],
          enabled
        }
      }
    }));
  };

  const handleSpaceConfigChange = (spaceType: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      space_types: {
        ...prev.space_types,
        [spaceType]: {
          ...prev.space_types[spaceType as keyof typeof prev.space_types],
          [field]: value
        }
      }
    }));
  };

  const addMeetingRoom = () => {
    setFormData(prev => ({
      ...prev,
      space_types: {
        ...prev.space_types,
        meeting_room: {
          ...prev.space_types.meeting_room,
          rooms: [...prev.space_types.meeting_room.rooms, {
            name: '',
            capacity: '',
            hourly_price: '',
            daily_price: ''
          }]
        }
      }
    }));
  };

  const removeMeetingRoom = (index: number) => {
    setFormData(prev => ({
      ...prev,
      space_types: {
        ...prev.space_types,
        meeting_room: {
          ...prev.space_types.meeting_room,
          rooms: prev.space_types.meeting_room.rooms.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const updateMeetingRoom = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      space_types: {
        ...prev.space_types,
        meeting_room: {
          ...prev.space_types.meeting_room,
          rooms: prev.space_types.meeting_room.rooms.map((room, i) => 
            i === index ? { ...room, [field]: value } : room
          )
        }
      }
    }));
  };

  // Pricing configuration handlers
  const handlePricingToggle = (pricingType: string, enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      pricing_options: {
        ...prev.pricing_options,
        [pricingType]: {
          ...prev.pricing_options[pricingType as keyof typeof prev.pricing_options],
          enabled
        }
      }
    }));
  };

  const handlePricingConfigChange = (pricingType: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      pricing_options: {
        ...prev.pricing_options,
        [pricingType]: {
          ...prev.pricing_options[pricingType as keyof typeof prev.pricing_options],
          [field]: value
        }
      }
    }));
  };

  const addPrivateCabinPlan = () => {
    setFormData(prev => ({
      ...prev,
      pricing_options: {
        ...prev.pricing_options,
        private_cabins_pricing: {
          ...prev.pricing_options.private_cabins_pricing,
          plans: [...prev.pricing_options.private_cabins_pricing.plans, {
            capacity: '',
            price_per_month: ''
          }]
        }
      }
    }));
  };

  const removePrivateCabinPlan = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pricing_options: {
        ...prev.pricing_options,
        private_cabins_pricing: {
          ...prev.pricing_options.private_cabins_pricing,
          plans: prev.pricing_options.private_cabins_pricing.plans.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const updatePrivateCabinPlan = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pricing_options: {
        ...prev.pricing_options,
        private_cabins_pricing: {
          ...prev.pricing_options.private_cabins_pricing,
          plans: prev.pricing_options.private_cabins_pricing.plans.map((plan, i) => 
            i === index ? { ...plan, [field]: value } : plan
          )
        }
      }
    }));
  };

  const addMeetingRoomPricing = () => {
    setFormData(prev => ({
      ...prev,
      pricing_options: {
        ...prev.pricing_options,
        meeting_rooms_pricing: {
          ...prev.pricing_options.meeting_rooms_pricing,
          rooms: [...prev.pricing_options.meeting_rooms_pricing.rooms, {
            name: '',
            capacity: '',
            price_per_hour: '',
            price_per_day: ''
          }]
        }
      }
    }));
  };

  const removeMeetingRoomPricing = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pricing_options: {
        ...prev.pricing_options,
        meeting_rooms_pricing: {
          ...prev.pricing_options.meeting_rooms_pricing,
          rooms: prev.pricing_options.meeting_rooms_pricing.rooms.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const updateMeetingRoomPricing = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pricing_options: {
        ...prev.pricing_options,
        meeting_rooms_pricing: {
          ...prev.pricing_options.meeting_rooms_pricing,
          rooms: prev.pricing_options.meeting_rooms_pricing.rooms.map((room, i) => 
            i === index ? { ...room, [field]: value } : room
          )
        }
      }
    }));
  };

  const handleBrochureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      pricing_options: {
        ...prev.pricing_options,
        enterprise_deals: {
          ...prev.pricing_options.enterprise_deals,
          brochure_file: file
        }
      }
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
      formDataToSend.append('product_types', formData.product_sub_types || formData.product_types);
      
      // Dynamic Fields
      Object.keys(dynamicFields).forEach(key => {
        const value = formData[key as keyof PropertyFormData];
        if (value) {
          formDataToSend.append(key, String(value));
        }
      });
      
      // Space Configuration - Transform to match API expected format
      const spaceConfiguration = {
        totalCapacity: parseInt(formData.total_capacity) || 0,
        availableSeats: parseInt(formData.available_seats) || 0,
        hotDesk: {
          enabled: formData.space_types.hot_desk.enabled,
          count: parseInt(formData.space_types.hot_desk.flexible_count) || 0
        },
        dedicatedDesk: {
          enabled: formData.space_types.dedicated_desk.enabled,
          count: parseInt(formData.space_types.dedicated_desk.count) || 0
        },
        privateCabin: formData.space_types.private_cabin.enabled ? [{
          capacity: parseInt(formData.space_types.private_cabin.capacity) || 0,
          count: parseInt(formData.space_types.private_cabin.count) || 0
        }] : [],
        meetingRooms: formData.space_types.meeting_room.enabled ? formData.space_types.meeting_room.rooms.map(room => ({
          name: room.name,
          capacity: parseInt(room.capacity) || 0,
          priceHourly: parseInt(room.hourly_price) || 0,
          priceDaily: parseInt(room.daily_price) || 0
        })) : [],
        conferenceRooms: formData.space_types.conference_room.enabled ? [{
          capacity: parseInt(formData.space_types.conference_room.capacity) || 0,
          pricing: formData.space_types.conference_room.pricing
        }] : [],
        eventSpaces: formData.space_types.event_space.enabled ? [{
          capacity: parseInt(formData.space_types.event_space.capacity) || 0,
          pricing: formData.space_types.event_space.pricing
        }] : [],
        virtualOffice: {
          businessAddress: formData.space_types.virtual_office.business_address,
          mailHandling: formData.space_types.virtual_office.mail_handling,
          callHandling: formData.space_types.virtual_office.call_handling
        },
        customEnterpriseSolutions: {
          details: formData.space_types.enterprise_solutions.description,
          attachments: []
        }
      };
      
      formDataToSend.append('spaceConfiguration', JSON.stringify(spaceConfiguration));
      
      // Pricing Configuration - Transform to match API expected format
      const pricingConfiguration = {
        dayPass: {
          enabled: formData.pricing_options.day_pass.enabled,
          pricePerSeatPerDay: parseInt(formData.pricing_options.day_pass.price_per_seat) || 0
        },
        weeklyPass: {
          enabled: formData.pricing_options.weekly_pass.enabled,
          pricePerSeatPerWeek: parseInt(formData.pricing_options.weekly_pass.price_per_seat) || 0
        },
        monthlyDesk: {
          hotDesk: formData.pricing_options.monthly_hot_desk.enabled ? parseInt(formData.pricing_options.monthly_hot_desk.price_per_seat) || 0 : 0,
          dedicatedDesk: formData.pricing_options.monthly_dedicated_desk.enabled ? parseInt(formData.pricing_options.monthly_dedicated_desk.price_per_seat) || 0 : 0
        },
        privateCabins: formData.pricing_options.private_cabins_pricing.enabled ? formData.pricing_options.private_cabins_pricing.plans.map(plan => ({
          capacity: parseInt(plan.capacity) || 0,
          pricePerCabinPerMonth: parseInt(plan.price_per_month) || 0
        })) : [],
        meetingRooms: formData.pricing_options.meeting_rooms_pricing.enabled ? formData.pricing_options.meeting_rooms_pricing.rooms.map(room => ({
          capacity: parseInt(room.capacity) || 0,
          pricePerHour: parseInt(room.price_per_hour) || 0,
          pricePerDay: parseInt(room.price_per_day) || 0
        })) : [],
        conferenceRooms: formData.pricing_options.conference_rooms_pricing.enabled ? [{
          capacity: parseInt(formData.pricing_options.conference_rooms_pricing.capacity) || 0,
          pricePerHour: parseInt(formData.pricing_options.conference_rooms_pricing.price_per_hour) || 0,
          pricePerDay: parseInt(formData.pricing_options.conference_rooms_pricing.price_per_day) || 0
        }] : [],
        eventSpaces: formData.pricing_options.event_space_pricing.enabled ? [{
          capacity: parseInt(formData.pricing_options.event_space_pricing.capacity) || 0,
          pricePerHour: parseInt(formData.pricing_options.event_space_pricing.price_per_hour) || 0,
          pricePerDay: parseInt(formData.pricing_options.event_space_pricing.price_per_day) || 0
        }] : [],
        virtualOfficePlans: formData.pricing_options.virtual_office_plans.enabled ? [{
          planType: "Business Address",
          price: parseInt(formData.pricing_options.virtual_office_plans.business_address_price) || 0
        }] : [],
        enterpriseDeals: {
          customQuote: formData.pricing_options.enterprise_deals.custom_quote,
          brochureUrl: formData.pricing_options.enterprise_deals.brochure_file ? 
            URL.createObjectURL(formData.pricing_options.enterprise_deals.brochure_file) : ""
        }
      };
      
      formDataToSend.append('pricing', JSON.stringify(pricingConfiguration));
      
      // Handle brochure file for enterprise deals
      if (formData.pricing_options.enterprise_deals.brochure_file) {
        formDataToSend.append('enterprise_brochure', formData.pricing_options.enterprise_deals.brochure_file);
      }
      
      // Furnishing Types - Send as array of objects
      const furnishingTypeDescriptions: { [key: string]: string } = {
        'Bare Shell': 'Raw space with only flooring, walls, basic civil work',
        'Warm Shell': 'With HVAC, lighting, false ceiling, and basic finishes',
        'Plug & Play': 'Fully furnished with workstations, IT infrastructure, etc.',
        'Managed Office': 'Operated and serviced by third-party providers',
        'Co-working': 'Flexible shared office spaces'
      };

      formData.furnishing_types.forEach(type => {
        formDataToSend.append('furnishing_types[]', JSON.stringify({
          name: type,
          description: furnishingTypeDescriptions[type] || ''
        }));
      });

      // Space & Layout Details - Only send if at least one field is filled
      const hasSpaceLayoutData = Object.values(formData.space_layout_details).some(val => {
        if (typeof val === 'object') {
          return Object.values(val).some(v => v !== '');
        }
        return val !== '';
      });

      if (hasSpaceLayoutData) {
        const spaceLayoutDetails = {
          total_built_up_area_sqft: formData.space_layout_details.total_built_up_area_sqft ? 
            parseInt(formData.space_layout_details.total_built_up_area_sqft) : undefined,
          carpet_area_sqft: formData.space_layout_details.carpet_area_sqft ? 
            parseInt(formData.space_layout_details.carpet_area_sqft) : undefined,
          super_built_up_area_sqft: formData.space_layout_details.super_built_up_area_sqft ? 
            parseInt(formData.space_layout_details.super_built_up_area_sqft) : undefined,
          available_space_area_sqft: formData.space_layout_details.available_space_area_sqft ? 
            parseInt(formData.space_layout_details.available_space_area_sqft) : undefined,
          building_floors: formData.space_layout_details.building_floors ? 
            parseInt(formData.space_layout_details.building_floors) : undefined,
          available_unit_floor: formData.space_layout_details.available_unit_floor ? 
            parseInt(formData.space_layout_details.available_unit_floor) : undefined,
          floor_plate_size_sqft: formData.space_layout_details.floor_plate_size_sqft ? 
            parseInt(formData.space_layout_details.floor_plate_size_sqft) : undefined,
          seating_capacity: formData.space_layout_details.seating_capacity ? 
            parseInt(formData.space_layout_details.seating_capacity) : undefined,
          distribution: {
            cabins: formData.space_layout_details.distribution.cabins ? 
              parseInt(formData.space_layout_details.distribution.cabins) : undefined,
            conference_rooms: formData.space_layout_details.distribution.conference_rooms ? 
              parseInt(formData.space_layout_details.distribution.conference_rooms) : undefined,
            workstations: formData.space_layout_details.distribution.workstations ? 
              parseInt(formData.space_layout_details.distribution.workstations) : undefined,
          },
          floor_to_ceiling_height_ft: formData.space_layout_details.floor_to_ceiling_height_ft ? 
            parseInt(formData.space_layout_details.floor_to_ceiling_height_ft) : undefined,
          washrooms: {
            male: formData.space_layout_details.washrooms.male ? 
              parseInt(formData.space_layout_details.washrooms.male) : undefined,
            female: formData.space_layout_details.washrooms.female ? 
              parseInt(formData.space_layout_details.washrooms.female) : undefined,
            unisex: formData.space_layout_details.washrooms.unisex ? 
              parseInt(formData.space_layout_details.washrooms.unisex) : undefined,
          },
          availability_date: formData.space_layout_details.availability_date || undefined,
        };
        
        formDataToSend.append('space_layout_details', JSON.stringify(spaceLayoutDetails));
      }
      
      // Building & Project Details - Only send if at least one field is filled
      const hasBuildingProjectData = Object.values(formData.building_project_details).some(val => val !== '');

      if (hasBuildingProjectData) {
        const buildingProjectDetails = {
          building_name: formData.building_project_details.building_name || undefined,
          developer_owner: formData.building_project_details.developer_owner || undefined,
          building_age: formData.building_project_details.building_age ? 
            parseInt(formData.building_project_details.building_age) : undefined,
          building_type: formData.building_project_details.building_type || undefined,
          total_floors: formData.building_project_details.total_floors ? 
            parseInt(formData.building_project_details.total_floors) : undefined,
          basement_available: formData.building_project_details.basement_available === 'yes' ? true : 
            formData.building_project_details.basement_available === 'no' ? false : undefined,
          power_load_total_kva: formData.building_project_details.power_load_total_kva ? 
            parseInt(formData.building_project_details.power_load_total_kva) : undefined,
          power_per_sqft: formData.building_project_details.power_per_sqft ? 
            parseFloat(formData.building_project_details.power_per_sqft) : undefined,
          car_parking_ratio: formData.building_project_details.car_parking_ratio || undefined,
          nbc_compliance: formData.building_project_details.nbc_compliance || undefined,
          sez_status: formData.building_project_details.sez_status || undefined,
        };
        
        formDataToSend.append('building_project_details', JSON.stringify(buildingProjectDetails));
      }
      
      // Health, Safety & Wellness - Send as array of attribute objects
      const healthSafetyAttributes = [
        { key: 'emergency_exits_signages', name: 'Emergency Exits & Signages' },
        { key: 'indoor_air_quality', name: 'Indoor Air Quality Monitoring' },
        { key: 'natural_ventilation', name: 'Natural Ventilation / Daylighting' },
        { key: 'first_aid_wellness_room', name: 'First Aid Room / Wellness Room' },
        { key: 'covid_compliant', name: 'Covid-Compliant Protocols' },
        { key: 'fire_exits_assembly', name: 'Fire Exits and Assembly Area' },
        { key: 'ergonomic_seating', name: 'Ergonomic Seating Setup' },
        { key: 'accessibility_disabled', name: 'Accessibility for Differently Abled' },
      ];

      healthSafetyAttributes.forEach(attr => {
        const value = formData.health_safety[attr.key as keyof typeof formData.health_safety];
        if (value) {
          formDataToSend.append('health_safety[]', JSON.stringify({
            attribute_name: attr.name,
            value: value
          }));
        }
      });

      // Sustainability & Utilities - Send as array of attribute objects
      const sustainabilityAttributes = [
        { key: 'water_supply_source', name: 'Source of Water Supply' },
        { key: 'stp_available', name: 'Sewage Treatment Plant (STP)' },
        { key: 'rainwater_harvesting', name: 'Rainwater Harvesting' },
        { key: 'renewable_energy', name: 'Renewable Energy Use' },
        { key: 'energy_efficient_equipment', name: 'Energy Efficient Equipment & Fixtures' },
        { key: 'waste_segregation', name: 'Waste Segregation & Green Disposal' },
        { key: 'ev_charging_stations', name: 'E-Vehicle Charging Stations' },
      ];

      sustainabilityAttributes.forEach(attr => {
        const value = formData.sustainability[attr.key as keyof typeof formData.sustainability];
        if (value) {
          formDataToSend.append('sustainability[]', JSON.stringify({
            attribute_name: attr.name,
            value: value
          }));
        }
      });

      // Compliance Documents - Send as array of document objects
      const complianceDocumentTypes = [
        { key: 'occupancy_certificate', name: 'Occupancy Certificate' },
        { key: 'fire_noc', name: 'Fire NOC' },
        { key: 'pollution_control_noc', name: 'Pollution Control NOC' },
        { key: 'environmental_clearance', name: 'Environmental Clearance Certificate' },
        { key: 'zoning_clearance', name: 'Zoning Clearance / Town Planning Approval' },
        { key: 'lift_safety_certificate', name: 'Lift Safety Certificate' },
        { key: 'dg_set_approval', name: 'DG Set Approval' },
        { key: 'building_completion_certificate', name: 'Building Completion Certificate (BCC)' },
        { key: 'structural_stability_certificate', name: 'Structural Stability Certificate' },
        { key: 'sez_notification', name: 'SEZ Notification' },
        { key: 'disaster_management_plan', name: 'Disaster Management / Emergency Evacuation Plan' },
      ];

      complianceDocumentTypes.forEach(doc => {
        const file = formData.compliance_documents[doc.key as keyof typeof formData.compliance_documents];
        if (file) {
          // Append the file with a unique field name
          formDataToSend.append(`compliance_doc_${doc.key}`, file);
          // Also send the document metadata
          formDataToSend.append('compliance_documents[]', JSON.stringify({
            document_name: doc.name,
            file_path: file.name // The actual path will be set by the backend after upload
          }));
        } else {
          // Send with null file_path if no file is uploaded but we want to track it
          // formDataToSend.append('compliance_documents[]', JSON.stringify({
          //   document_name: doc.name,
          //   file_path: null
          // }));
        }
      });

      // Certifications & Ratings - Send as array of certification objects
      const certificationData = [];
      
      if (formData.certifications.leed_igbc) {
        certificationData.push({
          certification_name: 'LEED / IGBC Certification',
          value: formData.certifications.leed_igbc
        });
      }
      
      if (formData.certifications.well_building) {
        certificationData.push({
          certification_name: 'WELL Building Standard',
          value: formData.certifications.well_building
        });
      }
      
      if (formData.certifications.smart_building) {
        certificationData.push({
          certification_name: 'Smart Building Certification',
          value: formData.certifications.smart_building
        });
      }
      
      if (formData.certifications.iso_certifications.length > 0) {
        certificationData.push({
          certification_name: 'ISO Certification',
          value: formData.certifications.iso_certifications.join(', ')
        });
      }
      
      if (formData.certifications.nbc_compliance) {
        certificationData.push({
          certification_name: 'NBC 2016 Compliance',
          value: formData.certifications.nbc_compliance
        });
      }
      
      if (formData.certifications.other_certification) {
        certificationData.push({
          certification_name: 'Any Other',
          value: formData.certifications.other_certification,
          description: 'Custom certification'
        });
      }

      certificationData.forEach(cert => {
        formDataToSend.append('certifications[]', JSON.stringify(cert));
      });
      
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

                 <div className="col-md-6">
                        <label className="form-label">Product Types</label>
                        <select
                          className="form-select"
                          name="product_types"
                          value={formData.product_types}
                          onChange={handleInputChange}
                          disabled={productTypesLoading}
                        >
                          <option value="">
                            {productTypesLoading ? 'Loading Product Types...' : 'Select Product Type'}
                          </option>
                          {productTypes.map(type => (
                            <option key={type.id} value={type.name}>{type.name}</option>
                          ))}
                        </select>
                      </div>

                       <div className="col-md-6">
                        <label className="form-label">Product Sub Types</label>
                        <select
                          className="form-select"
                          name="product_sub_types"
                          value={formData.product_sub_types}
                          onChange={handleInputChange}
                          disabled={!formData.product_types || productSubTypesLoading}
                        >
                          <option value="">
                            {!formData.product_types 
                              ? 'Select Product Type First' 
                              : productSubTypesLoading 
                                ? 'Loading Sub Types...' 
                                : productSubTypes.length === 0 
                                  ? 'No Sub Types Available'
                                  : 'Select Product Sub Type'
                            }
                          </option>
                          {productSubTypes.map(type => (
                            <option key={type.id} value={type.name}>{type.name}</option>
                          ))}
                        </select>
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
                
                <div className="col-12">
                  <div className="row">
                    <div className="col-md-4">
                      
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

                    <div className="col-md-4">
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

                    <div className="col-md-4">
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

                  {/* Dynamic Fields Section */}
                  {Object.keys(dynamicFields).length > 0 && (
                    <div className="row mt-4">
                      <div className="col-12">
                        <h6 className="mb-3">
                          <CIcon icon={cilChart} className="me-2" />
                          Dynamic Fields {dynamicFieldsLoading && <span className="text-muted">(Loading...)</span>}
                        </h6>
                      </div>
                      
                      {/* Render dynamic fields in rows of 3 */}
                      <div className="row">
                        {Object.entries(dynamicFields).map(([key, value], index) => {
                          const fieldLabel = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                          
                          return (
                            <div key={key} className="col-lg-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">{fieldLabel}</label>
                                <input
                                  type={key.includes('percentage') || key.includes('capacity') || key.includes('sqft') || key.includes('unit') || key.includes('months') ? 'number' : 'text'}
                                  className="form-control"
                                  name={key}
                                  value={formData[key as keyof PropertyFormData] as string || ''}
                                  onChange={handleInputChange}
                                  placeholder={`Enter ${fieldLabel.toLowerCase()}`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Space Configuration Section */}
                  <div className="row mt-4">
                    <div className="col-12">
                      <h6 className="mb-3">
                        <CIcon icon={cilSettings} className="me-2" />
                        Space Configuration (Dynamic)
                      </h6>
                    </div>
                    
                    {/* Basic Capacity */}
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Total Capacity (Seats) *</label>
                        <input
                          type="number"
                          className="form-control"
                          name="total_capacity"
                          value={formData.total_capacity}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="col-lg-4 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Available Seats (Live availability)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="available_seats"
                          value={formData.available_seats}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-4 col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Space Utilization</label>
                        <div className="form-text text-muted">
                          {formData.total_capacity && formData.available_seats ? 
                            `${Math.round((parseInt(formData.available_seats) / parseInt(formData.total_capacity)) * 100)}% Available` : 
                            'Enter capacity to see utilization'
                          }
                        </div>
                      </div>
                    </div>

                                         {/* Types of Spaces */}
                     <div className="col-12 mt-3">
                       <h6 className="mb-3 text-primary">Types of Spaces Available</h6>
                       
                       <div className="row">
                         {/* Hot Desk */}
                         <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
                           <div className="card h-100">
                             <div className="card-body">
                               <div className="form-check mb-3">
                                 <input
                                   className="form-check-input"
                                   type="checkbox"
                                   id="hot_desk"
                                   checked={formData.space_types.hot_desk.enabled}
                                   onChange={(e) => handleSpaceTypeToggle('hot_desk', e.target.checked)}
                                 />
                                 <label className="form-check-label fw-bold" htmlFor="hot_desk">
                                   Hot Desk (Flexible)
                                 </label>
                               </div>
                               {formData.space_types.hot_desk.enabled && (
                                 <div>
                                   <label className="form-label">Flexible Seats Count</label>
                                   <input
                                     type="number"
                                     className="form-control"
                                     value={formData.space_types.hot_desk.flexible_count}
                                     onChange={(e) => handleSpaceConfigChange('hot_desk', 'flexible_count', e.target.value)}
                                   />
                                 </div>
                               )}
                             </div>
                           </div>
                         </div>

                         {/* Dedicated Desk */}
                         <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
                           <div className="card h-100">
                             <div className="card-body">
                               <div className="form-check mb-3">
                                 <input
                                   className="form-check-input"
                                   type="checkbox"
                                   id="dedicated_desk"
                                   checked={formData.space_types.dedicated_desk.enabled}
                                   onChange={(e) => handleSpaceTypeToggle('dedicated_desk', e.target.checked)}
                                 />
                                 <label className="form-check-label fw-bold" htmlFor="dedicated_desk">
                                   Dedicated Desk
                                 </label>
                               </div>
                               {formData.space_types.dedicated_desk.enabled && (
                                 <div>
                                   <label className="form-label">Desk Count</label>
                                   <input
                                     type="number"
                                     className="form-control"
                                     value={formData.space_types.dedicated_desk.count}
                                     onChange={(e) => handleSpaceConfigChange('dedicated_desk', 'count', e.target.value)}
                                   />
                                 </div>
                               )}
                             </div>
                           </div>
                         </div>

                         {/* Private Cabin */}
                         <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
                           <div className="card h-100">
                             <div className="card-body">
                               <div className="form-check mb-3">
                                 <input
                                   className="form-check-input"
                                   type="checkbox"
                                   id="private_cabin"
                                   checked={formData.space_types.private_cabin.enabled}
                                   onChange={(e) => handleSpaceTypeToggle('private_cabin', e.target.checked)}
                                 />
                                 <label className="form-check-label fw-bold" htmlFor="private_cabin">
                                   Private Cabin
                                 </label>
                               </div>
                               {formData.space_types.private_cabin.enabled && (
                                 <div>
                                   <div className="mb-2">
                                     <label className="form-label">Capacity per Cabin</label>
                                     <input
                                       type="number"
                                       className="form-control"
                                       value={formData.space_types.private_cabin.capacity}
                                       onChange={(e) => handleSpaceConfigChange('private_cabin', 'capacity', e.target.value)}
                                     />
                                   </div>
                                   <div>
                                     <label className="form-label">Number of Cabins</label>
                                     <input
                                       type="number"
                                       className="form-control"
                                       value={formData.space_types.private_cabin.count}
                                       onChange={(e) => handleSpaceConfigChange('private_cabin', 'count', e.target.value)}
                                     />
                                   </div>
                                 </div>
                               )}
                             </div>
                           </div>
                         </div>

                         {/* Conference Room */}
                         <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
                           <div className="card h-100">
                             <div className="card-body">
                               <div className="form-check mb-3">
                                 <input
                                   className="form-check-input"
                                   type="checkbox"
                                   id="conference_room"
                                   checked={formData.space_types.conference_room.enabled}
                                   onChange={(e) => handleSpaceTypeToggle('conference_room', e.target.checked)}
                                 />
                                 <label className="form-check-label fw-bold" htmlFor="conference_room">
                                   Conference Room
                                 </label>
                               </div>
                               {formData.space_types.conference_room.enabled && (
                                 <div>
                                   <div className="mb-2">
                                     <label className="form-label">Capacity</label>
                                     <input
                                       type="number"
                                       className="form-control"
                                       value={formData.space_types.conference_room.capacity}
                                       onChange={(e) => handleSpaceConfigChange('conference_room', 'capacity', e.target.value)}
                                     />
                                   </div>
                                   <div>
                                     <label className="form-label">Pricing</label>
                                     <input
                                       type="text"
                                       className="form-control"
                                       value={formData.space_types.conference_room.pricing}
                                       onChange={(e) => handleSpaceConfigChange('conference_room', 'pricing', e.target.value)}
                                       placeholder="₹500/hour"
                                     />
                                   </div>
                                 </div>
                               )}
                             </div>
                           </div>
                         </div>

                         {/* Event Space */}
                         <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
                           <div className="card h-100">
                             <div className="card-body">
                               <div className="form-check mb-3">
                                 <input
                                   className="form-check-input"
                                   type="checkbox"
                                   id="event_space"
                                   checked={formData.space_types.event_space.enabled}
                                   onChange={(e) => handleSpaceTypeToggle('event_space', e.target.checked)}
                                 />
                                 <label className="form-check-label fw-bold" htmlFor="event_space">
                                   Event Space
                                 </label>
                               </div>
                               {formData.space_types.event_space.enabled && (
                                 <div>
                                   <div className="mb-2">
                                     <label className="form-label">Capacity</label>
                                     <input
                                       type="number"
                                       className="form-control"
                                       value={formData.space_types.event_space.capacity}
                                       onChange={(e) => handleSpaceConfigChange('event_space', 'capacity', e.target.value)}
                                     />
                                   </div>
                                   <div>
                                     <label className="form-label">Pricing</label>
                                     <input
                                       type="text"
                                       className="form-control"
                                       value={formData.space_types.event_space.pricing}
                                       onChange={(e) => handleSpaceConfigChange('event_space', 'pricing', e.target.value)}
                                       placeholder="₹10000/day"
                                     />
                                   </div>
                                 </div>
                               )}
                             </div>
                           </div>
                         </div>

                         {/* Virtual Office */}
                         <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
                           <div className="card h-100">
                             <div className="card-body">
                               <div className="form-check mb-3">
                                 <input
                                   className="form-check-input"
                                   type="checkbox"
                                   id="virtual_office"
                                   checked={formData.space_types.virtual_office.enabled}
                                   onChange={(e) => handleSpaceTypeToggle('virtual_office', e.target.checked)}
                                 />
                                 <label className="form-check-label fw-bold" htmlFor="virtual_office">
                                   Virtual Office
                                 </label>
                               </div>
                               {formData.space_types.virtual_office.enabled && (
                                 <div>
                                   <div className="form-check mb-2">
                                     <input
                                       className="form-check-input"
                                       type="checkbox"
                                       id="business_address"
                                       checked={formData.space_types.virtual_office.business_address}
                                       onChange={(e) => handleSpaceConfigChange('virtual_office', 'business_address', e.target.checked)}
                                     />
                                     <label className="form-check-label" htmlFor="business_address">
                                       Business Address
                                     </label>
                                   </div>
                                   <div className="form-check mb-2">
                                     <input
                                       className="form-check-input"
                                       type="checkbox"
                                       id="mail_handling"
                                       checked={formData.space_types.virtual_office.mail_handling}
                                       onChange={(e) => handleSpaceConfigChange('virtual_office', 'mail_handling', e.target.checked)}
                                     />
                                     <label className="form-check-label" htmlFor="mail_handling">
                                       Mail Handling
                                     </label>
                                   </div>
                                   <div className="form-check">
                                     <input
                                       className="form-check-input"
                                       type="checkbox"
                                       id="call_handling"
                                       checked={formData.space_types.virtual_office.call_handling}
                                       onChange={(e) => handleSpaceConfigChange('virtual_office', 'call_handling', e.target.checked)}
                                     />
                                     <label className="form-check-label" htmlFor="call_handling">
                                       Call Handling
                                     </label>
                                   </div>
                                 </div>
                               )}
                             </div>
                           </div>
                         </div>

                         {/* Enterprise Solutions */}
                         <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
                           <div className="card h-100">
                             <div className="card-body">
                               <div className="form-check mb-3">
                                 <input
                                   className="form-check-input"
                                   type="checkbox"
                                   id="enterprise_solutions"
                                   checked={formData.space_types.enterprise_solutions.enabled}
                                   onChange={(e) => handleSpaceTypeToggle('enterprise_solutions', e.target.checked)}
                                 />
                                 <label className="form-check-label fw-bold" htmlFor="enterprise_solutions">
                                   Enterprise Solutions
                                 </label>
                               </div>
                               {formData.space_types.enterprise_solutions.enabled && (
                                 <div>
                                   <label className="form-label">Description</label>
                                   <textarea
                                     className="form-control"
                                     rows={2}
                                     value={formData.space_types.enterprise_solutions.description}
                                     onChange={(e) => handleSpaceConfigChange('enterprise_solutions', 'description', e.target.value)}
                                     placeholder="Describe solutions..."
                                   />
                                 </div>
                               )}
                             </div>
                           </div>
                         </div>
                       </div>

                       {/* Meeting Room - Full Width (Special Case) */}
                       <div className="row">
                         <div className="col-12 mb-3">
                           <div className="card">
                             <div className="card-body">
                               <div className="form-check mb-3">
                                 <input
                                   className="form-check-input"
                                   type="checkbox"
                                   id="meeting_room"
                                   checked={formData.space_types.meeting_room.enabled}
                                   onChange={(e) => handleSpaceTypeToggle('meeting_room', e.target.checked)}
                                 />
                                 <label className="form-check-label fw-bold" htmlFor="meeting_room">
                                   Meeting Room
                                 </label>
                               </div>
                               {formData.space_types.meeting_room.enabled && (
                                 <div>
                                   {formData.space_types.meeting_room.rooms.map((room, index) => (
                                     <div key={index} className="row mb-3 border rounded p-3">
                                       <div className="col-md-3">
                                         <label className="form-label">Room Name</label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={room.name}
                                           onChange={(e) => updateMeetingRoom(index, 'name', e.target.value)}
                                         />
                                       </div>
                                       <div className="col-md-2">
                                         <label className="form-label">Capacity</label>
                                         <input
                                           type="number"
                                           className="form-control"
                                           value={room.capacity}
                                           onChange={(e) => updateMeetingRoom(index, 'capacity', e.target.value)}
                                         />
                                       </div>
                                       <div className="col-md-3">
                                         <label className="form-label">Hourly Price</label>
                                         <input
                                           type="number"
                                           className="form-control"
                                           value={room.hourly_price}
                                           onChange={(e) => updateMeetingRoom(index, 'hourly_price', e.target.value)}
                                         />
                                       </div>
                                       <div className="col-md-3">
                                         <label className="form-label">Daily Price</label>
                                         <input
                                           type="number"
                                           className="form-control"
                                           value={room.daily_price}
                                           onChange={(e) => updateMeetingRoom(index, 'daily_price', e.target.value)}
                                         />
                                       </div>
                                       <div className="col-md-1 d-flex align-items-end">
                                         <button
                                           type="button"
                                           className="btn btn-danger btn-sm"
                                           onClick={() => removeMeetingRoom(index)}
                                         >
                                           <CIcon icon={cilX} />
                                         </button>
                                       </div>
                                     </div>
                                   ))}
                                   <button
                                     type="button"
                                     className="btn btn-outline-primary btn-sm"
                                     onClick={addMeetingRoom}
                                   >
                                     <CIcon icon={cilPlus} className="me-2" />
                                     Add Meeting Room
                                   </button>
                                 </div>
                               )}
                             </div>
                           </div>
                         </div>
                       </div>

                       {/* Pricing Configuration Section */}
                       <div className="row mt-4">
                         <div className="col-12">
                           <h6 className="mb-3">
                             <CIcon icon={cilCreditCard} className="me-2" />
                             Pricing (Dynamic)
                           </h6>
                         </div>
                         
                         <div className="row">
                           {/* Day Pass */}
                           <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
                             <div className="card h-100">
                               <div className="card-body">
                                 <div className="form-check mb-3">
                                   <input
                                     className="form-check-input"
                                     type="checkbox"
                                     id="day_pass_pricing"
                                     checked={formData.pricing_options.day_pass.enabled}
                                     onChange={(e) => handlePricingToggle('day_pass', e.target.checked)}
                                   />
                                   <label className="form-check-label fw-bold" htmlFor="day_pass_pricing">
                                     Day Pass
                                   </label>
                                 </div>
                                 {formData.pricing_options.day_pass.enabled && (
                                   <div>
                                     <label className="form-label">Price per seat/day</label>
                                     <input
                                       type="number"
                                       className="form-control"
                                       value={formData.pricing_options.day_pass.price_per_seat}
                                       onChange={(e) => handlePricingConfigChange('day_pass', 'price_per_seat', e.target.value)}
                                       placeholder="₹500"
                                     />
                                   </div>
                                 )}
                               </div>
                             </div>
                           </div>

                           {/* Weekly Pass */}
                           <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
                             <div className="card h-100">
                               <div className="card-body">
                                 <div className="form-check mb-3">
                                   <input
                                     className="form-check-input"
                                     type="checkbox"
                                     id="weekly_pass_pricing"
                                     checked={formData.pricing_options.weekly_pass.enabled}
                                     onChange={(e) => handlePricingToggle('weekly_pass', e.target.checked)}
                                   />
                                   <label className="form-check-label fw-bold" htmlFor="weekly_pass_pricing">
                                     Weekly Pass
                                   </label>
                                 </div>
                                 {formData.pricing_options.weekly_pass.enabled && (
                                   <div>
                                     <label className="form-label">Price per seat/week</label>
                                     <input
                                       type="number"
                                       className="form-control"
                                       value={formData.pricing_options.weekly_pass.price_per_seat}
                                       onChange={(e) => handlePricingConfigChange('weekly_pass', 'price_per_seat', e.target.value)}
                                       placeholder="₹2000"
                                     />
                                   </div>
                                 )}
                               </div>
                             </div>
                           </div>

                           {/* Monthly Hot Desk */}
                           <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
                             <div className="card h-100">
                               <div className="card-body">
                                 <div className="form-check mb-3">
                                   <input
                                     className="form-check-input"
                                     type="checkbox"
                                     id="monthly_hot_desk_pricing"
                                     checked={formData.pricing_options.monthly_hot_desk.enabled}
                                     onChange={(e) => handlePricingToggle('monthly_hot_desk', e.target.checked)}
                                   />
                                   <label className="form-check-label fw-bold" htmlFor="monthly_hot_desk_pricing">
                                     Monthly Hot Desk
                                   </label>
                                 </div>
                                 {formData.pricing_options.monthly_hot_desk.enabled && (
                                   <div>
                                     <label className="form-label">Price per seat/month</label>
                                     <input
                                       type="number"
                                       className="form-control"
                                       value={formData.pricing_options.monthly_hot_desk.price_per_seat}
                                       onChange={(e) => handlePricingConfigChange('monthly_hot_desk', 'price_per_seat', e.target.value)}
                                       placeholder="₹8000"
                                     />
                                   </div>
                                 )}
                               </div>
                             </div>
                           </div>

                           {/* Monthly Dedicated Desk */}
                           <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
                             <div className="card h-100">
                               <div className="card-body">
                                 <div className="form-check mb-3">
                                   <input
                                     className="form-check-input"
                                     type="checkbox"
                                     id="monthly_dedicated_desk_pricing"
                                     checked={formData.pricing_options.monthly_dedicated_desk.enabled}
                                     onChange={(e) => handlePricingToggle('monthly_dedicated_desk', e.target.checked)}
                                   />
                                   <label className="form-check-label fw-bold" htmlFor="monthly_dedicated_desk_pricing">
                                     Monthly Dedicated Desk
                                   </label>
                                 </div>
                                 {formData.pricing_options.monthly_dedicated_desk.enabled && (
                                   <div>
                                     <label className="form-label">Price per seat/month</label>
                                     <input
                                       type="number"
                                       className="form-control"
                                       value={formData.pricing_options.monthly_dedicated_desk.price_per_seat}
                                       onChange={(e) => handlePricingConfigChange('monthly_dedicated_desk', 'price_per_seat', e.target.value)}
                                       placeholder="₹12000"
                                     />
                                   </div>
                                 )}
                               </div>
                             </div>
                           </div>
                         </div>

                         <div className="row">
                           {/* Conference Rooms Pricing */}
                           <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
                             <div className="card h-100">
                               <div className="card-body">
                                 <div className="form-check mb-3">
                                   <input
                                     className="form-check-input"
                                     type="checkbox"
                                     id="conference_rooms_pricing"
                                     checked={formData.pricing_options.conference_rooms_pricing.enabled}
                                     onChange={(e) => handlePricingToggle('conference_rooms_pricing', e.target.checked)}
                                   />
                                   <label className="form-check-label fw-bold" htmlFor="conference_rooms_pricing">
                                     Conference Rooms
                                   </label>
                                 </div>
                                 {formData.pricing_options.conference_rooms_pricing.enabled && (
                                   <div>
                                     <div className="mb-2">
                                       <label className="form-label">Capacity</label>
                                       <input
                                         type="number"
                                         className="form-control"
                                         value={formData.pricing_options.conference_rooms_pricing.capacity}
                                         onChange={(e) => handlePricingConfigChange('conference_rooms_pricing', 'capacity', e.target.value)}
                                       />
                                     </div>
                                     <div className="mb-2">
                                       <label className="form-label">Price/hour</label>
                                       <input
                                         type="number"
                                         className="form-control"
                                         value={formData.pricing_options.conference_rooms_pricing.price_per_hour}
                                         onChange={(e) => handlePricingConfigChange('conference_rooms_pricing', 'price_per_hour', e.target.value)}
                                         placeholder="₹1000"
                                       />
                                     </div>
                                     <div>
                                       <label className="form-label">Price/day</label>
                                       <input
                                         type="number"
                                         className="form-control"
                                         value={formData.pricing_options.conference_rooms_pricing.price_per_day}
                                         onChange={(e) => handlePricingConfigChange('conference_rooms_pricing', 'price_per_day', e.target.value)}
                                         placeholder="₹7000"
                                       />
                                     </div>
                                   </div>
                                 )}
                               </div>
                             </div>
                           </div>

                           {/* Event Space Pricing */}
                           <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
                             <div className="card h-100">
                               <div className="card-body">
                                 <div className="form-check mb-3">
                                   <input
                                     className="form-check-input"
                                     type="checkbox"
                                     id="event_space_pricing"
                                     checked={formData.pricing_options.event_space_pricing.enabled}
                                     onChange={(e) => handlePricingToggle('event_space_pricing', e.target.checked)}
                                   />
                                   <label className="form-check-label fw-bold" htmlFor="event_space_pricing">
                                     Event Space
                                   </label>
                                 </div>
                                 {formData.pricing_options.event_space_pricing.enabled && (
                                   <div>
                                     <div className="mb-2">
                                       <label className="form-label">Capacity</label>
                                       <input
                                         type="number"
                                         className="form-control"
                                         value={formData.pricing_options.event_space_pricing.capacity}
                                         onChange={(e) => handlePricingConfigChange('event_space_pricing', 'capacity', e.target.value)}
                                       />
                                     </div>
                                     <div className="mb-2">
                                       <label className="form-label">Price/hour</label>
                                       <input
                                         type="number"
                                         className="form-control"
                                         value={formData.pricing_options.event_space_pricing.price_per_hour}
                                         onChange={(e) => handlePricingConfigChange('event_space_pricing', 'price_per_hour', e.target.value)}
                                         placeholder="₹2000"
                                       />
                                     </div>
                                     <div>
                                       <label className="form-label">Price/day</label>
                                       <input
                                         type="number"
                                         className="form-control"
                                         value={formData.pricing_options.event_space_pricing.price_per_day}
                                         onChange={(e) => handlePricingConfigChange('event_space_pricing', 'price_per_day', e.target.value)}
                                         placeholder="₹15000"
                                       />
                                     </div>
                                   </div>
                                 )}
                               </div>
                             </div>
                           </div>

                           {/* Virtual Office Plans */}
                           <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
                             <div className="card h-100">
                               <div className="card-body">
                                 <div className="form-check mb-3">
                                   <input
                                     className="form-check-input"
                                     type="checkbox"
                                     id="virtual_office_plans"
                                     checked={formData.pricing_options.virtual_office_plans.enabled}
                                     onChange={(e) => handlePricingToggle('virtual_office_plans', e.target.checked)}
                                   />
                                   <label className="form-check-label fw-bold" htmlFor="virtual_office_plans">
                                     Virtual Office Plans
                                   </label>
                                 </div>
                                 {formData.pricing_options.virtual_office_plans.enabled && (
                                   <div>
                                     <div className="mb-2">
                                       <label className="form-label">Business Address</label>
                                       <input
                                         type="number"
                                         className="form-control"
                                         value={formData.pricing_options.virtual_office_plans.business_address_price}
                                         onChange={(e) => handlePricingConfigChange('virtual_office_plans', 'business_address_price', e.target.value)}
                                         placeholder="₹2000"
                                       />
                                     </div>
                                     <div className="mb-2">
                                       <label className="form-label">Mail Handling</label>
                                       <input
                                         type="number"
                                         className="form-control"
                                         value={formData.pricing_options.virtual_office_plans.mail_handling_price}
                                         onChange={(e) => handlePricingConfigChange('virtual_office_plans', 'mail_handling_price', e.target.value)}
                                         placeholder="₹1000"
                                       />
                                     </div>
                                     <div className="mb-2">
                                       <label className="form-label">GST Registration</label>
                                       <input
                                         type="number"
                                         className="form-control"
                                         value={formData.pricing_options.virtual_office_plans.gst_registration_price}
                                         onChange={(e) => handlePricingConfigChange('virtual_office_plans', 'gst_registration_price', e.target.value)}
                                         placeholder="₹5000"
                                       />
                                     </div>
                                     <div>
                                       <label className="form-label">Combined Price</label>
                                       <input
                                         type="number"
                                         className="form-control"
                                         value={formData.pricing_options.virtual_office_plans.combined_price}
                                         onChange={(e) => handlePricingConfigChange('virtual_office_plans', 'combined_price', e.target.value)}
                                         placeholder="₹7000"
                                       />
                                     </div>
                                   </div>
                                 )}
                               </div>
                             </div>
                           </div>

                           {/* Enterprise Deals */}
                           <div className="col-xl-3 col-lg-4 col-md-6 mb-3">
                             <div className="card h-100">
                               <div className="card-body">
                                 <div className="form-check mb-3">
                                   <input
                                     className="form-check-input"
                                     type="checkbox"
                                     id="enterprise_deals"
                                     checked={formData.pricing_options.enterprise_deals.enabled}
                                     onChange={(e) => handlePricingToggle('enterprise_deals', e.target.checked)}
                                   />
                                   <label className="form-check-label fw-bold" htmlFor="enterprise_deals">
                                     Enterprise Deals
                                   </label>
                                 </div>
                                 {formData.pricing_options.enterprise_deals.enabled && (
                                   <div>
                                     <div className="mb-2">
                                       <label className="form-label">Custom Quote</label>
                                       <textarea
                                         className="form-control"
                                         rows={2}
                                         value={formData.pricing_options.enterprise_deals.custom_quote}
                                         onChange={(e) => handlePricingConfigChange('enterprise_deals', 'custom_quote', e.target.value)}
                                         placeholder="Custom pricing details..."
                                       />
                                     </div>
                                     <div>
                                       <label className="form-label">Attach Brochure</label>
                                       <input
                                         type="file"
                                         className="form-control"
                                         onChange={handleBrochureFileChange}
                                         accept=".pdf,.doc,.docx"
                                       />
                                     </div>
                                   </div>
                                 )}
                               </div>
                             </div>
                           </div>
                         </div>

                         {/* Private Cabins Pricing - Full Width */}
                         <div className="row">
                           <div className="col-12 mb-3">
                             <div className="card">
                               <div className="card-body">
                                 <div className="form-check mb-3">
                                   <input
                                     className="form-check-input"
                                     type="checkbox"
                                     id="private_cabins_pricing"
                                     checked={formData.pricing_options.private_cabins_pricing.enabled}
                                     onChange={(e) => handlePricingToggle('private_cabins_pricing', e.target.checked)}
                                   />
                                   <label className="form-check-label fw-bold" htmlFor="private_cabins_pricing">
                                     Private Cabins Pricing
                                   </label>
                                 </div>
                                 {formData.pricing_options.private_cabins_pricing.enabled && (
                                   <div>
                                     {formData.pricing_options.private_cabins_pricing.plans.map((plan, index) => (
                                       <div key={index} className="row mb-3 border rounded p-3">
                                         <div className="col-md-5">
                                           <label className="form-label">Capacity</label>
                                           <input
                                             type="number"
                                             className="form-control"
                                             value={plan.capacity}
                                             onChange={(e) => updatePrivateCabinPlan(index, 'capacity', e.target.value)}
                                           />
                                         </div>
                                         <div className="col-md-5">
                                           <label className="form-label">Price per month</label>
                                           <input
                                             type="number"
                                             className="form-control"
                                             value={plan.price_per_month}
                                             onChange={(e) => updatePrivateCabinPlan(index, 'price_per_month', e.target.value)}
                                           />
                                         </div>
                                         <div className="col-md-2 d-flex align-items-end">
                                           <button
                                             type="button"
                                             className="btn btn-danger btn-sm"
                                             onClick={() => removePrivateCabinPlan(index)}
                                           >
                                             <CIcon icon={cilX} />
                                           </button>
                                         </div>
                                       </div>
                                     ))}
                                     <button
                                       type="button"
                                       className="btn btn-outline-primary btn-sm"
                                       onClick={addPrivateCabinPlan}
                                     >
                                       <CIcon icon={cilPlus} className="me-2" />
                                       Add Cabin Plan
                                     </button>
                                   </div>
                                 )}
                               </div>
                             </div>
                           </div>
                         </div>

                         {/* Meeting Rooms Pricing - Full Width */}
                         <div className="row">
                           <div className="col-12 mb-3">
                             <div className="card">
                               <div className="card-body">
                                 <div className="form-check mb-3">
                                   <input
                                     className="form-check-input"
                                     type="checkbox"
                                     id="meeting_rooms_pricing"
                                     checked={formData.pricing_options.meeting_rooms_pricing.enabled}
                                     onChange={(e) => handlePricingToggle('meeting_rooms_pricing', e.target.checked)}
                                   />
                                   <label className="form-check-label fw-bold" htmlFor="meeting_rooms_pricing">
                                     Meeting Rooms Pricing
                                   </label>
                                 </div>
                                 {formData.pricing_options.meeting_rooms_pricing.enabled && (
                                   <div>
                                     {formData.pricing_options.meeting_rooms_pricing.rooms.map((room, index) => (
                                       <div key={index} className="row mb-3 border rounded p-3">
                                         <div className="col-md-3">
                                           <label className="form-label">Room Name</label>
                                           <input
                                             type="text"
                                             className="form-control"
                                             value={room.name}
                                             onChange={(e) => updateMeetingRoomPricing(index, 'name', e.target.value)}
                                           />
                                         </div>
                                         <div className="col-md-2">
                                           <label className="form-label">Capacity</label>
                                           <input
                                             type="number"
                                             className="form-control"
                                             value={room.capacity}
                                             onChange={(e) => updateMeetingRoomPricing(index, 'capacity', e.target.value)}
                                           />
                                         </div>
                                         <div className="col-md-3">
                                           <label className="form-label">Price per hour</label>
                                           <input
                                             type="number"
                                             className="form-control"
                                             value={room.price_per_hour}
                                             onChange={(e) => updateMeetingRoomPricing(index, 'price_per_hour', e.target.value)}
                                           />
                                         </div>
                                         <div className="col-md-3">
                                           <label className="form-label">Price per day</label>
                                           <input
                                             type="number"
                                             className="form-control"
                                             value={room.price_per_day}
                                             onChange={(e) => updateMeetingRoomPricing(index, 'price_per_day', e.target.value)}
                                           />
                                         </div>
                                         <div className="col-md-1 d-flex align-items-end">
                                           <button
                                             type="button"
                                             className="btn btn-danger btn-sm"
                                             onClick={() => removeMeetingRoomPricing(index)}
                                           >
                                             <CIcon icon={cilX} />
                                           </button>
                                         </div>
                                       </div>
                                     ))}
                                     <button
                                       type="button"
                                       className="btn btn-outline-primary btn-sm"
                                       onClick={addMeetingRoomPricing}
                                     >
                                       <CIcon icon={cilPlus} className="me-2" />
                                       Add Meeting Room Pricing
                                     </button>
                                   </div>
                                 )}
                               </div>
                             </div>
                           </div>
                         </div>
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

              {/* Furnishing Type */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="mb-3">
                    <CIcon icon={cilSettings} className="me-2" />
                    Furnishing Type
                  </h5>
                  <p className="text-muted small mb-3">Select all that apply (optional)</p>
                </div>

                <div className="col-12">
                  <div className="d-flex flex-wrap gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="furnishing-bare-shell"
                        checked={formData.furnishing_types.includes('Bare Shell')}
                        onChange={(e) => handleFurnishingTypeChange('Bare Shell', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="furnishing-bare-shell">
                        <strong>Bare Shell</strong>
                        <br />
                        <small className="text-muted">Raw space with only flooring, walls, basic civil work</small>
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="furnishing-warm-shell"
                        checked={formData.furnishing_types.includes('Warm Shell')}
                        onChange={(e) => handleFurnishingTypeChange('Warm Shell', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="furnishing-warm-shell">
                        <strong>Warm Shell</strong>
                        <br />
                        <small className="text-muted">With HVAC, lighting, false ceiling, and basic finishes</small>
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="furnishing-plug-play"
                        checked={formData.furnishing_types.includes('Plug & Play')}
                        onChange={(e) => handleFurnishingTypeChange('Plug & Play', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="furnishing-plug-play">
                        <strong>Plug & Play</strong>
                        <br />
                        <small className="text-muted">Fully furnished with workstations, IT infrastructure, etc.</small>
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="furnishing-managed"
                        checked={formData.furnishing_types.includes('Managed Office')}
                        onChange={(e) => handleFurnishingTypeChange('Managed Office', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="furnishing-managed">
                        <strong>Managed Office</strong>
                        <br />
                        <small className="text-muted">Operated and serviced by third-party providers</small>
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="furnishing-coworking"
                        checked={formData.furnishing_types.includes('Co-working')}
                        onChange={(e) => handleFurnishingTypeChange('Co-working', e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="furnishing-coworking">
                        <strong>Co-working</strong>
                        <br />
                        <small className="text-muted">Flexible shared office spaces</small>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              {/* Space & Layout Details */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="mb-3">
                    <CIcon icon={cilChart} className="me-2" />
                    Space & Layout Details
                  </h5>
                  <p className="text-muted small mb-3">All fields in this section are optional</p>
                </div>

                {/* Area Details */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Total Built-up Area (sq. ft.)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.space_layout_details.total_built_up_area_sqft}
                      onChange={(e) => handleSpaceLayoutChange('total_built_up_area_sqft', e.target.value)}
                      placeholder="e.g., 25000"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Carpet Area (sq. ft.)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.space_layout_details.carpet_area_sqft}
                      onChange={(e) => handleSpaceLayoutChange('carpet_area_sqft', e.target.value)}
                      placeholder="e.g., 18000"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Super Built-up Area (sq. ft.)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.space_layout_details.super_built_up_area_sqft}
                      onChange={(e) => handleSpaceLayoutChange('super_built_up_area_sqft', e.target.value)}
                      placeholder="e.g., 27000"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Available Space Area (sq. ft.)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.space_layout_details.available_space_area_sqft}
                      onChange={(e) => handleSpaceLayoutChange('available_space_area_sqft', e.target.value)}
                      placeholder="e.g., 5000"
                    />
                  </div>
                </div>

                {/* Building Details */}
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Number of Floors in Building</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.space_layout_details.building_floors}
                      onChange={(e) => handleSpaceLayoutChange('building_floors', e.target.value)}
                      placeholder="e.g., 12"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Floor Number of Available Unit</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.space_layout_details.available_unit_floor}
                      onChange={(e) => handleSpaceLayoutChange('available_unit_floor', e.target.value)}
                      placeholder="e.g., 5"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Floor Plate Size (sq. ft.)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.space_layout_details.floor_plate_size_sqft}
                      onChange={(e) => handleSpaceLayoutChange('floor_plate_size_sqft', e.target.value)}
                      placeholder="e.g., 2200"
                    />
                  </div>
                </div>

                {/* Seating & Distribution */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Seating Capacity (Workstations)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.space_layout_details.seating_capacity}
                      onChange={(e) => handleSpaceLayoutChange('seating_capacity', e.target.value)}
                      placeholder="e.g., 150"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Height from Floor to Ceiling (ft.)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.space_layout_details.floor_to_ceiling_height_ft}
                      onChange={(e) => handleSpaceLayoutChange('floor_to_ceiling_height_ft', e.target.value)}
                      placeholder="e.g., 12"
                    />
                  </div>
                </div>

                {/* Distribution */}
                <div className="col-12">
                  <h6 className="mb-3 mt-2">Cabin / Conference Room / Workstation Distribution</h6>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Cabins</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.space_layout_details.distribution.cabins}
                      onChange={(e) => handleSpaceLayoutChange('distribution', e.target.value, 'cabins')}
                      placeholder="e.g., 10"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Conference Rooms</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.space_layout_details.distribution.conference_rooms}
                      onChange={(e) => handleSpaceLayoutChange('distribution', e.target.value, 'conference_rooms')}
                      placeholder="e.g., 3"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Workstations</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.space_layout_details.distribution.workstations}
                      onChange={(e) => handleSpaceLayoutChange('distribution', e.target.value, 'workstations')}
                      placeholder="e.g., 120"
                    />
                  </div>
                </div>

                {/* Washrooms */}
                <div className="col-12">
                  <h6 className="mb-3 mt-2">Washrooms</h6>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Male</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.space_layout_details.washrooms.male}
                      onChange={(e) => handleSpaceLayoutChange('washrooms', e.target.value, 'male')}
                      placeholder="e.g., 4"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Female</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.space_layout_details.washrooms.female}
                      onChange={(e) => handleSpaceLayoutChange('washrooms', e.target.value, 'female')}
                      placeholder="e.g., 4"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Unisex</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.space_layout_details.washrooms.unisex}
                      onChange={(e) => handleSpaceLayoutChange('washrooms', e.target.value, 'unisex')}
                      placeholder="e.g., 2"
                    />
                  </div>
                </div>

                {/* Availability Date */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Availability Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.space_layout_details.availability_date}
                      onChange={(e) => handleSpaceLayoutChange('availability_date', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <hr />

              {/* Building & Project Details */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="mb-3">
                    <CIcon icon={cilBuilding} className="me-2" />
                    Building & Project Details
                  </h5>
                  <p className="text-muted small mb-3">All fields in this section are optional</p>
                </div>

                {/* Building Name & Developer */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Building Name / Project Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.building_project_details.building_name}
                      onChange={(e) => handleBuildingProjectChange('building_name', e.target.value)}
                      placeholder="e.g., Allied House"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Developer / Owner</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.building_project_details.developer_owner}
                      onChange={(e) => handleBuildingProjectChange('developer_owner', e.target.value)}
                      placeholder="e.g., Prestige Group"
                    />
                  </div>
                </div>

                {/* Building Age & Type */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Building Age (in years)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.building_project_details.building_age}
                      onChange={(e) => handleBuildingProjectChange('building_age', e.target.value)}
                      placeholder="e.g., 5"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Building Type</label>
                    <select
                      className="form-select"
                      value={formData.building_project_details.building_type}
                      onChange={(e) => handleBuildingProjectChange('building_type', e.target.value)}
                    >
                      <option value="">Select Building Type</option>
                      <option value="IT/ITES Park">IT/ITES Park</option>
                      <option value="Commercial">Commercial</option>
                      <option value="SEZ">SEZ</option>
                      <option value="Tech Park">Tech Park</option>
                      <option value="Mixed Use">Mixed Use</option>
                      <option value="Green Building">Green Building</option>
                    </select>
                  </div>
                </div>

                {/* Total Floors & Basement */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Total Number of Floors</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.building_project_details.total_floors}
                      onChange={(e) => handleBuildingProjectChange('total_floors', e.target.value)}
                      placeholder="e.g., 10"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Basement Availability</label>
                    <select
                      className="form-select"
                      value={formData.building_project_details.basement_available}
                      onChange={(e) => handleBuildingProjectChange('basement_available', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                {/* Power Details */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Power Load Available (Total KVA)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.building_project_details.power_load_total_kva}
                      onChange={(e) => handleBuildingProjectChange('power_load_total_kva', e.target.value)}
                      placeholder="e.g., 500"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Power Availability per sq. ft. (KVA/sq. ft.)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={formData.building_project_details.power_per_sqft}
                      onChange={(e) => handleBuildingProjectChange('power_per_sqft', e.target.value)}
                      placeholder="e.g., 0.05"
                    />
                  </div>
                </div>

                {/* Car Parking & Compliance */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Car Parking Ratio</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.building_project_details.car_parking_ratio}
                      onChange={(e) => handleBuildingProjectChange('car_parking_ratio', e.target.value)}
                      placeholder="e.g., 1:1000 (1 car park per 1000 sq.ft.)"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">NBC (National Building Code) Compliance</label>
                    <select
                      className="form-select"
                      value={formData.building_project_details.nbc_compliance}
                      onChange={(e) => handleBuildingProjectChange('nbc_compliance', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Partial">Partial</option>
                    </select>
                  </div>
                </div>

                {/* SEZ Status */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">SEZ / Non-SEZ</label>
                    <select
                      className="form-select"
                      value={formData.building_project_details.sez_status}
                      onChange={(e) => handleBuildingProjectChange('sez_status', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="SEZ">SEZ</option>
                      <option value="Non-SEZ">Non-SEZ</option>
                    </select>
                  </div>
                </div>
              </div>

              <hr />

              {/* Health, Safety & Wellness */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="mb-3">
                    ❤️ Health, Safety & Wellness
                  </h5>
                  <p className="text-muted small mb-3">All fields in this section are optional</p>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Emergency Exits & Signages</label>
                    <select
                      className="form-select"
                      value={formData.health_safety.emergency_exits_signages}
                      onChange={(e) => handleHealthSafetyChange('emergency_exits_signages', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Indoor Air Quality Monitoring</label>
                    <select
                      className="form-select"
                      value={formData.health_safety.indoor_air_quality}
                      onChange={(e) => handleHealthSafetyChange('indoor_air_quality', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Natural Ventilation / Daylighting</label>
                    <select
                      className="form-select"
                      value={formData.health_safety.natural_ventilation}
                      onChange={(e) => handleHealthSafetyChange('natural_ventilation', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">First Aid Room / Wellness Room</label>
                    <select
                      className="form-select"
                      value={formData.health_safety.first_aid_wellness_room}
                      onChange={(e) => handleHealthSafetyChange('first_aid_wellness_room', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Covid-Compliant Protocols</label>
                    <select
                      className="form-select"
                      value={formData.health_safety.covid_compliant}
                      onChange={(e) => handleHealthSafetyChange('covid_compliant', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Fire Exits and Assembly Area</label>
                    <select
                      className="form-select"
                      value={formData.health_safety.fire_exits_assembly}
                      onChange={(e) => handleHealthSafetyChange('fire_exits_assembly', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Ergonomic Seating Setup</label>
                    <select
                      className="form-select"
                      value={formData.health_safety.ergonomic_seating}
                      onChange={(e) => handleHealthSafetyChange('ergonomic_seating', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Accessibility for Differently Abled</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.health_safety.accessibility_disabled}
                      onChange={(e) => handleHealthSafetyChange('accessibility_disabled', e.target.value)}
                      placeholder="e.g., Ramps, Lifts with Braille, Accessible Washrooms"
                    />
                  </div>
                </div>
              </div>

              <hr />

              {/* Sustainability & Utilities */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="mb-3">
                    🌱 Sustainability & Utilities
                  </h5>
                  <p className="text-muted small mb-3">All fields in this section are optional</p>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Source of Water Supply</label>
                    <select
                      className="form-select"
                      value={formData.sustainability.water_supply_source}
                      onChange={(e) => handleSustainabilityChange('water_supply_source', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Municipal">Municipal</option>
                      <option value="Borewell">Borewell</option>
                      <option value="STP">STP</option>
                      <option value="Recycled">Recycled</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Sewage Treatment Plant (STP)</label>
                    <select
                      className="form-select"
                      value={formData.sustainability.stp_available}
                      onChange={(e) => handleSustainabilityChange('stp_available', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Rainwater Harvesting</label>
                    <select
                      className="form-select"
                      value={formData.sustainability.rainwater_harvesting}
                      onChange={(e) => handleSustainabilityChange('rainwater_harvesting', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Renewable Energy Use</label>
                    <select
                      className="form-select"
                      value={formData.sustainability.renewable_energy}
                      onChange={(e) => handleSustainabilityChange('renewable_energy', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Solar">Solar</option>
                      <option value="Wind">Wind</option>
                      <option value="Solar & Wind">Solar & Wind</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Energy Efficient Equipment & Fixtures</label>
                    <select
                      className="form-select"
                      value={formData.sustainability.energy_efficient_equipment}
                      onChange={(e) => handleSustainabilityChange('energy_efficient_equipment', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Waste Segregation & Green Disposal</label>
                    <select
                      className="form-select"
                      value={formData.sustainability.waste_segregation}
                      onChange={(e) => handleSustainabilityChange('waste_segregation', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">E-Vehicle Charging Stations</label>
                    <select
                      className="form-select"
                      value={formData.sustainability.ev_charging_stations}
                      onChange={(e) => handleSustainabilityChange('ev_charging_stations', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>

              <hr />

              {/* Statutory & Regulatory Compliance */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="mb-3">
                    📄 Statutory & Regulatory Compliance
                  </h5>
                  <p className="text-muted small mb-3">Upload compliance documents (all optional)</p>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Occupancy Certificate (OC)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleComplianceDocumentChange('occupancy_certificate', e.target.files?.[0] || null)}
                    />
                    {formData.compliance_documents.occupancy_certificate && (
                      <small className="text-success">✓ {formData.compliance_documents.occupancy_certificate.name}</small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Fire NOC</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleComplianceDocumentChange('fire_noc', e.target.files?.[0] || null)}
                    />
                    {formData.compliance_documents.fire_noc && (
                      <small className="text-success">✓ {formData.compliance_documents.fire_noc.name}</small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Pollution Control NOC</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleComplianceDocumentChange('pollution_control_noc', e.target.files?.[0] || null)}
                    />
                    {formData.compliance_documents.pollution_control_noc && (
                      <small className="text-success">✓ {formData.compliance_documents.pollution_control_noc.name}</small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Environmental Clearance Certificate</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleComplianceDocumentChange('environmental_clearance', e.target.files?.[0] || null)}
                    />
                    {formData.compliance_documents.environmental_clearance && (
                      <small className="text-success">✓ {formData.compliance_documents.environmental_clearance.name}</small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Zoning Clearance / Town Planning Approval</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleComplianceDocumentChange('zoning_clearance', e.target.files?.[0] || null)}
                    />
                    {formData.compliance_documents.zoning_clearance && (
                      <small className="text-success">✓ {formData.compliance_documents.zoning_clearance.name}</small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Lift Safety Certificate</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleComplianceDocumentChange('lift_safety_certificate', e.target.files?.[0] || null)}
                    />
                    {formData.compliance_documents.lift_safety_certificate && (
                      <small className="text-success">✓ {formData.compliance_documents.lift_safety_certificate.name}</small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">DG Set Approval</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleComplianceDocumentChange('dg_set_approval', e.target.files?.[0] || null)}
                    />
                    {formData.compliance_documents.dg_set_approval && (
                      <small className="text-success">✓ {formData.compliance_documents.dg_set_approval.name}</small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Building Completion Certificate (BCC)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleComplianceDocumentChange('building_completion_certificate', e.target.files?.[0] || null)}
                    />
                    {formData.compliance_documents.building_completion_certificate && (
                      <small className="text-success">✓ {formData.compliance_documents.building_completion_certificate.name}</small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Structural Stability Certificate</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleComplianceDocumentChange('structural_stability_certificate', e.target.files?.[0] || null)}
                    />
                    {formData.compliance_documents.structural_stability_certificate && (
                      <small className="text-success">✓ {formData.compliance_documents.structural_stability_certificate.name}</small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">SEZ Notification (if applicable)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleComplianceDocumentChange('sez_notification', e.target.files?.[0] || null)}
                    />
                    {formData.compliance_documents.sez_notification && (
                      <small className="text-success">✓ {formData.compliance_documents.sez_notification.name}</small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Disaster Management / Emergency Evacuation Plan</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleComplianceDocumentChange('disaster_management_plan', e.target.files?.[0] || null)}
                    />
                    {formData.compliance_documents.disaster_management_plan && (
                      <small className="text-success">✓ {formData.compliance_documents.disaster_management_plan.name}</small>
                    )}
                  </div>
                </div>
              </div>

              <hr />

              {/* Certifications & Ratings */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="mb-3">
                    🏅 Certifications & Ratings
                  </h5>
                  <p className="text-muted small mb-3">All fields in this section are optional</p>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">LEED / IGBC Certification</label>
                    <select
                      className="form-select"
                      value={formData.certifications.leed_igbc}
                      onChange={(e) => handleCertificationChange('leed_igbc', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="None">None</option>
                      <option value="Certified">Certified</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">WELL Building Standard</label>
                    <select
                      className="form-select"
                      value={formData.certifications.well_building}
                      onChange={(e) => handleCertificationChange('well_building', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Smart Building Certification</label>
                    <select
                      className="form-select"
                      value={formData.certifications.smart_building}
                      onChange={(e) => handleCertificationChange('smart_building', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">NBC 2016 Compliance</label>
                    <select
                      className="form-select"
                      value={formData.certifications.nbc_compliance}
                      onChange={(e) => handleCertificationChange('nbc_compliance', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label">ISO Certifications (Select all that apply)</label>
                    <div className="d-flex flex-wrap gap-3">
                      {['9001', '14001', '45001', '27001', '50001'].map(iso => (
                        <div className="form-check" key={iso}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`iso-${iso}`}
                            checked={formData.certifications.iso_certifications.includes(iso)}
                            onChange={(e) => handleISOCertificationChange(iso, e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor={`iso-${iso}`}>
                            ISO {iso}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Any Other Certification (Specify)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.certifications.other_certification}
                      onChange={(e) => handleCertificationChange('other_certification', e.target.value)}
                      placeholder="e.g., Local Green Certification"
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