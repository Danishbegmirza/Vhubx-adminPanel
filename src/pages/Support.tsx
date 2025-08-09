import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilHeadphones, cilInfo } from '@coreui/icons';

const Support: React.FC = () => {
  return (
    <div className="support-container">
      {/* Page Header */}
      <div className="page-header mb-4">
        <h1 className="page-title">
          <CIcon icon={cilHeadphones} className="me-2" />
          Support
        </h1>
        <p className="page-subtitle">Get help and support for your admin dashboard</p>
      </div>

      {/* Coming Soon Content */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <CIcon icon={cilHeadphones} size="4xl" className="text-muted" />
              </div>
              <h2 className="mb-3">Support Center</h2>
              <h3 className="text-muted mb-4">Coming Soon</h3>
              <p className="text-muted mb-4">
                We're developing a comprehensive support system to assist you.
                <br />
                This feature will include help documentation, ticket system, and live chat support.
              </p>
              <div className="d-flex justify-content-center">
                <div className="badge bg-primary fs-6 px-3 py-2">
                  Under Development
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Preview */}
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <CIcon icon={cilInfo} size="xl" className="text-primary mb-3" />
              <h5>Help Documentation</h5>
              <p className="text-muted">Comprehensive guides and tutorials</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <CIcon icon={cilHeadphones} size="xl" className="text-success mb-3" />
              <h5>Live Chat Support</h5>
              <p className="text-muted">Get instant help from our support team</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <CIcon icon={cilInfo} size="xl" className="text-warning mb-3" />
              <h5>Ticket System</h5>
              <p className="text-muted">Submit and track support tickets</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Contact Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Email Support</h6>
                  <p className="text-muted">support@example.com</p>
                </div>
                <div className="col-md-6">
                  <h6>Phone Support</h6>
                  <p className="text-muted">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support; 