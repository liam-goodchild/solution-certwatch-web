import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh' }}>
      <nav style={{ background: '#1a1a2e', color: '#fff', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>CertWatch</span>
        <Link to="/" style={{ color: '#ccc', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/certifications" style={{ color: '#ccc', textDecoration: 'none' }}>Certifications</Link>
        <Link to="/settings" style={{ color: '#ccc', textDecoration: 'none' }}>Settings</Link>
        <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: '#aaa' }}>
          {user.userDetails}
        </span>
        <a href="/logout" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.875rem' }}>Sign out</a>
      </nav>
      <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
