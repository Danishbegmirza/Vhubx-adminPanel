import React from 'react';
import { CCard, CCardBody, CCol, CRow, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CInputGroup, CFormInput } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilPlus, cilPencil, cilTrash } from '@coreui/icons';

const Products: React.FC = () => {
  const products = [
    {
      id: 1,
      name: 'Laptop Pro X1',
      category: 'Electronics',
      price: 1299.99,
      stock: 45,
      status: 'In Stock',
      image: 'https://via.placeholder.com/50x50/007bff/ffffff?text=L'
    },
    {
      id: 2,
      name: 'Wireless Headphones',
      category: 'Audio',
      price: 199.99,
      stock: 120,
      status: 'In Stock',
      image: 'https://via.placeholder.com/50x50/28a745/ffffff?text=H'
    },
    {
      id: 3,
      name: 'Smart Watch Series 5',
      category: 'Wearables',
      price: 399.99,
      stock: 0,
      status: 'Out of Stock',
      image: 'https://via.placeholder.com/50x50/dc3545/ffffff?text=W'
    },
    {
      id: 4,
      name: 'Gaming Mouse',
      category: 'Gaming',
      price: 79.99,
      stock: 67,
      status: 'In Stock',
      image: 'https://via.placeholder.com/50x50/ffc107/ffffff?text=G'
    },
    {
      id: 5,
      name: 'Bluetooth Speaker',
      category: 'Audio',
      price: 149.99,
      stock: 23,
      status: 'Low Stock',
      image: 'https://via.placeholder.com/50x50/17a2b8/ffffff?text=S'
    }
  ];

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <div className="card-header">
              <CRow className="align-items-center">
                <CCol>
                  <h4 className="mb-0">Products Management</h4>
                </CCol>
                <CCol xs="auto">
                  <button className="btn btn-primary">
                    <CIcon icon={cilPlus} className="me-2" />
                    Add Product
                  </button>
                </CCol>
              </CRow>
            </div>
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CInputGroup>
                    <div className="input-group-text">
                      <CIcon icon={cilSearch} />
                    </div>
                    <CFormInput placeholder="Search products..." />
                  </CInputGroup>
                </CCol>
              </CRow>
              
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-light">Product</CTableHeaderCell>
                    <CTableHeaderCell className="bg-light">Category</CTableHeaderCell>
                    <CTableHeaderCell className="bg-light">Price</CTableHeaderCell>
                    <CTableHeaderCell className="bg-light">Stock</CTableHeaderCell>
                    <CTableHeaderCell className="bg-light">Status</CTableHeaderCell>
                    <CTableHeaderCell className="bg-light">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {products.map((product) => (
                    <CTableRow key={product.id}>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <img
                            className="rounded me-2"
                            width={40}
                            height={40}
                            src={product.image}
                            alt={product.name}
                          />
                          <div>
                            <div className="fw-semibold">{product.name}</div>
                            <div className="small text-medium-emphasis">ID: {product.id}</div>
                          </div>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <span className="badge bg-info">{product.category}</span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="fw-semibold">${product.price}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="fw-semibold">{product.stock}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <span className={`badge bg-${
                          product.status === 'In Stock' ? 'success' : 
                          product.status === 'Low Stock' ? 'warning' : 'secondary'
                        }`}>
                          {product.status}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <button className="btn btn-primary btn-sm me-1">
                          <CIcon icon={cilPencil} />
                        </button>
                        <button className="btn btn-danger btn-sm">
                          <CIcon icon={cilTrash} />
                        </button>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Products; 