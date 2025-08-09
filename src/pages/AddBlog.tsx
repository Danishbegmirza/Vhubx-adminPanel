import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CCard, CCardHeader, CCardBody, CForm, CFormLabel, CFormInput, CFormTextarea, CButton, CAlert, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilArrowLeft } from '@coreui/icons';
import { apiService } from '../services/api';

// Type casting for CoreUI components
const CCardComponent = CCard as React.ComponentType<any>;
const CCardHeaderComponent = CCardHeader as React.ComponentType<any>;
const CCardBodyComponent = CCardBody as React.ComponentType<any>;
const CFormComponent = CForm as React.ComponentType<any>;
const CFormLabelComponent = CFormLabel as React.ComponentType<any>;
const CFormInputComponent = CFormInput as React.ComponentType<any>;
const CFormTextareaComponent = CFormTextarea as React.ComponentType<any>;
const CButtonComponent = CButton as React.ComponentType<any>;
const CAlertComponent = CAlert as React.ComponentType<any>;
const CSpinnerComponent = CSpinner as React.ComponentType<any>;

const AddBlog: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    cover_image: '',
    short_description: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiService.authFetch('http://3.110.153.105:3000/api/v1/blog/add', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Blog added successfully!');
        setFormData({
          title: '',
          cover_image: '',
          short_description: '',
          description: ''
        });
        setTimeout(() => {
          navigate('/blogs/all');
        }, 2000);
      } else {
        setError(data.message || 'Failed to add blog');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-blog-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Add New Blog</h2>
        <CButtonComponent 
          color="secondary" 
          variant="outline"
          onClick={() => navigate('/blogs/all')}
        >
          <CIcon icon={cilArrowLeft} className="me-2" />
          Back to Blogs
        </CButtonComponent>
      </div>

      <CCardComponent className="blog-card blog-form-container">
        <CCardHeaderComponent>
          <h4>Blog Information</h4>
        </CCardHeaderComponent>
        <CCardBodyComponent>
          {error && <CAlertComponent color="danger" className="blog-error">{error}</CAlertComponent>}
          {success && <CAlertComponent color="success" className="blog-success">{success}</CAlertComponent>}

          <CFormComponent onSubmit={handleSubmit} className="blog-form">
            <div className="mb-3">
              <CFormLabelComponent htmlFor="title">Blog Title *</CFormLabelComponent>
              <CFormInputComponent
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter blog title"
                required
              />
            </div>

            <div className="mb-3">
              <CFormLabelComponent htmlFor="cover_image">Cover Image URL</CFormLabelComponent>
              <CFormInputComponent
                id="cover_image"
                name="cover_image"
                type="url"
                value={formData.cover_image}
                onChange={handleInputChange}
                placeholder="https://example.com/images/blog-cover.jpg"
              />
            </div>

            <div className="mb-3">
              <CFormLabelComponent htmlFor="short_description">Short Description *</CFormLabelComponent>
              <CFormTextareaComponent
                id="short_description"
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                placeholder="Brief description of the blog"
                rows={3}
                required
              />
            </div>

            <div className="mb-3">
              <CFormLabelComponent htmlFor="description">Full Description *</CFormLabelComponent>
              <CFormTextareaComponent
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Full blog content"
                rows={8}
                required
              />
            </div>

            <div className="d-flex gap-2">
              <CButtonComponent 
                type="submit" 
                color="primary" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CSpinnerComponent size="sm" className="me-2" />
                    Adding Blog...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-2" />
                    Add Blog
                  </>
                )}
              </CButtonComponent>
              <CButtonComponent 
                type="button" 
                color="secondary" 
                variant="outline"
                onClick={() => navigate('/blogs/all')}
                disabled={loading}
              >
                Cancel
              </CButtonComponent>
            </div>
          </CFormComponent>
        </CCardBodyComponent>
      </CCardComponent>
    </div>
  );
};

export default AddBlog; 