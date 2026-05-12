import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          api.get('/tasks/my'),
          api.get('/projects'),
        ]);
        setTasks(tasksRes.data);
        setProjects(projectsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const now = new Date();
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Done');
  const inProgress = tasks.filter(t => t.status === 'In Progress');
  const done = tasks.filter(t => t.status === 'Done');
  const todo = tasks.filter(t => t.status === 'Todo');

  const statusBadge = (status) => {
    if (status === 'Todo') return <span className="badge badge-todo">Todo</span>;
    if (status === 'In Progress') return <span className="badge badge-inprogress">In Progress</span>;
    if (status === 'Done') return <span className="badge badge-done">Done</span>;
  };

  const priorityBadge = (p) => {
    if (p === 'High') return <span className="badge badge-high">High</span>;
    if (p === 'Medium') return <span className="badge badge-medium">Medium</span>;
    return <span className="badge badge-low">Low</span>;
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '4px' }}>
        Welcome, {user?.name} 👋
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '28px', fontSize: '15px' }}>Here's your overview</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'My Projects', value: projects.length, color: '#4f46e5', bg: '#ede9fe' },
          { label: 'In Progress', value: inProgress.length, color: '#1d4ed8', bg: '#dbeafe' },
          { label: 'Completed', value: done.length, color: '#166534', bg: '#dcfce7' },
          { label: 'Overdue', value: overdue.length, color: '#dc2626', bg: '#fee2e2' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* My Tasks */}
        <div className="card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>My Tasks</h2>
          {tasks.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>No tasks assigned to you yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tasks.slice(0, 6).map(task => (
                <div key={task._id} style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{task.title}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>{task.project?.name}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {priorityBadge(task.priority)}
                    {statusBadge(task.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600 }}>My Projects</h2>
            <Link to="/projects" style={{ fontSize: '13px', color: '#4f46e5', textDecoration: 'none' }}>View all →</Link>
          </div>
          {projects.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>No projects yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {projects.slice(0, 5).map(p => (
                <Link key={p._id} to={`/projects/${p._id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>{p.members?.length} members</div>
                    </div>
                    <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '99px', background: p.status === 'Active' ? '#dcfce7' : '#f3f4f6', color: p.status === 'Active' ? '#166534' : '#374151' }}>
                      {p.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overdue */}
      {overdue.length > 0 && (
        <div className="card" style={{ marginTop: '24px', borderLeft: '4px solid #ef4444' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#dc2626', marginBottom: '12px' }}>⚠️ Overdue Tasks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {overdue.map(task => (
              <div key={task._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>{task.title}</span>
                <span style={{ color: '#dc2626', fontSize: '12px' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
