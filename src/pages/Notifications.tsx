import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilBell, cilEnvelopeOpen } from '@coreui/icons';

const Notifications: React.FC = () => {
  return (
    <div className="notifications-container">
      {/* Page Header */}
      <div className="page-header mb-4">
        <h1 className="page-title">
          <CIcon icon={cilBell} className="me-2" />
          Notifications
        </h1>
        <p className="page-subtitle">Manage system notifications and alerts</p>
      </div>

      {/* Coming Soon Content */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <CIcon icon={cilBell} size="4xl" className="text-muted" />
              </div>
              <h2 className="mb-3">Notifications Center</h2>
              <h3 className="text-muted mb-4">Coming Soon</h3>
              <p className="text-muted mb-4">
                We're building a comprehensive notification system to keep you informed.
                <br />
                This feature will include real-time alerts, email notifications, and notification preferences.
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
              <CIcon icon={cilBell} size="xl" className="text-primary mb-3" />
              <h5>Real-time Alerts</h5>
              <p className="text-muted">Get instant notifications for important events</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <CIcon icon={cilEnvelopeOpen} size="xl" className="text-success mb-3" />
              <h5>Email Notifications</h5>
              <p className="text-muted">Receive email alerts for critical updates</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <CIcon icon={cilBell} size="xl" className="text-warning mb-3" />
              <h5>Notification Settings</h5>
              <p className="text-muted">Customize your notification preferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications; 