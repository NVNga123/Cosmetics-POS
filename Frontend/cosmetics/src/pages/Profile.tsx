import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [storeInfo, setStoreInfo] = useState({
        storeName: 'Cửa hàng Mỹ phẩm Beauty Store',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        phone: '0123 456 789',
        email: 'beautystore@email.com',
        website: 'www.beautystore.com',
        establishedYear: '2020',
        businessHours: '8:00 - 22:00',
        description: 'Chuyên cung cấp các sản phẩm mỹ phẩm chính hãng, chất lượng cao với giá cả hợp lý.',
        specialties: [
            'Mỹ phẩm cao cấp',
            'Chăm sóc da',
            'Trang điểm',
            'Nước hoa'
        ]
    });

    const [stats, setStats] = useState({
        totalOrders: 1250,
        totalRevenue: 125000000,
        totalProducts: 150,
        customerCount: 850
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(storeInfo);

    const handleEdit = () => {
        setIsEditing(true);
        setEditForm(storeInfo);
    };

    const handleSave = () => {
        setStoreInfo(editForm);
        setIsEditing(false);
        alert('✅ Thông tin cửa hàng đã được cập nhật!');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm(storeInfo);
    };

    const handleInputChange = (field: string, value: string) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="profile-page">
            {/* Header */}
            <div className="profile-header">
                <div className="header-content">
                    <h1>Thông tin cửa hàng</h1>
                    <p>Quản lý thông tin và cài đặt cửa hàng</p>
                </div>
                <div className="header-actions">
                    <button 
                        className="btn btn-outline"
                        onClick={() => navigate('/user/home')}
                    >
                        ← Về trang chủ
                    </button>
                </div>
            </div>

            {/* Store Info Card */}
            <div className="store-info-card">
                <div className="card-header">
                    <h2>🏪 Thông tin cửa hàng</h2>
                    {!isEditing && (
                        <button className="btn btn-primary" onClick={handleEdit}>
                            ✏️ Chỉnh sửa
                        </button>
                    )}
                </div>

                <div className="card-content">
                    {isEditing ? (
                        <div className="edit-form">
                            <div className="form-group">
                                <label>Tên cửa hàng</label>
                                <input
                                    type="text"
                                    value={editForm.storeName}
                                    onChange={(e) => handleInputChange('storeName', e.target.value)}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Địa chỉ</label>
                                <input
                                    type="text"
                                    value={editForm.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Số điện thoại</label>
                                    <input
                                        type="text"
                                        value={editForm.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Website</label>
                                    <input
                                        type="text"
                                        value={editForm.website}
                                        onChange={(e) => handleInputChange('website', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Năm thành lập</label>
                                    <input
                                        type="text"
                                        value={editForm.establishedYear}
                                        onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Giờ hoạt động</label>
                                <input
                                    type="text"
                                    value={editForm.businessHours}
                                    onChange={(e) => handleInputChange('businessHours', e.target.value)}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Mô tả cửa hàng</label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={3}
                                />
                            </div>
                            
                            <div className="form-actions">
                                <button className="btn btn-success" onClick={handleSave}>
                                    💾 Lưu thay đổi
                                </button>
                                <button className="btn btn-outline" onClick={handleCancel}>
                                    ❌ Hủy
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="store-details">
                            <div className="store-main-info">
                                <h3>{storeInfo.storeName}</h3>
                                <p className="store-description">{storeInfo.description}</p>
                            </div>
                            
                            <div className="store-contact">
                                <div className="contact-item">
                                    <span className="icon">📍</span>
                                    <span>{storeInfo.address}</span>
                                </div>
                                <div className="contact-item">
                                    <span className="icon">📞</span>
                                    <span>{storeInfo.phone}</span>
                                </div>
                                <div className="contact-item">
                                    <span className="icon">✉️</span>
                                    <span>{storeInfo.email}</span>
                                </div>
                                <div className="contact-item">
                                    <span className="icon">🌐</span>
                                    <span>{storeInfo.website}</span>
                                </div>
                                <div className="contact-item">
                                    <span className="icon">🏢</span>
                                    <span>Thành lập năm {storeInfo.establishedYear}</span>
                                </div>
                                <div className="contact-item">
                                    <span className="icon">🕒</span>
                                    <span>Giờ hoạt động: {storeInfo.businessHours}</span>
                                </div>
                            </div>
                            
                            <div className="store-specialties">
                                <h4>Chuyên môn</h4>
                                <div className="specialties-list">
                                    {storeInfo.specialties.map((specialty, index) => (
                                        <span key={index} className="specialty-tag">
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-section">
                <h2>📊 Thống kê cửa hàng</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div className="stat-content">
                            <h3>{stats.totalOrders.toLocaleString()}</h3>
                            <p>Tổng đơn hàng</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-content">
                            <h3>{formatPrice(stats.totalRevenue)}</h3>
                            <p>Doanh thu tổng</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">🛍️</div>
                        <div className="stat-content">
                            <h3>{stats.totalProducts}</h3>
                            <p>Sản phẩm</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                            <h3>{stats.customerCount}</h3>
                            <p>Khách hàng</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
                <h2>⚡ Thao tác nhanh</h2>
                <div className="actions-grid">
                    <button 
                        className="action-card"
                        onClick={() => navigate('/user/sales')}
                    >
                        <div className="action-icon">🛒</div>
                        <div className="action-content">
                            <h3>Bán hàng</h3>
                            <p>Tạo đơn hàng mới</p>
                        </div>
                    </button>
                    
                    <button 
                        className="action-card"
                        onClick={() => navigate('/user/orders')}
                    >
                        <div className="action-icon">📋</div>
                        <div className="action-content">
                            <h3>Đơn hàng</h3>
                            <p>Quản lý đơn hàng</p>
                        </div>
                    </button>
                    
                    <button 
                        className="action-card"
                        onClick={() => navigate('/user/cart')}
                    >
                        <div className="action-icon">🛍️</div>
                        <div className="action-content">
                            <h3>Giỏ hàng</h3>
                            <p>Đơn hàng chưa hoàn thành</p>
                        </div>
                    </button>
                    
                    <button 
                        className="action-card"
                        onClick={() => navigate('/user/home')}
                    >
                        <div className="action-icon">🏠</div>
                        <div className="action-content">
                            <h3>Trang chủ</h3>
                            <p>Về trang chủ</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
