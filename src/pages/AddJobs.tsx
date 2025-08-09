import React, { useState } from 'react';
import CIcon from '@coreui/icons-react';
import { cilBriefcase, cilPlus, cilSave, cilX } from '@coreui/icons';
import { apiService } from '../services/api';

interface JobFormData {
  title: string;
  category: string;
  job_type: string;
  description: string;
  location: string;
}

const AddJobs: React.FC = () => {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    category: '',
    job_type: '',
    description: '',
    location: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const jobCategories = [
    'Marketing',
    'Sales',
    'Engineering',
    'Design',
    'Product',
    'Operations',
    'Finance',
    'Human Resources',
    'Customer Service',
    'Administration',
    'Other'
  ];

  const jobTypes = [
    'Full-Time',
    'Part-Time',
    'Contract',
    'Internship',
    'Freelance',
    'Temporary'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await apiService.authFetch('http://3.110.153.105:3000/api/v1/job/add', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Job added successfully!' });
        // Reset form
        setFormData({
          title: '',
          category: '',
          job_type: '',
          description: '',
          location: ''
        });
      } else {
        throw new Error(data.message || 'Failed to add job');
      }
    } catch (error) {
      console.error('Error adding job:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An error occurred while adding the job' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      category: '',
      job_type: '',
      description: '',
      location: ''
    });
    setMessage(null);
  };

  return (
    <div className="add-jobs-container">
      {/* Page Header */}
      <div className="page-header mb-4">
        <h1 className="page-title">
          <CIcon icon={cilBriefcase} className="me-2" />
          Add New Job
        </h1>
        <p className="page-subtitle">Create a new job posting for your organization</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show mb-4`} role="alert">
          {message.text}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Job Form */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <CIcon icon={cilPlus} className="me-2" />
            Job Details
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Job Title */}
              <div className="col-md-6 mb-3">
                <label htmlFor="title" className="form-label">
                  Job Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Digital Marketing Manager"
                />
              </div>

              {/* Job Category */}
              <div className="col-md-6 mb-3">
                <label htmlFor="category" className="form-label">
                  Category <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {jobCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Type */}
              <div className="col-md-6 mb-3">
                <label htmlFor="job_type" className="form-label">
                  Job Type <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="job_type"
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Job Type</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="col-md-6 mb-3">
                <label htmlFor="location" className="form-label">
                  Location <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Delhi, Mumbai, Remote"
                />
              </div>

              {/* Job Description */}
              <div className="col-12 mb-3">
                <label htmlFor="description" className="form-label">
                  Job Description <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Provide a detailed description of the job role, responsibilities, requirements, and qualifications..."
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
                disabled={isLoading}
              >
                <CIcon icon={cilX} className="me-2" />
                Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding Job...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-2" />
                    Add Job
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Form Guidelines */}
      <div className="card mt-4">
        <div className="card-header">
          <h6 className="card-title mb-0">Form Guidelines</h6>
        </div>
        <div className="card-body">
          <ul className="mb-0">
            <li><strong>Job Title:</strong> Use clear, descriptive titles that accurately reflect the role</li>
            <li><strong>Category:</strong> Select the most appropriate category for the job</li>
            <li><strong>Job Type:</strong> Choose the employment type that best fits the position</li>
            <li><strong>Location:</strong> Specify the work location or indicate if it's remote</li>
            <li><strong>Description:</strong> Include detailed responsibilities, requirements, and qualifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddJobs; 