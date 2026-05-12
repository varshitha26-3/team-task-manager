import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    const { data } = await api.get('/projects');
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/projects', form);
      setForm({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Projects</h1>
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Create New Project</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Project Name</label>
              <input placeholder="Enter project name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows="3" placeholder="Brief description..." value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary" type="submit">Create Project</button>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#9ca3af' }}>No projects yet. {user?.role === 'Admin' ? 'Create one above.' : 'Ask an admin to add you to a project.'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {projects.map(p => (
            <Link key={p._id} to={`/projects/${p._id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>{p.name}</h3>
                  <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '99px', background: p.status === 'Active' ? '#dcfce7' : '#f3f4f6', color: p.status === 'Active' ? '#166534' : '#374151' }}>
                    {p.status}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                  {p.description || 'No description'}
                </p>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  👤 {p.owner?.name} · {p.members?.length} member{p.members?.length !== 1 ? 's' : ''}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
