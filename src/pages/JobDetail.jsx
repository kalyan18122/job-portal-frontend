import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => setJob(data))
      .catch(() => setError('This job could not be found.'));
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setMessage('');
    try {
      await api.post(`/jobseeker/jobs/${id}/apply`);
      setJob({ ...job, alreadyApplied: true });
      setMessage('Application submitted!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not apply to this job.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="dashboard" style={{ maxWidth: 720 }}>
        <button className="btn btn-ghost" style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>← Back</button>

        {error && <div className="error-banner">{error}</div>}
        {message && <div className="info-banner">{message}</div>}

        {job && (
          <>
            <h1 style={{ marginBottom: 6 }}>{job.title}</h1>
            <p className="job-meta" style={{ marginBottom: 24 }}>
              {job.companyName} · {job.location}{job.jobType ? ` · ${job.jobType.replaceAll('_', ' ')}` : ''}
            </p>

            <div className="info-card" style={{ marginBottom: 20 }}>
              <h3>Description</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>
            </div>

            {job.skillsRequired && (
              <div className="info-card" style={{ marginBottom: 20 }}>
                <h3>Skills required</h3>
                <p>{job.skillsRequired}</p>
              </div>
            )}

            {job.salaryRange && (
              <div className="info-card" style={{ marginBottom: 20 }}>
                <h3>Salary range</h3>
                <p>{job.salaryRange}</p>
              </div>
            )}

            {user?.role === 'JOB_SEEKER' && (
              <button
                className="btn btn-primary"
                disabled={job.alreadyApplied || applying}
                onClick={handleApply}
              >
                {job.alreadyApplied ? 'Already applied' : applying ? 'Applying…' : 'Apply for this job'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
