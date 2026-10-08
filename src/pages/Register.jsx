import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('JOB_SEEKER');
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', companyName: '', skills: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, role };
      const data = await register(payload);
      navigate(data.role === 'RECRUITER' ? '/recruiter' : '/jobseeker');
    } catch (err) {
      const message = err.response?.data?.message
        || Object.values(err.response?.data || {})[0]
        || 'Could not create your account.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-side">
        <div className="brand" style={{ color: '#fff' }}>Job<span style={{ color: '#fca311' }}>Bridge</span></div>
        <div>
          <p className="quote">
            "One platform, two sides of the same search — post a role, or find your next one."
          </p>
        </div>
      </div>
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Create your account</h2>
          <p className="subtitle">Tell us who you are and let's get you set up.</p>

          {error && <div className="error-banner">{error}</div>}

          <div className="role-toggle">
            <button type="button" className={role === 'JOB_SEEKER' ? 'active' : ''} onClick={() => setRole('JOB_SEEKER')}>
              Job Seeker
            </button>
            <button type="button" className={role === 'RECRUITER' ? 'active' : ''} onClick={() => setRole('RECRUITER')}>
              Recruiter
            </button>
          </div>

          <div className="field">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" name="fullName" required value={form.fullName} onChange={handleChange} placeholder="Jane Doe" />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required minLength={6} value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
          </div>

          {role === 'RECRUITER' ? (
            <div className="field">
              <label htmlFor="companyName">Company name</label>
              <input id="companyName" name="companyName" value={form.companyName} onChange={handleChange} placeholder="Acme Inc." />
            </div>
          ) : (
            <div className="field">
              <label htmlFor="skills">Key skills</label>
              <input id="skills" name="skills" value={form.skills} onChange={handleChange} placeholder="React, Java, SQL" />
            </div>
          )}

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="form-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
