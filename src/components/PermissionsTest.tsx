import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { permissionsService } from '../services/permissionsService';

const PermissionsTest: React.FC = () => {
  const { permissions, userType, hasPermission } = useAuth();

  const navigationItems = permissionsService.getNavigationItems(permissions);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>User Information</h5>
            </div>
            <div className="card-body">
              <p><strong>User Type:</strong> {userType}</p>
              <p><strong>Permissions Count:</strong> {permissions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Available Navigation Items</h5>
            </div>
            <div className="card-body">
              <ul className="list-group">
                {navigationItems.map((item, index) => (
                  <li key={index} className="list-group-item">
                    <strong>{item.title}</strong> - {item.path}
                    {item.children && (
                      <ul className="mt-2">
                        {item.children.map((child, childIndex) => (
                          <li key={childIndex} className="small">
                            {child.title} - {child.path}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Permission Details</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Module</th>
                      <th>View</th>
                      <th>Create</th>
                      <th>Edit</th>
                      <th>Delete</th>
                      <th>Export</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((permission, index) => (
                      <tr key={index}>
                        <td>{permission.module_name}</td>
                        <td>
                          <span className={`badge ${permission.permissions.view ? 'bg-success' : 'bg-danger'}`}>
                            {permission.permissions.view ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${permission.permissions.create ? 'bg-success' : 'bg-danger'}`}>
                            {permission.permissions.create ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${permission.permissions.edit ? 'bg-success' : 'bg-danger'}`}>
                            {permission.permissions.edit ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${permission.permissions.delete ? 'bg-success' : 'bg-danger'}`}>
                            {permission.permissions.delete ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${permission.permissions.export ? 'bg-success' : 'bg-danger'}`}>
                            {permission.permissions.export ? 'Yes' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Permission Tests</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <h6>User Management</h6>
                  <p>View: {hasPermission('User Management', 'view') ? 'Yes' : 'No'}</p>
                  <p>Create: {hasPermission('User Management', 'create') ? 'Yes' : 'No'}</p>
                  <p>Edit: {hasPermission('User Management', 'edit') ? 'Yes' : 'No'}</p>
                </div>
                <div className="col-md-4">
                  <h6>Property Management</h6>
                  <p>View: {hasPermission('Property Management', 'view') ? 'Yes' : 'No'}</p>
                  <p>Create: {hasPermission('Property Management', 'create') ? 'Yes' : 'No'}</p>
                  <p>Edit: {hasPermission('Property Management', 'edit') ? 'Yes' : 'No'}</p>
                </div>
                <div className="col-md-4">
                  <h6>Payments</h6>
                  <p>View: {hasPermission('Payments', 'view') ? 'Yes' : 'No'}</p>
                  <p>Create: {hasPermission('Payments', 'create') ? 'Yes' : 'No'}</p>
                  <p>Edit: {hasPermission('Payments', 'edit') ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsTest; 