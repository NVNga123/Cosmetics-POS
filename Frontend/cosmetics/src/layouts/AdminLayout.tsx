import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Sản phẩm', icon: '🛍️' },
    { path: '/admin/orders', label: 'Đơn hàng', icon: '📦' },
    { path: '/admin/users', label: 'Người dùng', icon: '👥' },
  ];

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ 
        width: '250px', 
        background: '#1a1a1a', 
        color: 'white',
        padding: '1rem'
      }}>
        <div className="admin-logo" style={{ marginBottom: '2rem' }}>
          <h2>Admin Panel</h2>
        </div>
        
        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'block',
                padding: '0.75rem 1rem',
                color: location.pathname === item.path ? '#007bff' : 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                background: location.pathname === item.path ? '#333' : 'transparent'
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="admin-content" style={{ flex: 1 }}>
        {/* Header */}
        <header className="admin-header" style={{ 
          background: 'white', 
          padding: '1rem 2rem',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: '250px',
          right: 0,
          zIndex: 999
        }}>
          <h1>Quản trị hệ thống</h1>
          <div className="admin-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Xin chào, {user?.username || 'Admin'}</span>
            <button 
              onClick={logout}
              style={{ 
                padding: '0.5rem 1rem',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-main" style={{ padding: '2rem', marginTop: '30px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};