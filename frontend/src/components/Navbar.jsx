import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: '18px', color: '#4f46e5', textDecoration: 'none' }}>
          TaskFlow
        </Link>
        <Link to="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>Dashboard</Link>
        <Link to="/projects" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>Projects</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '14px', color: '#374151' }}>
          {user?.name} <span style={{ background: '#ede9fe', color: '#4f46e5', padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 600 }}>{user?.role}</span>
        </span>
        <button className="btn btn-outline" onClick={handleLogout} style={{ fontSize: '13px', padding: '6px 12px' }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
