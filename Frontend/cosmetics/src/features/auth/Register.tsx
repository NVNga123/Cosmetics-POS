import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      alert('✅ Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/auth/login');
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Đăng ký thất bại'
        : 'Đăng ký thất bại';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      padding: '3rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '600px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem'
        }}>
          ✨
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          margin: '0 0 0.5rem 0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Đăng ký tài khoản
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#64748b',
          margin: 0
        }}>
          Tạo tài khoản mới để bắt đầu
        </p>
      </div>
      
      {error && (
        <div style={{
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          border: '1px solid #fca5a5',
          fontSize: '0.95rem',
          fontWeight: '500'
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            name="username"
            type="text"
            placeholder="👤 Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              background: '#f8fafc'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.background = 'white';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.background = '#f8fafc';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <input
            name="email"
            type="email"
            placeholder="📧 Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              background: '#f8fafc'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.background = 'white';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.background = '#f8fafc';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input
            name="firstName"
            type="text"
            placeholder="👨 Họ"
            value={formData.firstName}
            onChange={handleChange}
            style={{
              flex: 1,
              padding: '1rem 1.25rem',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              background: '#f8fafc'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.background = 'white';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.background = '#f8fafc';
              e.target.style.boxShadow = 'none';
            }}
          />
          <input
            name="lastName"
            type="text"
            placeholder="👩 Tên"
            value={formData.lastName}
            onChange={handleChange}
            style={{
              flex: 1,
              padding: '1rem 1.25rem',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              background: '#f8fafc'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.background = 'white';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.background = '#f8fafc';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <input
            name="password"
            type="password"
            placeholder="🔒 Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              background: '#f8fafc'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.background = 'white';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.background = '#f8fafc';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            background: loading 
              ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: loading 
              ? 'none'
              : '0 4px 15px rgba(102, 126, 234, 0.4)',
            transform: loading ? 'none' : 'translateY(0)',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              const target = e.target as HTMLElement;
              target.style.transform = 'translateY(-2px)';
              target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              const target = e.target as HTMLElement;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }
          }}
        >
          {loading ? '⏳ Đang tạo tài khoản...' : '🎉 Tạo tài khoản'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Đã có tài khoản?{' '}
          </span>
          <a 
            href="/auth/login" 
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: '600',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#764ba2'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#667eea'}
          >
            Đăng nhập ngay →
          </a>
        </div>
      </form>
    </div>
  );
};

export const Register = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="register-container" style={{
        width: '100%',
        maxWidth: '1200px',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        display: 'flex',
        minHeight: '700px'
      }}>
        {/* Left Side - Register Form */}
        <div className="register-form" style={{
          flex: '1',
          padding: '0',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <RegisterForm />
        </div>

        {/* Right Side - Image (Hidden on mobile) */}
        <div className="register-image" style={{
          flex: '1',
          background: `linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%), url('https://i.pinimg.com/736x/f7/b6/7b/f7b67bfe4b19c7c48d7a73bd7dcf9e5c.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Overlay Content */}
          <div style={{
            textAlign: 'center',
            color: 'white',
            zIndex: 1,
            padding: '2rem'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '1rem'
            }}>
              🌟
            </div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              margin: '0 0 1rem 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Chào mừng bạn!
            </h2>
            <p style={{
              fontSize: '18px',
              margin: 0,
              opacity: 0.9,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}>
              Tham gia cùng chúng tôi và khám phá thế giới mỹ phẩm
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style>
        {`
          @media (max-width: 768px) {
            .register-container {
              flex-direction: column !important;
              max-width: 400px !important;
              min-height: auto !important;
            }
            .register-image {
              display: none !important;
            }
            .register-form {
              padding: 1.5rem !important;
            }
          }
          
          @media (max-width: 480px) {
            .register-container {
              margin: 10px !important;
              border-radius: 16px !important;
            }
          }
        `}
      </style>
    </div>
  );
};