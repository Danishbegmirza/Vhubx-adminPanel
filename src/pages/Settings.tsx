import React from 'react';
import { CCard, CCardBody, CCol, CRow, CForm, CFormLabel, CFormInput, CFormSelect, CFormCheck, CInputGroup } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSave, cilSettings } from '@coreui/icons';

const Settings: React.FC = () => {
  return (
    <>
      <CRow>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <div className="card-header">
              <h4>General Settings</h4>
            </div>
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CFormLabel htmlFor="siteName">Site Name</CFormLabel>
                  <CFormInput
                    id="siteName"
                    defaultValue="VHubX Admin"
                    placeholder="Enter site name"
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="siteUrl">Site URL</CFormLabel>
                  <CFormInput
                    id="siteUrl"
                    defaultValue="https://vhubx-admin.com"
                    placeholder="Enter site URL"
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="adminEmail">Admin Email</CFormLabel>
                  <CFormInput
                    id="adminEmail"
                    type="email"
                    defaultValue="admin@vhubx-admin.com"
                    placeholder="Enter admin email"
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="timezone">Timezone</CFormLabel>
                  <CFormSelect id="timezone">
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Standard Time</option>
                    <option value="PST">Pacific Standard Time</option>
                    <option value="GMT">Greenwich Mean Time</option>
                  </CFormSelect>
                </div>
                <button className="btn btn-primary">
                  <CIcon icon={cilSave} className="me-2" />
                  Save Settings
                </button>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <div className="card-header">
              <h4>Notification Settings</h4>
            </div>
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CFormCheck
                    id="emailNotifications"
                    label="Enable Email Notifications"
                    defaultChecked
                  />
                </div>
                <div className="mb-3">
                  <CFormCheck
                    id="smsNotifications"
                    label="Enable SMS Notifications"
                  />
                </div>
                <div className="mb-3">
                  <CFormCheck
                    id="pushNotifications"
                    label="Enable Push Notifications"
                    defaultChecked
                  />
                </div>
                <div className="mb-3">
                  <CFormCheck
                    id="weeklyReports"
                    label="Send Weekly Reports"
                    defaultChecked
                  />
                </div>
                <button className="btn btn-primary">
                  <CIcon icon={cilSave} className="me-2" />
                  Save Notifications
                </button>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <div className="card-header">
              <h4>Security Settings</h4>
            </div>
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CFormLabel htmlFor="sessionTimeout">Session Timeout (minutes)</CFormLabel>
                  <CFormInput
                    id="sessionTimeout"
                    type="number"
                    defaultValue="30"
                    min="5"
                    max="480"
                  />
                </div>
                <div className="mb-3">
                  <CFormCheck
                    id="twoFactorAuth"
                    label="Enable Two-Factor Authentication"
                    defaultChecked
                  />
                </div>
                <div className="mb-3">
                  <CFormCheck
                    id="passwordPolicy"
                    label="Enforce Strong Password Policy"
                    defaultChecked
                  />
                </div>
                <div className="mb-3">
                  <CFormCheck
                    id="loginAttempts"
                    label="Limit Login Attempts"
                    defaultChecked
                  />
                </div>
                <button className="btn btn-primary">
                  <CIcon icon={cilSave} className="me-2" />
                  Save Security
                </button>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} md={6}>
          <CCard className="mb-4">
            <div className="card-header">
              <h4>API Settings</h4>
            </div>
            <CCardBody>
              <CForm>
                <div className="mb-3">
                  <CFormLabel htmlFor="apiKey">API Key</CFormLabel>
                  <CInputGroup>
                    <CFormInput
                      id="apiKey"
                      type="password"
                      defaultValue="sk-1234567890abcdef"
                      readOnly
                    />
                    <div className="input-group-text">
                      <button className="btn btn-outline-secondary btn-sm">
                        Show
                      </button>
                    </div>
                  </CInputGroup>
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="webhookUrl">Webhook URL</CFormLabel>
                  <CFormInput
                    id="webhookUrl"
                    defaultValue="https://api.vhubx-admin.com/webhook"
                    placeholder="Enter webhook URL"
                  />
                </div>
                <div className="mb-3">
                  <CFormCheck
                    id="enableWebhooks"
                    label="Enable Webhooks"
                    defaultChecked
                  />
                </div>
                <button className="btn btn-primary">
                  <CIcon icon={cilSave} className="me-2" />
                  Save API Settings
                </button>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Settings; 