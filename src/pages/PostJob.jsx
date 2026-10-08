import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const emptyForm = {
  title: '', description: '', companyName: '', location: '',
  jobType: 'FULL_TIME', skillsRequired: '', salaryRange: '',
};

export default function PostJob() {
  const { id } = useParams(); // present when editing
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/jobs/${id}`).then(({ data }) => {
        setForm({
          title: data.title,
          description: data.description,
          companyName: data.companyName,
          location: data.location,
          jobType: data.jobType || 'FULL_TIME',
          skillsRequired: data.skillsRequired || '',
          salaryRange: data.salaryRange || '',
        });
      });
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (id) {
        await api.put(`/recruiter/jobs/${id}`, form);
      } else {
        await api.post('/recruiter/jobs', form);
      }
      navigate('/recruiter/postings');
    } catch (err) {
      const message = err.response?.data?.message
        || Object.values(err.response?.data || {})[0]
        || 'Could not save this job posting.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <div className="dashboard" style={{ maxWidth: 640 }}>
        <p className="eyebrow">Recruiter</p>
        <h1>{id ? 'Edit job posting' : 'Post a new job'}</h1>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Job title</label>
            <input name="title" required value={form.title} onChange={handleChange} placeholder="Frontend Engineer" />
          </div>
          <div className="field">
            <label>Company name</label>
            <input name="companyName" required value={form.companyName} onChange={handleChange} placeholder="Acme Inc." />
          </div>
          <div className="field">
            <label>Location</label>
            <input name="location" required value={form.location} onChange={handleChange} placeholder="Hyderabad / Remote" />
          </div>
          <div className="field">
            <label>Job type</label>
            <select name="jobType" value={form.jobType} onChange={handleChange}>
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>
          <div className="field">
            <label>Skills required</label>
            <input name="skillsRequired" value={form.skillsRequired} onChange={handleChange} placeholder="React, Node.js, SQL" />
          </div>
          <div className="field">
            <label>Salary range (optional)</label>
            <input name="salaryRange" value={form.salaryRange} onChange={handleChange} placeholder="₹8–12 LPA" />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea name="description" required rows={6} value={form.description} onChange={handleChange} placeholder="Role responsibilities, requirements, benefits…" />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Saving…' : id ? 'Save changes' : 'Publish job'}
          </button>
        </form>
      </div>
    </div>
  );
}
