import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';

export const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/user/home', label: 'Trang chủ' },
    { path: '/user/products', label: 'Sản phẩm' },
    { path: '/user/sales', label: 'Bán hàng' },
    { path: '/user/cart', label: 'Giỏ hàng' },
    { path: '/user/orders', label: 'Đơn hàng' },
    { path: '/user/profile', label: 'Thông tin' },
  ];

  return (
    <header style={{ 
      background: '#3C95FB', 
      padding: '0.25rem 1rem',
      borderBottom: '1px solid #007bff',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      width: '100%',
      height: '50px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-start', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        height: '100%',
        gap: '2rem'
      }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/user" style={{ textDecoration: 'none', color: '#f0f0f0' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', lineHeight: '1', verticalAlign: 'middle' }}> Cosmetics POS</h2>
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  textDecoration: 'none',
                  color: location.pathname === item.path ? '#ffffff' : '#ffffff',
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  background: location.pathname === item.path ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  fontSize: '1.0rem',
                  lineHeight: '1',
                  verticalAlign: 'middle'
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '100%' }}>
          <span style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: '1', verticalAlign: 'middle' }}>👋 {user?.username || 'User'}</span>
          <button 
            onClick={logout}
            style={{ 
              padding: '0.25rem 0.5rem',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              lineHeight: '1',
              verticalAlign: 'middle'
            }}
          >
            Đăng xuất
          </button>
          </div>
        </div>
      </div>
    </header>
  );
};