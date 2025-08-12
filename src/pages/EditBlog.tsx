import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CCard, CCardHeader, CCardBody, CForm, CFormLabel, CFormInput, CFormTextarea, CFormSelect, CButton, CAlert, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilArrowLeft } from '@coreui/icons';
import { apiService } from '../services/api';
import { config } from '../config/env';

// Type casting for CoreUI components
const CCardComponent = CCard as React.ComponentType<any>;
const CCardHeaderComponent = CCardHeader as React.ComponentType<any>;
const CCardBodyComponent = CCardBody as React.ComponentType<any>;
const CFormComponent = CForm as React.ComponentType<any>;
const CFormLabelComponent = CFormLabel as React.ComponentType<any>;
const CFormInputComponent = CFormInput as React.ComponentType<any>;
const CFormTextareaComponent = CFormTextarea as React.ComponentType<any>;
const CFormSelectComponent = CFormSelect as React.ComponentType<any>;
const CButtonComponent = CButton as React.ComponentType<any>;
const CAlertComponent = CAlert as React.ComponentType<any>;
const CSpinnerComponent = CSpinner as React.ComponentType<any>;

interface Blog {
  id: number;
  title: string;
  cover_image: string;
  short_description: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const EditBlog: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    cover_image: '',
    short_description: '',
    description: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

      try {
        const response = await apiService.authFetch(`${config.API_BASE_URL}/blog/${id}`, {
          method: 'GET'
        });

        const data = await response.json();

        if (response.ok) {
          setBlog(data.data);
          setFormData({
            title: data.data.title || '',
            cover_image: data.data.cover_image || '',
            short_description: data.data.short_description || '',
            description: data.data.description || '',
            status: data.data.status || 'draft'
          });
        } else {
          setError(data.message || 'Failed to fetch blog');
        }
      } catch (err) {
        setError('Network error occurred');
      } finally {
        setFetching(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const response = await apiService.authFetch(`${config.API_BASE_URL}/blog/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Blog updated successfully!');
        setTimeout(() => {
          navigate('/blogs/all');
        }, 2000);
      } else {
        setError(data.message || 'Failed to update blog');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="blog-loading">
        <CSpinnerComponent />
        <p className="mt-2">Loading blog...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-4">
        <CAlertComponent color="danger" className="blog-error">Blog not found</CAlertComponent>
        <CButtonComponent 
          color="secondary" 
          onClick={() => navigate('/blogs/all')}
        >
          Back to Blogs
        </CButtonComponent>
      </div>
    );
  }

  return (
    <div className="edit-blog-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Edit Blog</h2>
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
          <h4>Edit Blog Information</h4>
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

            <div className="mb-3">
              <CFormLabelComponent htmlFor="status">Status</CFormLabelComponent>
              <CFormSelectComponent
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </CFormSelectComponent>
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
                    Updating Blog...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-2" />
                    Update Blog
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

export default EditBlog; 