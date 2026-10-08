import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function MyPostings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/recruiter/jobs')
      .then(({ data }) => setJobs(data))
      .catch(() => setError('Could not load your postings.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (jobId) => {
    if (!confirm('Delete this job posting? This cannot be undone.')) return;
    try {
      await api.delete(`/recruiter/jobs/${jobId}`);
      setJobs(jobs.filter(j => j.id !== jobId));
    } catch {
      setError('Could not delete this posting.');
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <p className="eyebrow">Recruiter</p>
            <h1 style={{ marginBottom: 0 }}>My job postings</h1>
          </div>
          <Link className="btn btn-primary" to="/recruiter/post-job">+ Post a job</Link>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <p style={{ color: 'var(--text-muted)', marginTop: 24 }}>Loading…</p>
        ) : jobs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', marginTop: 24 }}>You haven't posted any jobs yet.</p>
        ) : (
          <div className="job-list" style={{ marginTop: 24 }}>
            {jobs.map((job) => (
              <div className="job-card" key={job.id}>
                <div>
                  <h3>{job.title}</h3>
                  <p className="job-meta">{job.location}{job.jobType ? ` · ${job.jobType.replaceAll('_', ' ')}` : ''}</p>
                  <p className="job-meta">{job.applicantCount ?? 0} applicant{job.applicantCount === 1 ? '' : 's'}</p>
                </div>
                <div className="job-actions">
                  <Link className="btn btn-ghost" to={`/recruiter/jobs/${job.id}/applicants`}>View applicants</Link>
                  <Link className="btn btn-ghost" to={`/recruiter/post-job/${job.id}`}>Edit</Link>
                  <button className="btn btn-ghost" onClick={() => handleDelete(job.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
