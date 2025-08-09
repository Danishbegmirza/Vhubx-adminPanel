import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface SubUserItem {
  userid?: number | string;
  fullname?: string;
  email?: string;
  mobile?: string;
  status?: number | string;
  userText?: string;
  createdDate?: string;
  vendor_organization?: {
    id?: number;
    city?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface VendorUserListResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data:
    | SubUserItem[]
    | {
        total: number;
        page: number;
        limit: number;
        data?: SubUserItem[];
        items?: SubUserItem[];
      };
}

const AllSubUsers: React.FC = () => {
  const [items, setItems] = useState<SubUserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const navigate = useNavigate();

  const fetchSubUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (searchText.trim()) {
        params.append('search', searchText.trim());
      }

      const res = await apiService.authFetch(`/vendor/user/list?${params.toString()}`);
      const data: VendorUserListResponse = await res.json();

      if (!res.ok) {
        throw new Error((data as any)?.message || 'Failed to load sub users');
      }

      // Normalize response
      if (Array.isArray(data.data)) {
        setItems(data.data);
      } else if (data.data && Array.isArray((data.data as any).data)) {
        setItems((data.data as any).data);
      } else if (data.data && Array.isArray((data.data as any).items)) {
        setItems((data.data as any).items);
      } else {
        setItems([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, searchText]);

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchText(searchInput);
  };

  const onClearSearch = () => {
    setSearchInput('');
    setSearchText('');
    setPage(1);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h3 className="mb-0">All Sub Users</h3>
        <form className="d-flex align-items-center gap-2" onSubmit={onSubmitSearch}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, mobile"
            style={{ minWidth: 260 }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
          {searchText && (
            <button type="button" className="btn btn-outline-secondary" onClick={onClearSearch}>Clear</button>
          )}
        </form>
        <button type="button" className="btn btn-success" onClick={() => navigate('/sub-users/add')}>Add Sub User</button>
      </div>

      {loading && <div className="text-center py-5">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Status</th>
                    <th>City</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4">No records found</td>
                    </tr>
                  ) : (
                    items.map((u, idx) => (
                      <tr key={(u.userid as any) ?? idx}>
                        <td>{(page - 1) * limit + idx + 1}</td>
                        <td>{u.fullname ?? '-'}</td>
                        <td>{u.email ?? '-'}</td>
                        <td>{u.mobile ?? '-'}</td>
                        <td>{u.userText ?? (String(u.status) === '1' ? 'Active' : 'Inactive')}</td>
                        <td>{u.vendor_organization?.city ?? '-'}</td>
                        <td>{u.createdDate ?? '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button className="btn btn-outline-secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
        <span>Page {page}</span>
        <button className="btn btn-outline-secondary" onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default AllSubUsers; 