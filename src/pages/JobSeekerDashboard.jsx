import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function JobSeekerDashboard() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Navbar />
      <div className="dashboard">
        <p className="eyebrow">Job Seeker</p>
        <h1>Welcome, {user?.fullName?.split(' ')[0] || 'there'}</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: 560 }}>
          Search open roles, apply in a click, and track every application from here.
        </p>
        <div className="card-grid">
          <Link to="/jobs" className="info-card">
            <h3>Search jobs</h3>
            <p>Browse open roles filtered by skill, location and job type.</p>
          </Link>
          <Link to="/jobseeker/applications" className="info-card">
            <h3>My applications</h3>
            <p>Track the status of every job you've applied to in one place.</p>
          </Link>
          <Link to="/profile" className="info-card">
            <h3>Profile & resume</h3>
            <p>Keep your profile and resume current so recruiters can find you.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
