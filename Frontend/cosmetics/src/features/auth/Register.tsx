import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
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
    } catch (error: any) {
      setError(error.response?.data?.message || 'Đăng ký thất bại');
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
    <form onSubmit={handleSubmit}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#333', margin: 0 }}>📝 Đăng ký tài khoản</h2>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>Tạo tài khoản mới</p>
      </div>
      
      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '0.75rem', 
          borderRadius: '4px', 
          marginBottom: '1rem',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <input
          name="username"
          type="text"
          placeholder="Tên đăng nhập"
          value={formData.username}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #ddd',
            borderRadius: '6px',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #ddd',
            borderRadius: '6px',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          name="firstName"
          type="text"
          placeholder="Họ"
          value={formData.firstName}
          onChange={handleChange}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '2px solid #ddd',
            borderRadius: '6px',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        <input
          name="lastName"
          type="text"
          placeholder="Tên"
          value={formData.lastName}
          onChange={handleChange}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '2px solid #ddd',
            borderRadius: '6px',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #ddd',
            borderRadius: '6px',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '0.75rem',
          background: loading ? '#ccc' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '⏳ Đang đăng ký...' : '🎉 Đăng ký'}
      </button>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <a href="/auth/login" style={{ 
          color: '#007bff', 
          textDecoration: 'none',
          fontSize: '0.9rem'
        }}>
          Đã có tài khoản? Đăng nhập ngay
        </a>
      </div>
    </form>
  );
};