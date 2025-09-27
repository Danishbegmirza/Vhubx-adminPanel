import React, { useState, useEffect } from 'react';
import { 
  CCard, CCardBody, CCardHeader, CCol, CRow, CButton, 
  CTable, CTableHead, CTableRow, CTableHeaderCell, 
  CTableBody, CTableDataCell, CModal, CModalHeader, 
  CModalTitle, CModalBody, CModalFooter, CForm, 
  CFormLabel, CFormInput, CFormTextarea, CAlert,
  CSpinner, CBadge, CFormSelect
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilPencil, cilTrash } from '@coreui/icons';
import { 
  spaceTypeService, 
  SpaceType, 
  CreateSubTypeRequest, 
  UpdateSubTypeRequest 
} from '../services/spaceTypeService';
import { useAuth } from '../contexts/AuthContext';

// Type casting for CoreUI components
const CCardComponent = CCard as React.ComponentType<any>;
const CCardBodyComponent = CCardBody as React.ComponentType<any>;
const CCardHeaderComponent = CCardHeader as React.ComponentType<any>;
const CColComponent = CCol as React.ComponentType<any>;
const CRowComponent = CRow as React.ComponentType<any>;
const CButtonComponent = CButton as React.ComponentType<any>;
const CTableComponent = CTable as React.ComponentType<any>;
const CTableHeadComponent = CTableHead as React.ComponentType<any>;
const CTableRowComponent = CTableRow as React.ComponentType<any>;
const CTableHeaderCellComponent = CTableHeaderCell as React.ComponentType<any>;
const CTableBodyComponent = CTableBody as React.ComponentType<any>;
const CTableDataCellComponent = CTableDataCell as React.ComponentType<any>;
const CModalComponent = CModal as React.ComponentType<any>;
const CModalHeaderComponent = CModalHeader as React.ComponentType<any>;
const CModalTitleComponent = CModalTitle as React.ComponentType<any>;
const CModalBodyComponent = CModalBody as React.ComponentType<any>;
const CModalFooterComponent = CModalFooter as React.ComponentType<any>;
const CFormComponent = CForm as React.ComponentType<any>;
const CFormLabelComponent = CFormLabel as React.ComponentType<any>;
const CFormInputComponent = CFormInput as React.ComponentType<any>;
const CFormTextareaComponent = CFormTextarea as React.ComponentType<any>;
const CFormSelectComponent = CFormSelect as React.ComponentType<any>;
const CAlertComponent = CAlert as React.ComponentType<any>;
const CSpinnerComponent = CSpinner as React.ComponentType<any>;
const CBadgeComponent = CBadge as React.ComponentType<any>;

const SubTypeList: React.FC = () => {
  const [spaceTypes, setSpaceTypes] = useState<SpaceType[]>([]);
  const [subTypes, setSubTypes] = useState<SpaceType[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [subTypesLoading, setSubTypesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSubType, setEditingSubType] = useState<SpaceType | null>(null);
  const [formData, setFormData] = useState<CreateSubTypeRequest>({
    name: '',
    description: '',
    parentId: 0
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const { permissions } = useAuth();

  useEffect(() => {
    fetchSpaceTypes();
  }, []);

  useEffect(() => {
    if (selectedParentId) {
      fetchSubTypes(selectedParentId);
    } else {
      setSubTypes([]);
    }
  }, [selectedParentId]);

  const fetchSpaceTypes = async () => {
    try {
      setLoading(true);
      const data = await spaceTypeService.getSpaceTypes();
      setSpaceTypes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch space types');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubTypes = async (parentId: number) => {
    try {
      setSubTypesLoading(true);
      const data = await spaceTypeService.getSubTypes(parentId);
      setSubTypes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sub types');
      console.error(err);
    } finally {
      setSubTypesLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.parentId) {
      setError('Name, description and parent space type are required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (editingSubType) {
        await spaceTypeService.updateSubType(editingSubType.id, formData as UpdateSubTypeRequest);
      } else {
        await spaceTypeService.createSubType(formData);
      }

      setShowModal(false);
      setEditingSubType(null);
      setFormData({ name: '', description: '', parentId: selectedParentId || 0 });
      if (selectedParentId) {
        fetchSubTypes(selectedParentId);
      }
    } catch (err) {
      setError('Failed to save sub type');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (subType: SpaceType) => {
    setEditingSubType(subType);
    setFormData({
      name: subType.name,
      description: subType.description,
      parentId: subType.parentId || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await spaceTypeService.deleteSpaceType(id);
      setDeleteConfirm(null);
      if (selectedParentId) {
        fetchSubTypes(selectedParentId);
      }
    } catch (err) {
      setError('Failed to delete sub type');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', parentId: selectedParentId || 0 });
    setEditingSubType(null);
    setError(null);
  };

  const handleAddNew = () => {
    if (!selectedParentId) {
      setError('Please select a parent space type first');
      return;
    }
    setFormData({ name: '', description: '', parentId: selectedParentId });
    setShowModal(true);
  };

  const canCreate = permissions.some(p => p.module_name === 'Property Management' && p.permissions.create);
  const canEdit = permissions.some(p => p.module_name === 'Property Management' && p.permissions.edit);
  const canDelete = permissions.some(p => p.module_name === 'Property Management' && p.permissions.delete);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinnerComponent size="lg" />
      </div>
    );
  }

  return (
    <div>
      <CRowComponent>
        <CColComponent>
          <CCardComponent>
            <CCardHeaderComponent className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Sub Types</h4>
              {canCreate && (
                <CButtonComponent 
                  color="primary" 
                  onClick={handleAddNew}
                  className="d-flex align-items-center"
                  disabled={!selectedParentId}
                >
                  <CIcon icon={cilPlus} className="me-2" />
                  Add Sub Type
                </CButtonComponent>
              )}
            </CCardHeaderComponent>
            <CCardBodyComponent>
              {error && (
                <CAlertComponent color="danger" dismissible onClose={() => setError(null)}>
                  {error}
                </CAlertComponent>
              )}

              {/* Parent Type Selection */}
              <CRowComponent className="mb-4">
                <CColComponent md={6}>
                  <CFormLabelComponent htmlFor="parentType">Select Parent Space Type *</CFormLabelComponent>
                  <CFormSelectComponent
                    id="parentType"
                    value={selectedParentId || ''}
                    onChange={(e) => setSelectedParentId(e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <option value="">Choose a parent space type...</option>
                    {spaceTypes.map((spaceType) => (
                      <option key={spaceType.id} value={spaceType.id}>
                        {spaceType.name}
                      </option>
                    ))}
                  </CFormSelectComponent>
                </CColComponent>
              </CRowComponent>

              {selectedParentId && (
                <>
                  {subTypesLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                      <CSpinnerComponent size="lg" />
                    </div>
                  ) : (
                    <CTableComponent hover responsive>
                      <CTableHeadComponent>
                        <CTableRowComponent>
                          <CTableHeaderCellComponent>ID</CTableHeaderCellComponent>
                          <CTableHeaderCellComponent>Name</CTableHeaderCellComponent>
                          <CTableHeaderCellComponent>Description</CTableHeaderCellComponent>
                          <CTableHeaderCellComponent>Parent Type</CTableHeaderCellComponent>
                          <CTableHeaderCellComponent>Actions</CTableHeaderCellComponent>
                        </CTableRowComponent>
                      </CTableHeadComponent>
                      <CTableBodyComponent>
                        {subTypes.length === 0 ? (
                          <CTableRowComponent>
                            <CTableDataCellComponent colSpan={5} className="text-center">
                              No sub types found for the selected parent type
                            </CTableDataCellComponent>
                          </CTableRowComponent>
                        ) : (
                          subTypes.map((subType) => (
                            <CTableRowComponent key={subType.id}>
                              <CTableDataCellComponent>{subType.id}</CTableDataCellComponent>
                              <CTableDataCellComponent>
                                <strong>{subType.name}</strong>
                              </CTableDataCellComponent>
                              <CTableDataCellComponent>{subType.description}</CTableDataCellComponent>
                              <CTableDataCellComponent>
                                <CBadgeComponent color="info">
                                  {spaceTypes.find(st => st.id === subType.parentId)?.name || 'Unknown'}
                                </CBadgeComponent>
                              </CTableDataCellComponent>
                              <CTableDataCellComponent>
                                <div className="d-flex gap-2">
                                  {canEdit && (
                                    <CButtonComponent
                                      color="info"
                                      size="sm"
                                      onClick={() => handleEdit(subType)}
                                      className="d-flex align-items-center"
                                    >
                                      <CIcon icon={cilPencil} className="me-1" />
                                      Edit
                                    </CButtonComponent>
                                  )}
                                  {canDelete && (
                                    <CButtonComponent
                                      color="danger"
                                      size="sm"
                                      onClick={() => setDeleteConfirm(subType.id)}
                                      className="d-flex align-items-center"
                                    >
                                      <CIcon icon={cilTrash} className="me-1" />
                                      Delete
                                    </CButtonComponent>
                                  )}
                                </div>
                              </CTableDataCellComponent>
                            </CTableRowComponent>
                          ))
                        )}
                      </CTableBodyComponent>
                    </CTableComponent>
                  )}
                </>
              )}

              {!selectedParentId && (
                <div className="text-center text-muted py-5">
                  <h5>Please select a parent space type to view and manage sub types</h5>
                </div>
              )}
            </CCardBodyComponent>
          </CCardComponent>
        </CColComponent>
      </CRowComponent>

      {/* Add/Edit Modal */}
      <CModalComponent 
        visible={showModal} 
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        size="lg"
      >
        <CModalHeaderComponent closeButton>
          <CModalTitleComponent>
            {editingSubType ? 'Edit Sub Type' : 'Add New Sub Type'}
          </CModalTitleComponent>
        </CModalHeaderComponent>
        <CModalBodyComponent>
          <CFormComponent onSubmit={handleSubmit}>
            <CRowComponent>
              <CColComponent md={6}>
                <CFormLabelComponent htmlFor="name">Name *</CFormLabelComponent>
                <CFormInputComponent
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter sub type name"
                  required
                />
              </CColComponent>
              <CColComponent md={6}>
                <CFormLabelComponent htmlFor="parentId">Parent Space Type *</CFormLabelComponent>
                <CFormSelectComponent
                  id="parentId"
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: parseInt(e.target.value) })}
                  required
                >
                  <option value="">Choose a parent space type...</option>
                  {spaceTypes.map((spaceType) => (
                    <option key={spaceType.id} value={spaceType.id}>
                      {spaceType.name}
                    </option>
                  ))}
                </CFormSelectComponent>
              </CColComponent>
            </CRowComponent>
            <CRowComponent className="mt-3">
              <CColComponent>
                <CFormLabelComponent htmlFor="description">Description *</CFormLabelComponent>
                <CFormTextareaComponent
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter sub type description"
                  rows={3}
                  required
                />
              </CColComponent>
            </CRowComponent>
          </CFormComponent>
        </CModalBodyComponent>
        <CModalFooterComponent>
          <CButtonComponent 
            color="secondary" 
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
          >
            Cancel
          </CButtonComponent>
          <CButtonComponent 
            color="primary" 
            type="submit" 
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <CSpinnerComponent size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              editingSubType ? 'Update' : 'Create'
            )}
          </CButtonComponent>
        </CModalFooterComponent>
      </CModalComponent>

      {/* Delete Confirmation Modal */}
      <CModalComponent 
        visible={!!deleteConfirm} 
        onClose={() => setDeleteConfirm(null)}
        size="sm"
      >
        <CModalHeaderComponent closeButton>
          <CModalTitleComponent>Confirm Delete</CModalTitleComponent>
        </CModalHeaderComponent>
        <CModalBodyComponent>
          Are you sure you want to delete this sub type? This action cannot be undone.
        </CModalBodyComponent>
        <CModalFooterComponent>
          <CButtonComponent color="secondary" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </CButtonComponent>
          <CButtonComponent 
            color="danger" 
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
          >
            Delete
          </CButtonComponent>
        </CModalFooterComponent>
      </CModalComponent>
    </div>
  );
};

export default SubTypeList; 