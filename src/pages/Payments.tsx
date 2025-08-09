import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilCreditCard, cilDollar } from '@coreui/icons';

const Payments: React.FC = () => {
  return (
    <div className="payments-container">
      {/* Page Header */}
      <div className="page-header mb-4">
        <h1 className="page-title">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
        </h1>
        <p className="page-subtitle">Manage payment transactions and billing</p>
      </div>

      {/* Coming Soon Content */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <CIcon icon={cilDollar} size="4xl" className="text-muted" />
              </div>
              <h2 className="mb-3">Payments Module</h2>
              <h3 className="text-muted mb-4">Coming Soon</h3>
              <p className="text-muted mb-4">
                We're working hard to bring you a comprehensive payment management system.
                <br />
                This feature will include payment tracking, billing management, and transaction history.
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
              <CIcon icon={cilCreditCard} size="xl" className="text-primary mb-3" />
              <h5>Payment Tracking</h5>
              <p className="text-muted">Track all payment transactions in real-time</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <CIcon icon={cilDollar} size="xl" className="text-success mb-3" />
              <h5>Billing Management</h5>
              <p className="text-muted">Generate and manage invoices automatically</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <CIcon icon={cilCreditCard} size="xl" className="text-warning mb-3" />
              <h5>Transaction History</h5>
              <p className="text-muted">Complete history of all payment activities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments; 