import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="brand">Job<span>Bridge</span></div>
      <nav>
        {user && <span className="pill">{user.role === 'RECRUITER' ? 'Recruiter' : 'Job Seeker'}</span>}
        <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{user?.email}</span>
        <Link className="btn btn-ghost" to="/profile">Profile</Link>
        <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
      </nav>
    </div>
  );
}
