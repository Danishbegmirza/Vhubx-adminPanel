import React from 'react';

interface CustomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onConfirm?: () => void;
  showConfirm?: boolean;
  confirmText?: string;
  cancelText?: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
  onConfirm,
  showConfirm = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-success',
          textColor: 'text-white',
          borderColor: 'border-success'
        };
      case 'error':
        return {
          bgColor: 'bg-danger',
          textColor: 'text-white',
          borderColor: 'border-danger'
        };
      case 'warning':
        return {
          bgColor: 'bg-warning',
          textColor: 'text-dark',
          borderColor: 'border-warning'
        };
      case 'info':
        return {
          bgColor: 'bg-info',
          textColor: 'text-white',
          borderColor: 'border-info'
        };
      default:
        return {
          bgColor: 'bg-primary',
          textColor: 'text-white',
          borderColor: 'border-primary'
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className="custom-alert-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="custom-alert-modal" style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        border: `2px solid ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'}`
      }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className={`mb-0 ${styles.textColor}`} style={{ fontWeight: '600' }}>
            {title}
          </h5>
          <button
            onClick={onClose}
            className="btn-close"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6c757d'
            }}
          >
            ×
          </button>
        </div>

        {/* Message */}
        <p className="mb-4" style={{ color: '#6c757d', lineHeight: '1.5' }}>
          {message}
        </p>

        {/* Buttons */}
        <div className="d-flex gap-2 justify-content-end">
          {showConfirm && (
            <button
              onClick={onClose}
              className="btn btn-outline-secondary"
              style={{ borderRadius: '8px', padding: '8px 16px' }}
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={showConfirm ? onConfirm : onClose}
            className={`btn ${styles.bgColor} ${styles.textColor}`}
            style={{ borderRadius: '8px', padding: '8px 16px' }}
          >
            {showConfirm ? confirmText : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert; 