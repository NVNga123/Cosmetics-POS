
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
    if (isAuthenticated && user) {
      const userIsAdmin = isAdmin();
      const userIsUser = isUser();
      
      setTimeout(() => {
        if (userIsAdmin) {
          navigate('/admin/dashboard', { replace: true });
        } else if (userIsUser) {
          navigate('/user/home', { replace: true });
        } else {
          setError('Tài khoản không có quyền truy cập hợp lệ');
        }
      }, 200);
    }
  }, [isAuthenticated, user, navigate, isAdmin, isUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
          (error as { message?: string }).message || 
          'Đăng nhập thất bại. Vui lòng thử lại!'
        : 'Đăng nhập thất bại. Vui lòng thử lại!';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e1e8ed',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'all 0.3s ease',
    backgroundColor: '#f8fafc'
  };

  const inputFocusStyle = {
    borderColor: '#667eea',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
  };

  return (
    <div style={{
      padding: '2rem',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '24px'
        }}>
          🔐
        </div>
        <h1 style={{ 
          color: '#1a202c', 
          margin: 0, 
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '8px'
        }}>
          Chào mừng trở lại!
        </h1>
        <p style={{ 
          color: '#64748b', 
          margin: 0,
          fontSize: '16px'
        }}>
          Đăng nhập để truy cập hệ thống POS
        </p>
      </div>
      
      {/* Error Message */}
      {error && (
        <div style={{ 
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', 
          color: '#dc2626', 
          padding: '12px 16px', 
          borderRadius: '12px', 
          marginBottom: '1.5rem',
          border: '1px solid #fca5a5',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ flex: 1 }}>
        {/* Username Input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            textAlign: 'left',
            display: 'block',
            marginBottom: '8px',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            👤 Tên đăng nhập
          </label>
          <input
            type="text"
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e8ed';
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            textAlign: 'left',
            display: 'block',
            marginBottom: '8px',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            🔒 Mật khẩu
          </label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e8ed';
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '14px',
            background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)',
            transform: loading ? 'none' : 'translateY(0)',
            marginBottom: '1.5rem'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff40',
                borderTop: '2px solid #ffffff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></span>
              Đang đăng nhập...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              🚀 Đăng nhập
            </span>
          )}
        </button>

        {/* Register Link */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Chưa có tài khoản?{' '}
            <a 
              href="/auth/register" 
              style={{ 
                color: '#667eea', 
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#5a67d8'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#667eea'}
            >
              Đăng ký ngay
            </a>
          </p>
        </div>
      </form>

      {/* Test Accounts */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '16px', 
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
        borderRadius: '12px',
        border: '1px solid #bae6fd'
      }}>
        <div style={{ 
          fontSize: '12px',
          color: '#0369a1',
          fontWeight: '600',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          🧪 Tài khoản test
        </div>
        <div style={{ fontSize: '12px', color: '#0c4a6e', lineHeight: '1.4' }}>
          <div style={{ marginBottom: '4px' }}>
            👑 <strong>Admin:</strong> <code style={{ background: '#ffffff', padding: '2px 6px', borderRadius: '4px' }}>admin</code> / <code style={{ background: '#ffffff', padding: '2px 6px', borderRadius: '4px' }}>admin</code>
          </div>
          <div>
            👤 <strong>User:</strong> <code style={{ background: '#ffffff', padding: '2px 6px', borderRadius: '4px' }}>tuandang111</code> / <code style={{ background: '#ffffff', padding: '2px 6px', borderRadius: '4px' }}>123456</code>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};