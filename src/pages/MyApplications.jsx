import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const statusColors = {
  APPLIED: '#6b7280',
  SHORTLISTED: '#0f766e',
  REJECTED: '#b3261e',
  HIRED: '#166534',
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/jobseeker/applications')
      .then(({ data }) => setApplications(data))
      .catch(() => setError('Could not load your applications.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-shell">
      <Navbar />
      <div className="dashboard">
        <p className="eyebrow">Job Seeker</p>
        <h1>My applications</h1>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
        ) : applications.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>You haven't applied to any jobs yet.</p>
        ) : (
          <div className="job-list">
            {applications.map((app) => (
              <div className="job-card" key={app.applicationId}>
                <div>
                  <h3>{app.jobTitle}</h3>
                  <p className="job-meta">{app.companyName} · {app.location}</p>
                  <p className="job-meta">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <span className="status-pill" style={{ background: statusColors[app.status] || '#6b7280' }}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
