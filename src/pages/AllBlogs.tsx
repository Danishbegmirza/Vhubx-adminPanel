import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllBlogs.css';
import { 
  CCard, 
  CCardHeader, 
  CCardBody, 
  CButton, 
  CTable, 
  CTableHead, 
  CTableRow, 
  CTableHeaderCell, 
  CTableBody, 
  CTableDataCell,
  CFormInput,
  CAlert,
  CSpinner,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CPagination,
  CPaginationItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilPlus, 
  cilPencil, 
  cilTrash, 
  cilSearch
} from '@coreui/icons';
import { apiService } from '../services/api';

// Type casting for CoreUI components
const CCardComponent = CCard as React.ComponentType<any>;
const CCardHeaderComponent = CCardHeader as React.ComponentType<any>;
const CCardBodyComponent = CCardBody as React.ComponentType<any>;
const CButtonComponent = CButton as React.ComponentType<any>;
const CTableComponent = CTable as React.ComponentType<any>;
const CTableHeadComponent = CTableHead as React.ComponentType<any>;
const CTableRowComponent = CTableRow as React.ComponentType<any>;
const CTableHeaderCellComponent = CTableHeaderCell as React.ComponentType<any>;
const CTableBodyComponent = CTableBody as React.ComponentType<any>;
const CTableDataCellComponent = CTableDataCell as React.ComponentType<any>;
const CFormInputComponent = CFormInput as React.ComponentType<any>;
const CAlertComponent = CAlert as React.ComponentType<any>;
const CSpinnerComponent = CSpinner as React.ComponentType<any>;
const CBadgeComponent = CBadge as React.ComponentType<any>;
const CModalComponent = CModal as React.ComponentType<any>;
const CModalHeaderComponent = CModalHeader as React.ComponentType<any>;
const CModalTitleComponent = CModalTitle as React.ComponentType<any>;
const CModalBodyComponent = CModalBody as React.ComponentType<any>;
const CModalFooterComponent = CModalFooter as React.ComponentType<any>;
const CPaginationComponent = CPagination as React.ComponentType<any>;
const CPaginationItemComponent = CPaginationItem as React.ComponentType<any>;

interface Blog {
  id: number;
  title: string;
  cover_image: string;
  short_description: string;
  description: string;
  read_count: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const AllBlogs: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBlogs = async (page: number = 1, search: string = '') => {
    setLoading(true);
    setError('');

    try {
      let url = `http://3.110.153.105:3000/api/v1/blog/list?page=${page}&limit=10`;
      if (search) {
        url += `&title=${encodeURIComponent(search)}`;
      }

      const response = await apiService.authFetch(url, {
        method: 'GET'
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setBlogs(data.data?.data || []);
        setTotalPages(data.data?.total || 1);
      } else {
        setError(data.message || 'Failed to fetch blogs');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (blog: Blog) => {
    setBlogToDelete(blog);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await apiService.authFetch(`http://3.110.153.105:3000/api/v1/blog/delete/${blogToDelete.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setBlogs(prev => prev.filter(blog => blog.id !== blogToDelete.id));
        setDeleteModalVisible(false);
        setBlogToDelete(null);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete blog');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return <CBadgeComponent color="success">Published</CBadgeComponent>;
      case 'draft':
        return <CBadgeComponent color="warning">Draft</CBadgeComponent>;
      case 'pending':
        return <CBadgeComponent color="info">Pending</CBadgeComponent>;
      case 'archived':
        return <CBadgeComponent color="secondary">Archived</CBadgeComponent>;
      default:
        return <CBadgeComponent color="secondary">{status || 'Unknown'}</CBadgeComponent>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="all-blogs-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Blogs</h2>
        <CButtonComponent 
          color="primary" 
          onClick={() => navigate('/blogs/add')}
        >
          <CIcon icon={cilPlus} className="me-2" />
          Add New Blog
        </CButtonComponent>
      </div>

      <CCardComponent className="blog-card">
        <CCardHeaderComponent>
          <div className="d-flex justify-content-between align-items-center">
            <h4>Blog List</h4>
            <div className="d-flex align-items-center blog-search-container">
              <CFormInputComponent
                placeholder="Search by title..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ width: '300px' }}
                className="me-3"
              />
              <CIcon icon={cilSearch} />
            </div>
          </div>
        </CCardHeaderComponent>
        <CCardBodyComponent>
          {error && <CAlertComponent color="danger" className="blog-error">{error}</CAlertComponent>}

          {loading ? (
            <div className="blog-loading">
              <CSpinnerComponent />
              <p className="mt-2">Loading blogs...</p>
            </div>
          ) : (
            <>
              <div className="blog-table-container">
                <CTableComponent hover responsive className="blog-table">
                  <CTableHeadComponent>
                    <CTableRowComponent>
                      <CTableHeaderCellComponent>Title</CTableHeaderCellComponent>
                      <CTableHeaderCellComponent>Short Description</CTableHeaderCellComponent>
                      <CTableHeaderCellComponent>Status</CTableHeaderCellComponent>
                      <CTableHeaderCellComponent>Read Count</CTableHeaderCellComponent>
                      <CTableHeaderCellComponent>Created</CTableHeaderCellComponent>
                      <CTableHeaderCellComponent>Actions</CTableHeaderCellComponent>
                    </CTableRowComponent>
                  </CTableHeadComponent>
                  <CTableBodyComponent>
                    {blogs.length === 0 ? (
                      <CTableRowComponent>
                        <CTableDataCellComponent colSpan={6} className="blog-empty-state">
                          <CIcon icon={cilSearch} />
                          <p>No blogs found</p>
                        </CTableDataCellComponent>
                      </CTableRowComponent>
                    ) : (
                      blogs.map((blog) => (
                        <CTableRowComponent key={blog.id}>
                          <CTableDataCellComponent className="blog-title-cell">
                            <div>
                              <strong>{blog.title}</strong>
                              {blog.cover_image && (
                                <div className="mt-1">
                                  <img 
                                    src={blog.cover_image} 
                                    alt={blog.title}
                                    className="blog-cover-image"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </CTableDataCellComponent>
                          <CTableDataCellComponent className="blog-description-cell">
                            {blog.short_description?.length > 100 
                              ? `${blog.short_description.substring(0, 100)}...` 
                              : blog.short_description}
                          </CTableDataCellComponent>
                          <CTableDataCellComponent>
                            {getStatusBadge(blog.status)}
                          </CTableDataCellComponent>
                          <CTableDataCellComponent>
                            <span className="read-count">{blog.read_count || 0}</span>
                          </CTableDataCellComponent>
                          <CTableDataCellComponent>
                            {formatDate(blog.createdAt)}
                          </CTableDataCellComponent>
                          <CTableDataCellComponent>
                            <div className="blog-actions">
                              <CButtonComponent 
                                color="info" 
                                size="sm"
                                onClick={() => navigate(`/blogs/edit/${blog.id}`)}
                              >
                                <CIcon icon={cilPencil} />
                              </CButtonComponent>
                              <CButtonComponent 
                                color="danger" 
                                size="sm"
                                onClick={() => handleDelete(blog)}
                              >
                                <CIcon icon={cilTrash} />
                              </CButtonComponent>
                            </div>
                          </CTableDataCellComponent>
                        </CTableRowComponent>
                      ))
                    )}
                  </CTableBodyComponent>
                </CTableComponent>
              </div>

              {totalPages > 1 && (
                <div className="blog-pagination">
                  <CPaginationComponent>
                    <CPaginationItemComponent 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </CPaginationItemComponent>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <CPaginationItemComponent
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </CPaginationItemComponent>
                    ))}
                    
                    <CPaginationItemComponent 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </CPaginationItemComponent>
                  </CPaginationComponent>
                </div>
              )}
            </>
          )}
        </CCardBodyComponent>
      </CCardComponent>

      {/* Delete Confirmation Modal */}
      <CModalComponent 
        visible={deleteModalVisible} 
        onClose={() => setDeleteModalVisible(false)}
        className="blog-modal"
      >
        <CModalHeaderComponent>
          <CModalTitleComponent>Confirm Delete</CModalTitleComponent>
        </CModalHeaderComponent>
        <CModalBodyComponent>
          Are you sure you want to delete the blog "{blogToDelete?.title}"? This action cannot be undone.
        </CModalBodyComponent>
        <CModalFooterComponent>
          <CButtonComponent 
            color="secondary" 
            onClick={() => setDeleteModalVisible(false)}
            disabled={deleteLoading}
          >
            Cancel
          </CButtonComponent>
          <CButtonComponent 
            color="danger" 
            onClick={confirmDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <CSpinnerComponent size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                <CIcon icon={cilTrash} className="me-2" />
                Delete
              </>
            )}
          </CButtonComponent>
        </CModalFooterComponent>
      </CModalComponent>
    </div>
  );
};

export default AllBlogs; 