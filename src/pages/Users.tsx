import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilPlus, cilArrowBottom, cilFilter, cilYen, cilPencil, cilTrash } from '@coreui/icons';

const Users = () => {
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Partner',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike@example.com',
      role: 'User',
      status: 'Inactive'
    }
  ];

  return (
    <div className="user-management-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage users, roles, and access permissions</p>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons d-flex gap-3">
        <button className="btn btn-primary d-flex align-items-center gap-2">
          <CIcon icon={cilPlus} />
          Add User
        </button>
        <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
          <CIcon icon={cilArrowBottom} />
          Export
        </button>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-container">
        <div className="search-box">
          <CIcon icon={cilSearch} className="search-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
          />
        </div>
        <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
          <CIcon icon={cilFilter} />
          Filters
        </button>
      </div>

      {/* Users Table */}
      <div className="user-table">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="avatar-circle me-3" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="fw-medium">{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className="badge bg-light text-dark">{user.role}</span>
                </td>
                <td>
                  <span className={`status-badge ${user.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons-table">
                    <button className="action-btn action-btn-view" title="View">
                      <CIcon icon={cilYen} size="sm" />
                    </button>
                    <button className="action-btn action-btn-edit" title="Edit">
                      <CIcon icon={cilPencil} size="sm" />
                    </button>
                    <button className="action-btn action-btn-delete" title="Delete">
                      <CIcon icon={cilTrash} size="sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div className="text-muted">
          Showing 1 to 3 of 3 results
        </div>
        <nav>
          <ul className="pagination pagination-sm mb-0">
            <li className="page-item disabled">
              <span className="page-link">Previous</span>
            </li>
            <li className="page-item active">
              <span className="page-link">1</span>
            </li>
            <li className="page-item disabled">
              <span className="page-link">Next</span>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Users; 