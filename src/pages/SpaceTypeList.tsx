import React, { useState, useEffect } from 'react';
import { 
  CCard, CCardBody, CCardHeader, CCol, CRow, CButton, 
  CTable, CTableHead, CTableRow, CTableHeaderCell, 
  CTableBody, CTableDataCell, CModal, CModalHeader, 
  CModalTitle, CModalBody, CModalFooter, CForm, 
  CFormLabel, CFormInput, CFormTextarea, CAlert,
  CSpinner, CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilPencil, cilTrash } from '@coreui/icons';
import { spaceTypeService, SpaceType, CreateSpaceTypeRequest, UpdateSpaceTypeRequest } from '../services/spaceTypeService';
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
const CAlertComponent = CAlert as React.ComponentType<any>;
const CSpinnerComponent = CSpinner as React.ComponentType<any>;
const CBadgeComponent = CBadge as React.ComponentType<any>;

const SpaceTypeList: React.FC = () => {
  const [spaceTypes, setSpaceTypes] = useState<SpaceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSpaceType, setEditingSpaceType] = useState<SpaceType | null>(null);
  const [formData, setFormData] = useState<CreateSpaceTypeRequest>({
    name: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const { permissions } = useAuth();

  useEffect(() => {
    fetchSpaceTypes();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Name and description are required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (editingSpaceType) {
        await spaceTypeService.updateSpaceType(editingSpaceType.id, formData as UpdateSpaceTypeRequest);
      } else {
        await spaceTypeService.createSpaceType(formData);
      }

      setShowModal(false);
      setEditingSpaceType(null);
      setFormData({ name: '', description: '' });
      fetchSpaceTypes();
    } catch (err) {
      setError('Failed to save space type');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (spaceType: SpaceType) => {
    setEditingSpaceType(spaceType);
    setFormData({
      name: spaceType.name,
      description: spaceType.description
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await spaceTypeService.deleteSpaceType(id);
      setDeleteConfirm(null);
      fetchSpaceTypes();
    } catch (err) {
      setError('Failed to delete space type');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingSpaceType(null);
    setError(null);
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
              <h4 className="mb-0">Space Types</h4>
              {canCreate && (
                <CButtonComponent 
                  color="primary" 
                  onClick={() => setShowModal(true)}
                  className="d-flex align-items-center"
                >
                  <CIcon icon={cilPlus} className="me-2" />
                  Add Space Type
                </CButtonComponent>
              )}
            </CCardHeaderComponent>
            <CCardBodyComponent>
              {error && (
                <CAlertComponent color="danger" dismissible onClose={() => setError(null)}>
                  {error}
                </CAlertComponent>
              )}

              <CTableComponent hover responsive>
                <CTableHeadComponent>
                  <CTableRowComponent>
                    <CTableHeaderCellComponent>ID</CTableHeaderCellComponent>
                    <CTableHeaderCellComponent>Name</CTableHeaderCellComponent>
                    <CTableHeaderCellComponent>Description</CTableHeaderCellComponent>
                    <CTableHeaderCellComponent>Actions</CTableHeaderCellComponent>
                  </CTableRowComponent>
                </CTableHeadComponent>
                <CTableBodyComponent>
                  {spaceTypes.length === 0 ? (
                    <CTableRowComponent>
                      <CTableDataCellComponent colSpan={4} className="text-center">
                        No space types found
                      </CTableDataCellComponent>
                    </CTableRowComponent>
                  ) : (
                    spaceTypes.map((spaceType) => (
                      <CTableRowComponent key={spaceType.id}>
                        <CTableDataCellComponent>{spaceType.id}</CTableDataCellComponent>
                        <CTableDataCellComponent>
                          <strong>{spaceType.name}</strong>
                        </CTableDataCellComponent>
                        <CTableDataCellComponent>{spaceType.description}</CTableDataCellComponent>
                        <CTableDataCellComponent>
                          <div className="d-flex gap-2">
                            {canEdit && (
                              <CButtonComponent
                                color="info"
                                size="sm"
                                onClick={() => handleEdit(spaceType)}
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
                                onClick={() => setDeleteConfirm(spaceType.id)}
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
            {editingSpaceType ? 'Edit Space Type' : 'Add New Space Type'}
          </CModalTitleComponent>
        </CModalHeaderComponent>
        <CModalBodyComponent>
          <CFormComponent onSubmit={handleSubmit}>
            <CRowComponent>
              <CColComponent md={12}>
                <CFormLabelComponent htmlFor="name">Name *</CFormLabelComponent>
                <CFormInputComponent
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter space type name"
                  required
                />
              </CColComponent>
            </CRowComponent>
            <CRowComponent className="mt-3">
              <CColComponent>
                <CFormLabelComponent htmlFor="description">Description *</CFormLabelComponent>
                <CFormTextareaComponent
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter space type description"
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
              editingSpaceType ? 'Update' : 'Create'
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
          Are you sure you want to delete this space type? This action cannot be undone.
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

export default SpaceTypeList; 