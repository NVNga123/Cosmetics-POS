
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthProvider';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, user, isAdmin, isUser, isAuthenticated } = useAuth();

  // Watch for authentication changes
  useEffect(() => {
    // console.log('LoginForm useEffect triggered:', { isAuthenticated, user });
    
    if (isAuthenticated && user) {
      const userIsAdmin = isAdmin();
      const userIsUser = isUser();
      
      // console.log('User authenticated, checking roles:', { 
      //   user, 
      //   userIsAdmin,
      //   userIsUser,
      //   roles: user.roles 
      // });
      
      // Small delay để đảm bảo state đã update hoàn toàn
      setTimeout(() => {
        if (userIsAdmin) {
          // console.log('Redirecting to admin dashboard');
          navigate('/admin/dashboard', { replace: true });
        } else if (userIsUser) {
          // console.log('Redirecting to user home');
          navigate('/user/home', { replace: true });
        } else {
          // console.log('User has no valid roles:', user.roles);
          setError('Tài khoản không có quyền truy cập hợp lệ');
        }
      }, 200); // Tăng delay lên 200ms
    }
  }, [isAuthenticated, user, navigate, isAdmin, isUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // console.log('Attempting login for:', username);
      await login(username, password);
      // console.log('Login completed, waiting for redirect...');
      // Redirect will be handled by useEffect above
    } catch (error: any) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Đăng nhập thất bại. Vui lòng thử lại!'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#333', margin: 0 }}>🔐 Đăng nhập</h2>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>Truy cập hệ thống POS</p>
      </div>
      
      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '0.75rem', 
          borderRadius: '4px', 
          marginBottom: '1rem',
          border: '1px solid #fcc',
          fontSize: '0.9rem'
        }}>
          ❌ {error}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="👤 Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #ddd',
            borderRadius: '6px',
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <input
          type="password"
          placeholder="🔒 Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #ddd',
            borderRadius: '6px',
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '0.75rem',
          background: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? '⏳ Đang đăng nhập...' : '🚀 Đăng nhập'}
      </button>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: '#f8f9fa', 
        borderRadius: '6px',
        fontSize: '0.85rem',
        color: '#666'
      }}>
        <strong>🧪 Tài khoản test:</strong><br />
        👑 Admin: <code>admin</code> / <code>admin</code><br />
        👤 User: <code>tuandang111</code> / <code>123456</code>
      </div>
    </form>
  );
};