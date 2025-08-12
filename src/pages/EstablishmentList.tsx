import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilPencil, cilTrash, cilBuilding, cilSearch } from '@coreui/icons';
import { establishmentService, EstablishmentType } from '../services/establishmentService';
import { useAuth } from '../contexts/AuthContext';
import CustomAlert from '../components/CustomAlert';

const EstablishmentList: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  
  const [establishmentTypes, setEstablishmentTypes] = useState<EstablishmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [establishmentTypeToDelete, setEstablishmentTypeToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchEstablishmentTypes();
  }, []);

  const fetchEstablishmentTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await establishmentService.getEstablishmentTypes();
      setEstablishmentTypes(data);
    } catch (err) {
      console.error('Error fetching establishment types:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch establishment types');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/establishment/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    setEstablishmentTypeToDelete(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!establishmentTypeToDelete) return;
    
    try {
      await establishmentService.deleteEstablishmentType(establishmentTypeToDelete);
      setEstablishmentTypes(establishmentTypes.filter(est => est.id !== establishmentTypeToDelete));
      setShowDeleteAlert(false);
      setEstablishmentTypeToDelete(null);
    } catch (err) {
      console.error('Error deleting establishment type:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete establishment type');
    }
  };

  const filteredEstablishmentTypes = establishmentTypes.filter(establishmentType =>
    establishmentType.establishment_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="establishment-list-container">
        <div className="page-header mb-4">
          <h1 className="page-title">
            <CIcon icon={cilBuilding} className="me-2" />
            Establishment Types
          </h1>
          <p className="page-subtitle">Loading establishment types...</p>
        </div>
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="establishment-list-container">
      {/* Page Header */}
      <div className="page-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="page-title">
              <CIcon icon={cilBuilding} className="me-2" />
              Establishment Types
            </h1>
            <p className="page-subtitle">Manage all establishment types</p>
          </div>
          {hasPermission('Property Management', 'create') && (
            <button
              className="btn btn-primary"
              onClick={() => navigate('/establishment/add')}
            >
              <CIcon icon={cilPlus} className="me-2" />
              Add Establishment Type
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <CIcon icon={cilSearch} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search establishment types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Establishment Types Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            All Establishment Types ({filteredEstablishmentTypes.length})
          </h5>
        </div>
        <div className="card-body">
          {filteredEstablishmentTypes.length === 0 ? (
            <div className="text-center py-4">
              <CIcon icon={cilBuilding} size="3xl" className="text-muted mb-3" />
              <h5 className="text-muted">No establishment types found</h5>
              <p className="text-muted">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first establishment type'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Establishment Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEstablishmentTypes.map((establishmentType) => (
                    <tr key={establishmentType.id}>
                      <td>
                        <span className="fw-semibold">#{establishmentType.id}</span>
                      </td>
                      <td>
                        <div className="fw-semibold">{establishmentType.establishment_type}</div>
                      </td>
                      <td>
                        <span className={`badge bg-${establishmentType.status === 1 ? 'success' : 'secondary'}`}>
                          {establishmentType.status === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          {hasPermission('Property Management', 'edit') && (
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(establishmentType.id)}
                              title="Edit"
                            >
                              <CIcon icon={cilPencil} />
                            </button>
                          )}
                          {hasPermission('Property Management', 'delete') && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(establishmentType.id)}
                              title="Delete"
                            >
                              <CIcon icon={cilTrash} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Alert */}
      <CustomAlert
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={confirmDelete}
        title="Delete Establishment Type"
        message="Are you sure you want to delete this establishment type? This action cannot be undone."
        type="warning"
        showConfirm={true}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default EstablishmentList; 