import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', location: '', jobType: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyingId, setApplyingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchJobs = async (params = filters) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/jobs', { params });
      setJobs(data);
    } catch {
      setError('Could not load jobs right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []); // eslint-disable-line

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(filters);
  };

  const handleApply = async (jobId) => {
    setApplyingId(jobId);
    setMessage('');
    try {
      await api.post(`/jobseeker/jobs/${jobId}/apply`);
      setJobs(jobs.map(j => j.id === jobId ? { ...j, alreadyApplied: true } : j));
      setMessage('Application submitted!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not apply to this job.');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="dashboard">
        <p className="eyebrow">Job Seeker</p>
        <h1>Find your next role</h1>

        <form className="filter-bar" onSubmit={handleSearch}>
          <input name="keyword" placeholder="Title, skill or company" value={filters.keyword} onChange={handleFilterChange} />
          <input name="location" placeholder="Location" value={filters.location} onChange={handleFilterChange} />
          <select name="jobType" value={filters.jobType} onChange={handleFilterChange}>
            <option value="">Any type</option>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="CONTRACT">Contract</option>
            <option value="REMOTE">Remote</option>
          </select>
          <button className="btn btn-primary" type="submit">Search</button>
        </form>

        {message && <div className="info-banner">{message}</div>}
        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading jobs…</p>
        ) : jobs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No jobs match your search yet.</p>
        ) : (
          <div className="job-list">
            {jobs.map((job) => (
              <div className="job-card" key={job.id}>
                <div>
                  <h3>{job.title}</h3>
                  <p className="job-meta">{job.companyName} · {job.location}{job.jobType ? ` · ${job.jobType.replaceAll('_', ' ')}` : ''}</p>
                  <p className="job-desc">{job.description}</p>
                  {job.skillsRequired && <p className="job-meta">Skills: {job.skillsRequired}</p>}
                  {job.salaryRange && <p className="job-meta">Salary: {job.salaryRange}</p>}
                </div>
                <div className="job-actions">
                  <Link className="btn btn-ghost" to={`/jobs/${job.id}`}>View</Link>
                  <button
                    className="btn btn-primary"
                    disabled={job.alreadyApplied || applyingId === job.id}
                    onClick={() => handleApply(job.id)}
                  >
                    {job.alreadyApplied ? 'Applied' : applyingId === job.id ? 'Applying…' : 'Apply'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
