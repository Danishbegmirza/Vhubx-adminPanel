import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CAlert, CSpinner, CFormSwitch } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilReload, cilList, cilTrash, cilPencil, cilPlus } from '@coreui/icons';
import { apiService } from '../services/api';
import { config } from '../config/env';

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
const CFormSwitchComponent = CFormSwitch as React.ComponentType<any>;

interface PermissionRecord {
  [key: string]: any;
}

const RolePermissionList: React.FC = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<PermissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const operationNames = ['view', 'edit', 'create', 'delete', 'export'] as const;
  type OperationName = typeof operationNames[number];
  type RowToggleState = Record<OperationName, boolean>;
  const [toggleState, setToggleState] = useState<Record<string, RowToggleState>>({});

  const defaultRowState: RowToggleState = {
    view: true,
    edit: true,
    create: false,
    delete: false,
    export: false,
  };

  const getRowKey = (rec: PermissionRecord, fallbackIndex?: number) => {
    if (rec.id !== undefined) return String(rec.id);
    if (rec.permission_id !== undefined) return String(rec.permission_id);
    const rid = rec.role_id ?? rec.role?.id ?? rec.roleId ?? 'unknownRole';
    const mod = rec.module ?? rec.module_name ?? rec.moduleName ?? rec.module?.name ?? 'unknownModule';
    const pname = rec.permission_name ?? rec.name ?? rec.permissionName ?? 'perm';
    return `${rid}:${mod}:${pname}:${fallbackIndex ?? ''}`;
  };

  const getEditId = (rec: PermissionRecord, fallbackIndex?: number): string => {
    return String(rec.id ?? rec.permission_id ?? getRowKey(rec, fallbackIndex));
  };

  const deriveRoleId = (rec: PermissionRecord): string | number => {
    return (
      rec.role_id ?? rec.roleId ?? rec.id ?? rec.role?.id ?? '-'
    );
  };

  const deriveRoleName = (rec: PermissionRecord): string => {
    return (
      rec.role_name ?? rec.roleName ?? rec.name ?? rec.role?.name ?? '-'
    );
  };

  const deriveModuleName = (rec: PermissionRecord): string => {
    return (
      rec.module ?? rec.module_name ?? rec.moduleName ?? rec.module?.name ?? '-'
    );
  };

  const toBool = (val: any): boolean => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val === 1;
    if (typeof val === 'string') return ['1', 'true', 'enabled', 'active', 'allow', 'yes'].includes(val.toLowerCase());
    return false;
  };

  const getPossibleOpSources = (rec: PermissionRecord, op: OperationName): any[] => [
    rec[op],
    rec[`can_${op}`],
    rec[`is_${op}`],
    rec[`${op}_allowed`],
    rec.permissions?.[op],
    rec.permission?.[op],
    rec.operations?.[op],
    rec.module_permission?.[op],
    rec[`${op}_permission`],
  ];

  const hasOpFlag = (rec: PermissionRecord, op: OperationName): boolean => {
    return getPossibleOpSources(rec, op).some((v) => v !== undefined && v !== null);
  };

  const getOpFlag = (rec: PermissionRecord, op: OperationName): boolean => {
    const sources = getPossibleOpSources(rec, op);
    for (const v of sources) {
      if (v !== undefined && v !== null) return toBool(v);
    }
    return false;
  };

  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const response = await apiService.authFetch(`${config.API_BASE_URL}/role/permissions/list`, {
        method: 'GET'
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to fetch role permissions');
      }

      const list = (data?.data && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])) as PermissionRecord[];
      setPermissions(list);

      // Initialize toggle state based on incoming records
      const initial: Record<string, RowToggleState> = {};
      list.forEach((rec, idx) => {
        const key = getRowKey(rec, idx);
        const base = { ...defaultRowState };
        const row: RowToggleState = {
          view: hasOpFlag(rec, 'view') ? getOpFlag(rec, 'view') : base.view,
          edit: hasOpFlag(rec, 'edit') ? getOpFlag(rec, 'edit') : base.edit,
          create: hasOpFlag(rec, 'create') ? getOpFlag(rec, 'create') : base.create,
          delete: hasOpFlag(rec, 'delete') ? getOpFlag(rec, 'delete') : base.delete,
          export: hasOpFlag(rec, 'export') ? getOpFlag(rec, 'export') : base.export,
        };
        initial[key] = row;
      });
      setToggleState(initial);
    } catch (err: any) {
      setError(err?.message || 'An error occurred while fetching role permissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleToggle = async (rec: PermissionRecord, idx: number, op: OperationName) => {
    const key = getRowKey(rec, idx);
    const prevRow = toggleState[key] ?? { ...defaultRowState };
    const nextRow = { ...prevRow, [op]: !prevRow[op] } as RowToggleState;
    setToggleState((prev) => ({ ...prev, [key]: nextRow }));

    // Placeholder: wire to API here when endpoint is available
    // Suggested: POST/PUT to update role-permission mapping per operation
    try {
      // const token = localStorage.getItem('adminToken');
      // await fetch('.../role/permissions/update', { method: 'PUT', headers: {...}, body: JSON.stringify({ roleId, module, operation: op, value: nextRow[op] }) })
      setInfo(`'${op}' toggled locally. Connect API to persist changes.`);
    } catch (e: any) {
      // revert
      const revertRow = { ...prevRow } as RowToggleState;
      setToggleState((prev) => ({ ...prev, [key]: revertRow }));
      setError(e?.message || `Failed to toggle ${op}`);
    }
  };

  const handleUpdate = async (rec: PermissionRecord, idx: number) => {
    try {
      setInfo('Update action clicked. Implement API call to update this mapping.');
    } catch (e: any) {
      setError(e?.message || 'Failed to update');
    }
  };

  const handleDelete = async (rec: PermissionRecord, idx: number) => {
    try {
      setInfo('Delete action clicked. Implement API call to delete this mapping.');
    } catch (e: any) {
      setError(e?.message || 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinnerComponent size="lg" />
      </div>
    );
  }

  return (
    <div className="role-permission-list-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 d-flex align-items-center">
          <CIcon icon={cilList} className="me-2" />
          Role Permissions
        </h2>
        <div className="d-flex gap-2">
          <CButtonComponent
            color="primary"
            onClick={() => navigate('/roles/permissions/add')}
            className="d-flex align-items-center"
          >
            <CIcon icon={cilPlus} className="me-2" />
            Add Role Permission
          </CButtonComponent>
          <CButtonComponent
            color="secondary"
            variant="outline"
            onClick={fetchPermissions}
            disabled={loading}
            className="d-flex align-items-center"
          >
            <CIcon icon={cilReload} className="me-2" />
            Refresh
          </CButtonComponent>
        </div>
      </div>

      {error && (
        <CAlertComponent color="danger" dismissible onClose={() => setError(null)}>
          {error}
        </CAlertComponent>
      )}

      {info && (
        <CAlertComponent color="info" dismissible onClose={() => setInfo(null)}>
          {info}
        </CAlertComponent>
      )}

      <CCardComponent>
        <CCardHeaderComponent>
          <h4 className="mb-0">Role Permission List</h4>
        </CCardHeaderComponent>
        <CCardBodyComponent>
          {permissions.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-0">No role permissions found.</p>
            </div>
          ) : (
            <CTableComponent hover responsive>
              <CTableHeadComponent>
                <CTableRowComponent>
                  <CTableHeaderCellComponent>Role ID</CTableHeaderCellComponent>
                  <CTableHeaderCellComponent>Role Name</CTableHeaderCellComponent>
                  <CTableHeaderCellComponent>Module</CTableHeaderCellComponent>
                  <CTableHeaderCellComponent>View</CTableHeaderCellComponent>
                  <CTableHeaderCellComponent>Edit</CTableHeaderCellComponent>
                  <CTableHeaderCellComponent>Create</CTableHeaderCellComponent>
                  <CTableHeaderCellComponent>Delete</CTableHeaderCellComponent>
                  <CTableHeaderCellComponent>Export</CTableHeaderCellComponent>
                  <CTableHeaderCellComponent>Actions</CTableHeaderCellComponent>
                </CTableRowComponent>
              </CTableHeadComponent>
              <CTableBodyComponent>
                {permissions.map((perm, idx) => {
                  const roleId = deriveRoleId(perm);
                  const roleName = deriveRoleName(perm);
                  const moduleName = deriveModuleName(perm);
                  const key = getRowKey(perm, idx);
                  const rowState = toggleState[key] ?? { ...defaultRowState };

                  return (
                    <CTableRowComponent key={key}>
                      <CTableDataCellComponent>{roleId}</CTableDataCellComponent>
                      <CTableDataCellComponent>{roleName}</CTableDataCellComponent>
                      <CTableDataCellComponent>{moduleName}</CTableDataCellComponent>
                      <CTableDataCellComponent>
                        <CFormSwitchComponent
                          id={`view-toggle-${key}`}
                          checked={!!rowState.view}
                          onChange={() => handleToggle(perm, idx, 'view')}
                          size="lg"
                        />
                      </CTableDataCellComponent>
                      <CTableDataCellComponent>
                        <CFormSwitchComponent
                          id={`edit-toggle-${key}`}
                          checked={!!rowState.edit}
                          onChange={() => handleToggle(perm, idx, 'edit')}
                          size="lg"
                        />
                      </CTableDataCellComponent>
                      <CTableDataCellComponent>
                        <CFormSwitchComponent
                          id={`create-toggle-${key}`}
                          checked={!!rowState.create}
                          onChange={() => handleToggle(perm, idx, 'create')}
                          size="lg"
                        />
                      </CTableDataCellComponent>
                      <CTableDataCellComponent>
                        <CFormSwitchComponent
                          id={`delete-toggle-${key}`}
                          checked={!!rowState.delete}
                          onChange={() => handleToggle(perm, idx, 'delete')}
                          size="lg"
                        />
                      </CTableDataCellComponent>
                      <CTableDataCellComponent>
                        <CFormSwitchComponent
                          id={`export-toggle-${key}`}
                          checked={!!rowState.export}
                          onChange={() => handleToggle(perm, idx, 'export')}
                          size="lg"
                        />
                      </CTableDataCellComponent>
                      <CTableDataCellComponent>
                        <div className="d-flex gap-2">
                          <CButtonComponent
                            color="info"
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/roles/permissions/edit/${getEditId(perm, idx)}`)}
                            className="d-flex align-items-center"
                          >
                            <CIcon icon={cilPencil} className="me-1" />
                            Update
                          </CButtonComponent>
                          {/* <CButtonComponent
                            color="danger"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(perm, idx)}
                            className="d-flex align-items-center"
                          >
                            <CIcon icon={cilTrash} className="me-1" />
                            Delete
                          </CButtonComponent> */}
                        </div>
                      </CTableDataCellComponent>
                    </CTableRowComponent>
                  );
                })}
              </CTableBodyComponent>
            </CTableComponent>
          )}
        </CCardBodyComponent>
      </CCardComponent>
    </div>
  );
};

export default RolePermissionList; 