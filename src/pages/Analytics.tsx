import React from 'react';
import { CCard, CCardBody, CCol, CRow, CProgress } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilChart, cilPeople, cilDollar, cilBasket } from '@coreui/icons';

const Analytics: React.FC = () => {
  const progress = Math.random() * 100;
  const progressExample = [
    { title: 'Total Users', value: '2,847', unit: '', color: 'primary' },
    { title: 'Revenue', value: '$45,678', unit: '', color: 'info' },
    { title: 'Conversion Rate', value: '24.56', unit: '%', color: 'warning' },
    { title: 'Active Sessions', value: '1,234', unit: '', color: 'danger' },
  ];

  return (
    <>
      <CRow>
        {progressExample.map((item, index) => (
          <CCol sm={6} lg={3} key={index}>
            <CCard className="mb-4">
              <CCardBody>
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <CIcon icon={cilChart} size="xl" className="text-primary" />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="fs-4 fw-semibold">{item.value}</div>
                    <div className="text-medium-emphasis">{item.title}</div>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <CRow>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <div className="card-header">
              <h4>Traffic Sources</h4>
            </div>
            <CCardBody>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Direct</span>
                  <span className="fw-semibold">45%</span>
                </div>
                <CProgress value={45} className="mb-3" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Organic Search</span>
                  <span className="fw-semibold">32%</span>
                </div>
                <CProgress value={32} className="mb-3" color="info" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Social Media</span>
                  <span className="fw-semibold">15%</span>
                </div>
                <CProgress value={15} className="mb-3" color="warning" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Referral</span>
                  <span className="fw-semibold">8%</span>
                </div>
                <CProgress value={8} className="mb-3" color="danger" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <div className="card-header">
              <h4>Monthly Revenue</h4>
            </div>
            <CCardBody>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>January</span>
                  <span className="fw-semibold">$12,500</span>
                </div>
                <CProgress value={75} className="mb-3" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>February</span>
                  <span className="fw-semibold">$15,200</span>
                </div>
                <CProgress value={85} className="mb-3" color="info" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>March</span>
                  <span className="fw-semibold">$18,750</span>
                </div>
                <CProgress value={95} className="mb-3" color="success" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>April</span>
                  <span className="fw-semibold">$22,100</span>
                </div>
                <CProgress value={100} className="mb-3" color="warning" />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <div className="card-header">
              <h4>User Activity</h4>
            </div>
            <CCardBody>
              <CRow>
                <CCol md={3}>
                  <div className="text-center mb-3">
                    <div className="fs-1 fw-bold text-primary">2,847</div>
                    <div className="text-medium-emphasis">Total Users</div>
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="text-center mb-3">
                    <div className="fs-1 fw-bold text-success">1,234</div>
                    <div className="text-medium-emphasis">Active Users</div>
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="text-center mb-3">
                    <div className="fs-1 fw-bold text-warning">456</div>
                    <div className="text-medium-emphasis">New Users</div>
                  </div>
                </CCol>
                <CCol md={3}>
                  <div className="text-center mb-3">
                    <div className="fs-1 fw-bold text-danger">89</div>
                    <div className="text-medium-emphasis">Premium Users</div>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Analytics; 