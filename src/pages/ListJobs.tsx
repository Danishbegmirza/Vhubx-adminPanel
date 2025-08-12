import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { cilBriefcase, cilSearch, cilX, cilPencil, cilTrash, cilLocationPin, cilTag, cilClock } from '@coreui/icons';
import { apiService } from '../services/api';
import { config } from '../config/env';

interface Job {
  id: number;
  title: string;
  category: string;
  job_type: string;
  description: string;
  location: string;
  status: number;
  statusText: string;
}

interface JobListResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: Job[];
  };
}

interface UpdateJobRequest {
  title: string;
  category: string;
  job_type: string;
  description: string;
  location: string;
  status: number;
}

const ListJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit] = useState(10);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editForm, setEditForm] = useState<UpdateJobRequest>({
    title: '',
    category: '',
    job_type: '',
    description: '',
    location: '',
    status: 1
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchJobs = async (page: number = 1, search: string = '') => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      // Add search parameter if provided
      if (search.trim()) {
        params.append('title', search.trim());
      }

      const response = await apiService.authFetch(`${config.API_BASE_URL}/job/list?${params}`, {
        method: 'GET'
      });

      const data: JobListResponse = await response.json();

      if (response.ok && data.status) {
        setJobs(data.data.data);
        setTotalJobs(data.data.total);
        setCurrentPage(data.data.page);
        setTotalPages(Math.ceil(data.data.total / limit));
      } else {
        throw new Error(data.message || 'Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchJobs(1, searchTerm);
  };

  const handleReset = () => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchJobs(1, '');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchJobs(page, searchTerm);
  };

  // Edit job functions
  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setEditForm({
      title: job.title,
      category: job.category,
      job_type: job.job_type,
      description: job.description,
      location: job.location,
      status: job.status
    });
    setShowEditModal(true);
  };

  const handleUpdateJob = async () => {
    if (!selectedJob) return;

    setUpdateLoading(true);
    setError(null);

    try {
      const response = await apiService.authFetch(`${config.API_BASE_URL}/job/update/${selectedJob.id}`, {
        method: 'PUT',
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (response.ok && data.status) {
        // Refresh the jobs list
        await fetchJobs(currentPage, searchTerm);
        setShowEditModal(false);
        setSelectedJob(null);
        setEditForm({
          title: '',
          category: '',
          job_type: '',
          description: '',
          location: '',
          status: 1
        });
      } else {
        throw new Error(data.message || 'Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while updating the job');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Delete job functions
  const handleDeleteJob = (job: Job) => {
    setSelectedJob(job);
    setShowDeleteModal(true);
  };

  const confirmDeleteJob = async () => {
    if (!selectedJob) return;

    setDeleteLoading(true);
    setError(null);

    try {
      const response = await apiService.authFetch(`${config.API_BASE_URL}/job/delete/${selectedJob.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok && data.status) {
        // Refresh the jobs list
        await fetchJobs(currentPage, searchTerm);
        setShowDeleteModal(false);
        setSelectedJob(null);
      } else {
        throw new Error(data.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while deleting the job');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusBadge = (status: number, statusText: string) => {
    const statusClass = status === 1 ? 'success' : 'secondary';
    return (
      <span className={`badge bg-${statusClass}`}>
        {statusText}
      </span>
    );
  };

  const truncateDescription = (description: string, maxLength: number = 100) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  return (
    <div className="list-jobs-container">
      {/* Page Header */}
      <div className="page-header mb-4">
        <h1 className="page-title">
          <CIcon icon={cilBriefcase} className="me-2" />
          Job Listings
        </h1>
        <p className="page-subtitle">Manage and view all job postings</p>
      </div>

      {/* Search Section */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-end">
            <div className="col-md-6 mb-3">
              <label htmlFor="searchInput" className="form-label">Search Jobs</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="searchInput"
                  placeholder="Search by job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  <CIcon icon={cilSearch} className="me-1" />
                  Search
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                >
                  <CIcon icon={cilX} className="me-1" />
                  Reset
                </button>
              </div>
            </div>
            <div className="col-md-6 mb-3 text-md-end">
              <div className="d-flex justify-content-md-end gap-2">
                <button className="btn btn-success">
                  <CIcon icon={cilPencil} className="me-1" />
                  Add New Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Jobs List */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <CIcon icon={cilBriefcase} className="me-2" />
            Jobs ({totalJobs} total)
          </h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-4">
              <CIcon icon={cilBriefcase} size="3xl" className="text-muted mb-3" />
              <h5>No jobs found</h5>
              <p className="text-muted">
                {searchTerm ? 'Try adjusting your search criteria.' : 'No jobs have been posted yet.'}
              </p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id}>
                        <td>
                          <div>
                            <strong>{job.title}</strong>
                            <div className="text-muted small mt-1">
                              {truncateDescription(job.description)}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-info">
                            <CIcon icon={cilTag} className="me-1" />
                            {job.category}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-warning">
                            <CIcon icon={cilClock} className="me-1" />
                            {job.job_type}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <CIcon icon={cilLocationPin} className="me-1 text-muted" />
                            {job.location}
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(job.status, job.statusText)}
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-sm btn-outline-warning" 
                              title="Edit Job"
                              onClick={() => handleEditJob(job)}
                            >
                              <CIcon icon={cilPencil} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              title="Delete Job"
                              onClick={() => handleDeleteJob(job)}
                            >
                              <CIcon icon={cilTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Jobs pagination" className="mt-4">
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

              {/* Page Info */}
              <div className="text-center text-muted mt-3">
                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalJobs)} of {totalJobs} jobs
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Job Modal */}
      {showEditModal && selectedJob && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <CIcon icon={cilPencil} className="me-2" />
                  Edit Job: {selectedJob.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editTitle" className="form-label">Job Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="editTitle"
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editCategory" className="form-label">Category *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="editCategory"
                        value={editForm.category}
                        onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editJobType" className="form-label">Job Type *</label>
                      <select
                        className="form-select"
                        id="editJobType"
                        value={editForm.job_type}
                        onChange={(e) => setEditForm({...editForm, job_type: e.target.value})}
                        required
                      >
                        <option value="">Select job type</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editLocation" className="form-label">Location *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="editLocation"
                        value={editForm.location}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editDescription" className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      id="editDescription"
                      rows={4}
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editStatus" className="form-label">Status *</label>
                    <select
                      className="form-select"
                      id="editStatus"
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: parseInt(e.target.value)})}
                      required
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateJob}
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilPencil} className="me-1" />
                      Update Job
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedJob && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">
                  <CIcon icon={cilTrash} className="me-2" />
                  Delete Job
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the job "<strong>{selectedJob.title}</strong>"?</p>
                <p className="text-muted mb-0">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDeleteJob}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilTrash} className="me-1" />
                      Delete Job
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {(showEditModal || showDeleteModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default ListJobs; 