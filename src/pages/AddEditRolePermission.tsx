import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CCard, CCardHeader, CCardBody, CForm, CFormLabel, CFormInput, CFormSelect, CFormSwitch, CButton, CAlert, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilArrowLeft } from '@coreui/icons';
import { apiService } from '../services/api';
import { config } from '../config/env';

const CCardComponent = CCard as React.ComponentType<any>;
const CCardHeaderComponent = CCardHeader as React.ComponentType<any>;
const CCardBodyComponent = CCardBody as React.ComponentType<any>;
const CFormComponent = CForm as React.ComponentType<any>;
const CFormLabelComponent = CFormLabel as React.ComponentType<any>;
const CFormInputComponent = CFormInput as React.ComponentType<any>;
const CFormSelectComponent = CFormSelect as React.ComponentType<any>;
const CFormSwitchComponent = CFormSwitch as React.ComponentType<any>;
const CButtonComponent = CButton as React.ComponentType<any>;
const CAlertComponent = CAlert as React.ComponentType<any>;
const CSpinnerComponent = CSpinner as React.ComponentType<any>;

interface Role { id: number; name: string; }

type OperationName = 'view' | 'edit' | 'create' | 'delete' | 'export';

interface RowPermissions {
  view: boolean; edit: boolean; create: boolean; delete: boolean; export: boolean;
}

const defaultPermissions: RowPermissions = {
  view: true,
  edit: true,
  create: false,
  delete: false,
  export: false,
};

const AddEditRolePermission: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState<boolean>(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [roleId, setRoleId] = useState<number | ''>('');
  const [moduleName, setModuleName] = useState<string>('');
  const [permissions, setPermissions] = useState<RowPermissions>({ ...defaultPermissions });
  const [initialPermissions, setInitialPermissions] = useState<RowPermissions | null>(null);

  const apiBase = config.API_BASE_URL;

  const fetchRoles = async () => {
    try {
      const res = await apiService.authFetch(`${apiBase}/role/list`, {
        method: 'GET'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch roles');
      const list: Role[] = (data?.data || data || []).map((r: any) => ({ id: r.id, name: r.name }));
      setRoles(list);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch roles');
    }
  };

  const toBool = (val: any): boolean => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val === 1;
    if (typeof val === 'string') return ['1', 'true', 'enabled', 'active', 'allow', 'yes'].includes(val.toLowerCase());
    return false;
  };

  const getOpFlag = (rec: any, op: OperationName): boolean => {
    const v = rec?.permissions?.[op] ?? rec?.[op] ?? rec?.[`can_${op}`] ?? rec?.[`is_${op}`] ?? rec?.[`${op}_allowed`];
    if (v !== undefined && v !== null) return toBool(v);
    return defaultPermissions[op];
  };

  const fetchExisting = async () => {
    if (!isEditMode) return;
    setFetching(true);
    setError(null);
    try {
      const res = await apiService.authFetch(`${apiBase}/role/permissions/list`, {
        method: 'GET'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch role permissions');

      const list: any[] = (data?.data && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
      const rec = list.find((r) => String(r.id ?? r.permission_id) === String(id));
      if (!rec) throw new Error('Permission record not found');

      const rid = rec.role_id ?? rec.roleId ?? rec.role?.id;
      const mod = rec.module ?? rec.module_name ?? rec.moduleName ?? rec.module?.name;
      setRoleId(rid ?? '');
      setModuleName(mod ?? '');
      const perms: RowPermissions = {
        view: getOpFlag(rec, 'view'),
        edit: getOpFlag(rec, 'edit'),
        create: getOpFlag(rec, 'create'),
        delete: getOpFlag(rec, 'delete'),
        export: getOpFlag(rec, 'export'),
      };
      setPermissions(perms);
      setInitialPermissions(perms);
    } catch (e: any) {
      setError(e?.message || 'Failed to load existing record');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      fetchExisting();
    }
  }, [isEditMode, id]);

  const handlePermissionChange = (op: OperationName) => {
    setPermissions((prev) => ({ ...prev, [op]: !prev[op] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isEditMode) {
        // Build partial diff like example
        const diff: Partial<RowPermissions> = {};
        const base = initialPermissions ?? defaultPermissions;
        (['view','edit','create','delete','export'] as OperationName[]).forEach((op) => {
          if (permissions[op] !== base[op]) {
            diff[op] = permissions[op];
          }
        });
        const body = { permissions: diff };

        const res = await apiService.authFetch(`${apiBase}/role/permissions/update/${id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Failed to update role permission');
        setSuccess('Role permission updated successfully');
      } else {
        if (!roleId || !moduleName) throw new Error('Role and Module are required');
        const body = {
          role_id: typeof roleId === 'string' ? parseInt(roleId, 10) : roleId,
          module_name: moduleName,
          permissions: { ...permissions },
        };
        const res = await apiService.authFetch(`${apiBase}/role/permissions/add`, {
          method: 'POST',
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Failed to add role permission');
        setSuccess('Role permission added successfully');
        // Reset form
        setRoleId('');
        setModuleName('');
        setPermissions({ ...defaultPermissions });
      }

      // Navigate back after a short delay
      setTimeout(() => navigate('/roles/permissions/list'), 1200);
    } catch (e: any) {
      setError(e?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-edit-role-permission-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">{isEditMode ? 'Edit' : 'Add'} Role Permission</h2>
        <CButtonComponent
          color="secondary"
          variant="outline"
          onClick={() => navigate('/roles/permissions/list')}
          className="d-flex align-items-center"
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Back to Role Permissions
        </CButtonComponent>
      </div>

      <CCardComponent>
        <CCardHeaderComponent>
          <h4 className="mb-0">{isEditMode ? 'Update Mapping' : 'Create Mapping'}</h4>
          <p className="text-muted mb-0">Map a role and module to operation permissions</p>
        </CCardHeaderComponent>
        <CCardBodyComponent>
          {error && (
            <CAlertComponent color="danger" dismissible onClose={() => setError(null)}>
              {error}
            </CAlertComponent>
          )}
          {success && (
            <CAlertComponent color="success" dismissible onClose={() => setSuccess(null)}>
              {success}
            </CAlertComponent>
          )}

          {fetching ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <CSpinnerComponent size="lg" />
            </div>
          ) : (
            <CFormComponent onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <CFormLabelComponent htmlFor="role">Role</CFormLabelComponent>
                  <CFormSelectComponent
                    id="role"
                    value={roleId}
                    onChange={(e: any) => setRoleId(e.target.value ? parseInt(e.target.value, 10) : '')}
                    disabled={loading || isEditMode}
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name} (ID: {r.id})</option>
                    ))}
                  </CFormSelectComponent>
                </div>
                <div className="col-md-4 mb-3">
                  <CFormLabelComponent htmlFor="module">Module Name</CFormLabelComponent>
                  <CFormInputComponent
                    id="module"
                    type="text"
                    value={moduleName}
                    onChange={(e: any) => setModuleName(e.target.value)}
                    placeholder="e.g., property"
                    disabled={loading || isEditMode}
                    required
                  />
                </div>
              </div>

              <div className="row g-3">
                {(['view','edit','create','delete','export'] as OperationName[]).map((op) => (
                  <div className="col-md-2" key={op}>
                    <CFormLabelComponent className="text-capitalize">{op}</CFormLabelComponent>
                    <div>
                      <CFormSwitchComponent
                        id={`perm-${op}`}
                        checked={permissions[op]}
                        onChange={() => handlePermissionChange(op)}
                        size="lg"
                        disabled={loading}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <CButtonComponent
                  color="secondary"
                  variant="outline"
                  onClick={() => navigate('/roles/permissions/list')}
                  disabled={loading}
                >
                  Cancel
                </CButtonComponent>
                <CButtonComponent
                  type="submit"
                  color="primary"
                  disabled={loading || (!isEditMode && (!roleId || !moduleName))}
                  className="d-flex align-items-center"
                >
                  {loading ? (
                    <>
                      <CSpinnerComponent size="sm" className="me-2" />
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilSave} className="me-2" />
                      {isEditMode ? 'Update' : 'Create'}
                    </>
                  )}
                </CButtonComponent>
              </div>
            </CFormComponent>
          )}
        </CCardBodyComponent>
      </CCardComponent>
    </div>
  );
};

export default AddEditRolePermission;
