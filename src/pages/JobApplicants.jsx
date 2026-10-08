import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const statusOptions = ['APPLIED', 'SHORTLISTED', 'REJECTED', 'HIRED'];

export default function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => {
    setLoading(true);
    api.get(`/recruiter/jobs/${jobId}/applicants`)
      .then(({ data }) => setApplicants(data))
      .catch(() => setError('Could not load applicants for this job.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [jobId]); // eslint-disable-line

  const handleStatusChange = async (applicationId, status) => {
    setUpdatingId(applicationId);
    try {
      await api.put(`/recruiter/applications/${applicationId}/status`, { status });
      setApplicants(applicants.map(a => a.applicationId === applicationId ? { ...a, status } : a));
    } catch {
      setError('Could not update this applicant\'s status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="dashboard">
        <button className="btn btn-ghost" style={{ marginBottom: 20 }} onClick={() => navigate('/recruiter/postings')}>← Back to postings</button>

        <p className="eyebrow">Recruiter</p>
        <h1>Applicants</h1>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
        ) : applicants.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No one has applied to this job yet.</p>
        ) : (
          <div className="job-list">
            {applicants.map((a) => (
              <div className="job-card" key={a.applicationId}>
                <div>
                  <h3>{a.applicantName}</h3>
                  <p className="job-meta">{a.applicantEmail}</p>
                  {a.applicantSkills && <p className="job-meta">Skills: {a.applicantSkills}</p>}
                  <p className="job-meta">Applied {new Date(a.appliedAt).toLocaleDateString()}</p>
                </div>
                <select
                  value={a.status}
                  disabled={updatingId === a.applicationId}
                  onChange={(e) => handleStatusChange(a.applicationId, e.target.value)}
                >
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
