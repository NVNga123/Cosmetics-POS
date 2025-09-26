import React, { useEffect, useState } from "react";
import { orderApi } from "../api/orderApi";
import type { Order } from "../types/order";
import { OrderDetailModal } from "../features/orders/components/OrderDetailModal";

export const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [filterCount, setFilterCount] = useState(2);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

        const fetchOrders = async () => {
            try {
            setLoading(true);
            setError(null);
            console.log('Fetching orders...');
                const data = await orderApi.getAll();
            console.log('Orders received:', data);
            setOrders(data || []);
            } catch (err: any) {
            console.error('Error fetching orders:', err);
            const errorMessage = err.response?.data?.message || err.message || "Lỗi khi tải đơn hàng";
            setError(errorMessage);
            setOrders([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        fetchOrders();
    }, []);

    const statusTabs = [
        { key: "all", label: "Tất cả" },
        { key: "incomplete", label: "Chưa hoàn thành" },
        { key: "completed", label: "Đã hoàn thành" },
        { key: "cancelled", label: "Đã hủy" },
        { key: "return", label: "Trả hàng" },
        { key: "returned", label: "Bị trả hàng" },
        { key: "merged", label: "Đơn gộp" },
        { key: "split", label: "Đơn tách" },
        { key: "replace", label: "Thay thế" }
    ];

    const getStatusText = (status: string) => {
        switch (status.toUpperCase()) {
            case 'NEW':
                return 'Mới';
            case 'PENDING':
                return 'Chờ xử lý';
            case 'PROCESSING':
                return 'Đang xử lý';
            case 'COMPLETED':
                return 'Đã hoàn thành';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'NEW':
                return '#3b82f6';
            case 'COMPLETED':
                return '#10b981';
            case 'PENDING':
                return '#f59e0b';
            case 'CANCELLED':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             order.orderId.toString().includes(searchTerm);
        const matchesStatus = selectedStatus === "all" || order.status.toLowerCase() === selectedStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải danh sách đơn hàng...</p>
        </div>
    );
    
    if (error) return (
        <div className="error-container">
            <div className="error-content">
                <h3>❌ Lỗi tải dữ liệu</h3>
                <p style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</p>
                <button className="btn btn-primary" onClick={fetchOrders}>
                    <span className="icon">🔄</span>
                    Thử lại
                </button>
            </div>
        </div>
    );

    return (
        <div className="orders-page">
            {/* Header */}
            <div className="orders-header">
            <h1>Danh sách đơn hàng</h1>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={fetchOrders} disabled={loading}>
                        <span className="icon">🔄</span>
                        {loading ? 'Đang tải...' : 'Làm mới'}
                    </button>
                    <button className="btn btn-primary">
                        <span className="icon">+</span>
                        Thêm ĐH
                    </button>
                    <button className="btn btn-primary">
                        <span className="icon">📊</span>
                        Xuất Excel
                        <span className="dropdown-arrow">▼</span>
                    </button>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="status-tabs">
                {statusTabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`tab ${selectedStatus === tab.key ? 'active' : ''}`}
                        onClick={() => setSelectedStatus(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search and Filter Bar */}
            <div className="search-filter-bar">
                <div className="search-container">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Tên KH, mã ĐH, mã CQT"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-actions">
                    <button className="filter-btn">
                        <span className="icon">⚙️</span>
                    </button>
                    <button className="filter-btn">
                        <span className="icon">🔽</span>
                        <span className="badge">{filterCount}</span>
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                    <tr>
                            <th>STT</th>
                            <th>Mã đơn hàng</th>
                            <th>Thông tin KH</th>
                            <th>Ngày tạo</th>
                            <th>Mã cơ quan thuế</th>
                        <th>Tổng tiền</th>
                            <th>Hình thức TT</th>
                        <th>Trạng thái</th>
                            <th>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={9} style={{ textAlign: 'center', padding: '40px' }}>
                                    <div className="empty-state">
                                        <div className="empty-icon">📦</div>
                                        <h3>Chưa có đơn hàng nào</h3>
                                        <p>Khi có đơn hàng mới, chúng sẽ xuất hiện ở đây.</p>
                                        <button className="btn btn-primary" onClick={fetchOrders}>
                                            <span className="icon">🔄</span>
                                            Làm mới
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order, index) => (
                        <tr key={order.orderId}>
                                <td>{index + 1}</td>
                                <td>{order.code}</td>
                                <td>
                                    <div className="customer-info">
                                        <span>Tên khách hàng: {order.customerName || 'Khách lẻ'}</span>
                                        <span className="link-icon">🔗</span>
                                    </div>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td></td>
                                <td>{formatPrice(order.total)}</td>
                                <td>TM/CK</td>
                                <td>
                                    <span 
                                        className="status-badge"
                                        style={{ color: getStatusColor(order.status) }}
                                    >
                                        {getStatusText(order.status)}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className="action-btn" 
                                            onClick={() => handleViewOrder(order)}
                                            title="Xem chi tiết"
                                        >
                                            👁️
                                        </button>
                                        <button className="action-btn" title="Chỉnh sửa">✏️</button>
                                        <button className="action-btn" title="Thêm tùy chọn">⋮</button>
                                    </div>
                                </td>
                        </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Detail Modal */}
            <OrderDetailModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />

            <style jsx>{`
                .orders-page {
                    padding: 20px;
                    background: #f8fafc;
                    min-height: 100vh;
                }

                .orders-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    position: sticky;
                    top: 50px;
                    background: #f8fafc;
                    z-index: 99;
                    padding: 10px 0;
                }

                .orders-header h1 {
                    color: #2563eb;
                    font-size: 24px;
                    font-weight: 600;
                    margin: 0;
                }

                .header-actions {
                    display: flex;
                    gap: 12px;
                }

                .btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .btn-primary {
                    background: #2563eb;
                    color: white;
                }

                .btn-primary:hover {
                    background: #1d4ed8;
                }

                .btn-secondary {
                    background: #6b7280;
                    color: white;
                }

                .btn-secondary:hover:not(:disabled) {
                    background: #4b5563;
                }

                .btn-secondary:disabled {
                    background: #9ca3af;
                    cursor: not-allowed;
                }

                .icon {
                    font-size: 16px;
                }

                .dropdown-arrow {
                    font-size: 10px;
                    margin-left: 4px;
                }

                .status-tabs {
                    display: flex;
                    gap: 0;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #e5e7eb;
                    position: sticky;
                    top: 100px;
                    background: #f8fafc;
                    z-index: 98;
                    padding: 5px 0;
                }

                .tab {
                    padding: 12px 20px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 14px;
                    color: #6b7280;
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s;
                }

                .tab:hover {
                    color: #2563eb;
                }

                .tab.active {
                    color: #2563eb;
                    border-bottom-color: #2563eb;
                    font-weight: 500;
                }

                .search-filter-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding: 16px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    position: sticky;
                    top: 150px;
                    z-index: 97;
                }

                .search-container {
                    position: relative;
                    flex: 1;
                    max-width: 400px;
                }

                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6b7280;
                }

                .search-input {
                    width: 100%;
                    padding: 10px 12px 10px 40px;
                    border: 1px solid #9ca3af;
                    border-radius: 6px;
                    font-size: 14px;
                    background: white;
                    color: #000000;
                }

                .search-input:focus {
                    outline: none;
                    border-color: #6b7280;
                    box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
                }

                .filter-actions {
                    display: flex;
                    gap: 8px;
                }

                .filter-btn {
                    width: 40px;
                    height: 40px;
                    border: 1px solid #d1d5db;
                    background: white;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }

                .filter-btn:hover {
                    background: #f9fafb;
                }

                .badge {
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    background: #ef4444;
                    color: white;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    font-size: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .orders-table-container {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .orders-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .orders-table th {
                    background: #f8fafc;
                    padding: 12px 16px;
                    text-align: left;
                    font-weight: 600;
                    color: #374151;
                    border-bottom: 1px solid #e5e7eb;
                    font-size: 14px;
                }

                .orders-table td {
                    padding: 12px 16px;
                    border-bottom: 1px solid #f3f4f6;
                    font-size: 14px;
                    color: #374151;
                }

                .orders-table tr:hover {
                    background: #f9fafb;
                }

                .customer-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .link-icon {
                    font-size: 12px;
                    color: #6b7280;
                }

                .status-badge {
                    font-weight: 500;
                }

                .action-buttons {
                    display: flex;
                    gap: 4px;
                }

                .action-btn {
                    width: 28px;
                    height: 28px;
                    border: 1px solid #d1d5db;
                    background: white;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                }

                .action-btn:hover {
                    background: #f3f4f6;
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 20px;
                }

                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #e5e7eb;
                    border-top: 4px solid #2563eb;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 16px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .error-container {
                    padding: 40px 20px;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    text-align: center;
                    max-width: 500px;
                    margin: 40px auto;
                }

                .error-content h3 {
                    margin: 0 0 12px 0;
                    color: #dc2626;
                    font-size: 18px;
                }

                .error-content p {
                    margin: 0 0 16px 0;
                    font-size: 14px;
                    line-height: 1.5;
                }

                .empty-state {
                    text-align: center;
                    padding: 20px;
                }

                .empty-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                }

                .empty-state h3 {
                    margin: 0 0 8px 0;
                    color: #374151;
                    font-size: 18px;
                }

                .empty-state p {
                    margin: 0 0 16px 0;
                    color: #6b7280;
                    font-size: 14px;
                }

                @media (max-width: 768px) {
                    .orders-page {
                        padding: 16px;
                    }

                    .orders-header {
                        flex-direction: column;
                        gap: 16px;
                        align-items: flex-start;
                    }

                    .status-tabs {
                        overflow-x: auto;
                        white-space: nowrap;
                    }

                    .search-filter-bar {
                        flex-direction: column;
                        gap: 12px;
                    }

                    .search-container {
                        max-width: none;
                    }

                    .orders-table-container {
                        overflow-x: auto;
                    }
                }
            `}</style>
        </div>
    );
};
