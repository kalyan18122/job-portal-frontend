import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      navigate(data.role === 'RECRUITER' ? '/recruiter' : '/jobseeker');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not sign in. Check your credentials.');
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
            "The right role is out there. JobBridge just makes it easier to find each other."
          </p>
          <p className="quote-attribution">— Built for job seekers and recruiters alike</p>
        </div>
      </div>
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <p className="subtitle">Sign in to continue to your dashboard.</p>

          {error && <div className="error-banner">{error}</div>}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required value={form.password} onChange={handleChange} placeholder="••••••••" />
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="form-footer">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
