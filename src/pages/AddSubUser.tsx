import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

interface FormState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  alternatePhone: string;
  password: string;
  user_type: number; // will default to 3
  city: string;
  orgnaization_id: number | '';
}

const AddSubUser: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    password: '',
    user_type: 3,
    city: '',
    orgnaization_id: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'orgnaization_id' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // basic validation
    if (!form.first_name || !form.last_name || !form.email || !form.phone || !form.password || form.orgnaization_id === '') {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);

      const response = await apiService.authFetch('/vender/user/add', {
        method: 'POST',
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          alternatePhone: form.alternatePhone,
          password: form.password,
          user_type: form.user_type,
          city: form.city,
          orgnaization_id: form.orgnaization_id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to add sub user');
      }

      setSuccess('Sub user added successfully');
      // Navigate to list
      navigate('/sub-users/all');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid">
      <h3 className="mb-3">Add Sub User</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="card p-3">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">First Name *</label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name *</label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone *</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Alternate Phone</label>
            <input
              type="tel"
              name="alternatePhone"
              value={form.alternatePhone}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Organization ID *</label>
            <input
              type="number"
              name="orgnaization_id"
              value={form.orgnaization_id}
              onChange={handleChange}
              className="form-control"
              required
              min={1}
            />
          </div>
        </div>

        <div className="mt-4 d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Add Sub User'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/sub-users/all')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubUser; 