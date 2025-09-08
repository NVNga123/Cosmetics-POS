import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';

export const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/user/home', label: 'Trang chủ' },
    { path: '/user/products', label: 'Sản phẩm' },
    { path: '/user/cart', label: 'Giỏ hàng' },
    { path: '/user/orders', label: 'Đơn hàng' },
    { path: '/user/profile', label: 'Thông tin' },
  ];

  return (
    <header style={{ 
      background: '#fff', 
      padding: '1rem 2rem',
      borderBottom: '2px solid #007bff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div className="logo">
          <Link to="/user" style={{ textDecoration: 'none', color: '#007bff' }}>
            <h2 style={{ margin: 0 }}>💄 Cosmetics POS</h2>
          </Link>
        </div>

        <nav style={{ display: 'flex', gap: '2rem' }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                color: location.pathname === item.path ? '#007bff' : '#333',
                fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                background: location.pathname === item.path ? '#e7f3ff' : 'transparent'
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#666' }}>👋 {user?.username || 'User'}</span>
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
      </div>
    </header>
  );
};