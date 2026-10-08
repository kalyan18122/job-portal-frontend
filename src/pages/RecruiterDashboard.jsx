import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function RecruiterDashboard() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Navbar />
      <div className="dashboard">
        <p className="eyebrow">Recruiter</p>
        <h1>Welcome, {user?.fullName?.split(' ')[0] || 'there'}</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: 560 }}>
          Post openings, review applicants, and move candidates through your pipeline.
        </p>
        <div className="card-grid">
          <Link to="/recruiter/post-job" className="info-card">
            <h3>Post a job</h3>
            <p>Publish a new opening with role details, requirements and salary range.</p>
          </Link>
          <Link to="/recruiter/postings" className="info-card">
            <h3>My postings & applicants</h3>
            <p>Review candidates who applied and move them through your pipeline.</p>
          </Link>
          <Link to="/profile" className="info-card">
            <h3>Company profile</h3>
            <p>Manage how your company appears to job seekers on the portal.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
