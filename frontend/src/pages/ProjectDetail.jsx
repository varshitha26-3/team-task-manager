import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
  const [error, setError] = useState('');

  const fetchAll = async () => {
    try {
      const [projRes, tasksRes, usersRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?project=${id}`),
        api.get('/users'),
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/tasks', { ...taskForm, project: id });
      setTaskForm({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
      setShowTaskForm(false);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${taskId}`);
    fetchAll();
  };

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

  const columns = ['Todo', 'In Progress', 'Done'];

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  if (!project) return <div style={{ padding: '40px' }}>Project not found.</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700 }}>{project.name}</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>{project.description || 'No description'}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowTaskForm(!showTaskForm)}>
          {showTaskForm ? 'Cancel' : '+ Add Task'}
        </button>
      </div>

      {/* Task Form */}
      {showTaskForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>New Task</h2>
          <form onSubmit={handleCreateTask}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Task Title</label>
                <input placeholder="Enter task title" value={taskForm.title}
                  onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Description</label>
                <textarea rows="2" placeholder="Optional description" value={taskForm.description}
                  onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
              </div>
            </div>
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary" type="submit">Create Task</button>
          </form>
        </div>
      )}

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col);
          return (
            <div key={col}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                {statusBadge(col)}
                <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>{colTasks.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {colTasks.map(task => (
                  <div key={task._id} className="card" style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{task.title}</span>
                      {priorityBadge(task.priority)}
                    </div>
                    {task.description && <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>{task.description}</p>}
                    {task.assignedTo && (
                      <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
                        👤 {task.assignedTo.name}
                      </p>
                    )}
                    {task.dueDate && (
                      <p style={{ fontSize: '12px', color: new Date(task.dueDate) < new Date() && task.status !== 'Done' ? '#dc2626' : '#9ca3af', marginBottom: '8px' }}>
                        📅 {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                      {columns.filter(s => s !== col).map(s => (
                        <button key={s} className="btn btn-outline"
                          style={{ fontSize: '11px', padding: '4px 8px' }}
                          onClick={() => updateTaskStatus(task._id, s)}>
                          → {s}
                        </button>
                      ))}
                      {user?.role === 'Admin' && (
                        <button className="btn btn-danger" style={{ fontSize: '11px', padding: '4px 8px' }}
                          onClick={() => deleteTask(task._id)}>
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#d1d5db', fontSize: '13px', border: '2px dashed #e5e7eb', borderRadius: '8px' }}>
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
