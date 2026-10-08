import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Profile() {
  const { user } = useAuth();
  const isRecruiter = user?.role === 'RECRUITER';

  const [form, setForm] = useState({ fullName: '', skills: '', resumeUrl: '', companyName: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/users/me')
      .then(({ data }) => setForm({
        fullName: data.fullName || '',
        skills: data.skills || '',
        resumeUrl: data.resumeUrl || '',
        companyName: data.companyName || '',
      }))
      .catch(() => setError('Could not load your profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    setSaving(true);
    try {
      await api.put('/users/me', form);
      setSaved(true);
    } catch (err) {
      const message = err.response?.data?.message
        || Object.values(err.response?.data || {})[0]
        || 'Could not save your profile.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="dashboard" style={{ maxWidth: 560 }}>
        <p className="eyebrow">{isRecruiter ? 'Recruiter' : 'Job Seeker'}</p>
        <h1>Your profile</h1>

        {error && <div className="error-banner">{error}</div>}
        {saved && <div className="info-banner">Profile updated.</div>}

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Full name</label>
              <input name="fullName" required value={form.fullName} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={user?.email || ''} disabled style={{ background: '#f4f1ea', color: 'var(--text-muted)' }} />
            </div>

            {isRecruiter ? (
              <div className="field">
                <label>Company name</label>
                <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Acme Inc." />
              </div>
            ) : (
              <>
                <div className="field">
                  <label>Skills</label>
                  <input name="skills" value={form.skills} onChange={handleChange} placeholder="React, Java, SQL" />
                </div>
                <div className="field">
                  <label>Resume link</label>
                  <input name="resumeUrl" value={form.resumeUrl} onChange={handleChange} placeholder="https://drive.google.com/…" />
                </div>
              </>
            )}

            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
