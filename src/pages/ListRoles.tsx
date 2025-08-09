import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CAlert, CSpinner, CBadge, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilPencil, cilTrash, cilReload } from '@coreui/icons';
import { apiService } from '../services/api';

// Type casting for CoreUI components
const CCardComponent = CCard as React.ComponentType<any>;
const CCardHeaderComponent = CCardHeader as React.ComponentType<any>;
const CCardBodyComponent = CCardBody as React.ComponentType<any>;
const CTableComponent = CTable as React.ComponentType<any>;
const CTableHeadComponent = CTableHead as React.ComponentType<any>;
const CTableRowComponent = CTableRow as React.ComponentType<any>;
const CTableHeaderCellComponent = CTableHeaderCell as React.ComponentType<any>;
const CTableBodyComponent = CTableBody as React.ComponentType<any>;
const CTableDataCellComponent = CTableDataCell as React.ComponentType<any>;
const CButtonComponent = CButton as React.ComponentType<any>;
const CAlertComponent = CAlert as React.ComponentType<any>;
const CSpinnerComponent = CSpinner as React.ComponentType<any>;
const CBadgeComponent = CBadge as React.ComponentType<any>;
const CModalComponent = CModal as React.ComponentType<any>;
const CModalHeaderComponent = CModalHeader as React.ComponentType<any>;
const CModalTitleComponent = CModalTitle as React.ComponentType<any>;
const CModalBodyComponent = CModalBody as React.ComponentType<any>;
const CModalFooterComponent = CModalFooter as React.ComponentType<any>;

interface Role {
  id: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

const ListRoles: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.authFetch('http://3.110.153.105:3000/api/v1/role/list', {
        method: 'GET'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch roles');
      }

      setRoles(data.data || data || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async () => {
    if (!selectedRole) return;

    setDeleting(true);
    try {
      const response = await apiService.authFetch(`http://3.110.153.105:3000/api/v1/role/delete/${selectedRole.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete role');
      }

      // Remove the deleted role from the list
      setRoles(prev => prev.filter(role => role.id !== selectedRole.id));
      setDeleteModalVisible(false);
      setSelectedRole(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the role');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (role: Role) => {
    setSelectedRole(role);
    setDeleteModalVisible(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinnerComponent size="lg" />
      </div>
    );
  }

  return (
    <div className="list-roles-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Role Management</h2>
        <CButtonComponent
          color="primary"
          onClick={() => navigate('/roles/add')}
          className="d-flex align-items-center"
        >
          <CIcon icon={cilPlus} className="me-2" />
          Add New Role
        </CButtonComponent>
      </div>

      {error && (
        <CAlertComponent color="danger" dismissible onClose={() => setError(null)}>
          {error}
        </CAlertComponent>
      )}

      <CCardComponent>
        <CCardHeaderComponent>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">All Roles</h4>
            <CButtonComponent
              color="secondary"
              variant="outline"
              onClick={fetchRoles}
              disabled={loading}
              className="d-flex align-items-center"
            >
              <CIcon icon={cilReload} className="me-2" />
              Refresh
            </CButtonComponent>
          </div>
        </CCardHeaderComponent>
        <CCardBodyComponent>
          {roles.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No roles found. Create your first role to get started.</p>
              <CButtonComponent
                color="primary"
                onClick={() => navigate('/roles/add')}
                className="d-flex align-items-center mx-auto"
              >
                <CIcon icon={cilPlus} className="me-2" />
                Add First Role
              </CButtonComponent>
            </div>
          ) : (
            <CTableComponent hover responsive>
              <CTableHeadComponent>
                <CTableRowComponent>
                  <CTableHeaderCellComponent>ID</CTableHeaderCellComponent>
                  <CTableHeaderCellComponent>Role Name</CTableHeaderCellComponent>
                  <CTableHeaderCellComponent>Description</CTableHeaderCellComponent>
                  <CTableHeaderCellComponent>Created</CTableHeaderCellComponent>
                  {/* <CTableHeaderCellComponent>Updated</CTableHeaderCellComponent> */}
                  <CTableHeaderCellComponent>Actions</CTableHeaderCellComponent>
                </CTableRowComponent>
              </CTableHeadComponent>
              <CTableBodyComponent>
                {roles.map((role) => (
                  <CTableRowComponent key={role.id}>
                    <CTableDataCellComponent>
                      <CBadgeComponent color="primary">{role.id}</CBadgeComponent>
                    </CTableDataCellComponent>
                    <CTableDataCellComponent>
                      <strong>{role.name}</strong>
                    </CTableDataCellComponent>
                    <CTableDataCellComponent>
                      {role.description}
                    </CTableDataCellComponent>
                    <CTableDataCellComponent>
                      {formatDate(role.created_at || '')}
                    </CTableDataCellComponent>
                    {/* <CTableDataCellComponent>
                      {formatDate(role.updated_at || '')}
                    </CTableDataCellComponent> */}
                    <CTableDataCellComponent>
                      <div className="d-flex gap-2">
                        <CButtonComponent
                          color="info"
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/roles/edit/${role.id}`)}
                          className="d-flex align-items-center"
                        >
                          <CIcon icon={cilPencil} className="me-1" />
                          Edit
                        </CButtonComponent>
                        <CButtonComponent
                          color="danger"
                          size="sm"
                          variant="outline"
                          onClick={() => openDeleteModal(role)}
                          className="d-flex align-items-center"
                        >
                          <CIcon icon={cilTrash} className="me-1" />
                          Delete
                        </CButtonComponent>
                      </div>
                    </CTableDataCellComponent>
                  </CTableRowComponent>
                ))}
              </CTableBodyComponent>
            </CTableComponent>
          )}
        </CCardBodyComponent>
      </CCardComponent>

      {/* Delete Confirmation Modal */}
      <CModalComponent
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        backdrop="static"
      >
        <CModalHeaderComponent>
          <CModalTitleComponent>Confirm Delete</CModalTitleComponent>
        </CModalHeaderComponent>
        <CModalBodyComponent>
          Are you sure you want to delete the role "<strong>{selectedRole?.name}</strong>"? 
          This action cannot be undone.
        </CModalBodyComponent>
        <CModalFooterComponent>
          <CButtonComponent
            color="secondary"
            onClick={() => setDeleteModalVisible(false)}
            disabled={deleting}
          >
            Cancel
          </CButtonComponent>
          <CButtonComponent
            color="danger"
            onClick={handleDelete}
            disabled={deleting}
            className="d-flex align-items-center"
          >
            {deleting ? (
              <>
                <CSpinnerComponent size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                <CIcon icon={cilTrash} className="me-2" />
                Delete Role
              </>
            )}
          </CButtonComponent>
        </CModalFooterComponent>
      </CModalComponent>
    </div>
  );
};

export default ListRoles; 