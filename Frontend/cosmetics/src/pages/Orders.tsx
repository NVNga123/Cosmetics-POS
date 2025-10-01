import React, { useEffect, useState } from "react";
import { orderApi } from "../api/orderApi";
import type { Order } from "../types/order";
import { OrderDetailModal } from "../features/orders/components/OrderDetailModal";
import "./Orders.css";
import { useNavigate } from "react-router-dom";

export const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("Fetching orders...");
            const data = await orderApi.getAll();
            console.log("Orders received:", data);
            setOrders(data || []);
        } catch (err: any) {
            console.error("Error fetching orders:", err);
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                "Lỗi khi tải đơn hàng";
            setError(errorMessage);
            setOrders([]);
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
        { key: "replace", label: "Thay thế" },
    ];

    const getStatusText = (status: string) => {
        switch (status.toUpperCase()) {
            case "RETURNED":
                return "Đã trả hàng";
            case "COMPLETED":
                return "Đã hoàn thành";
            case "CANCELLED":
                return "Đã hủy";
            case "DRAFT":
                return "Chưa hoàn thành";
            default:
                return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case "COMPLETED":
                return "#10b981";
            case "RETURNED":
                return "#f59e0b";
            case "CANCELLED":
                return "#ef4444";
            case "DRAFT":
                return "#6b7280";
            default:
                return "#6b7280";
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN").format(price);
    };

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderId.toString().includes(searchTerm);
        const matchesStatus =
            selectedStatus === "all" ||
            order.status.toLowerCase() === selectedStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    if (loading)
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải danh sách đơn hàng...</p>
            </div>
        );

    if (error)
        return (
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
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/user/sales")}
                    >
                        <span className="icon">+</span>
                        Thêm ĐH
                    </button>
                    <button className="btn btn-primary">
                        Xuất Excel
                        <span className="dropdown-arrow">▼</span>
                    </button>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="status-tabs">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={`tab ${selectedStatus === tab.key ? "active" : ""}`}
                        onClick={() => setSelectedStatus(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content Container */}
            <div className="main-content-container">
                {/* Search Bar */}
                <div className="search-filter-bar">
                    <div className="search-container">
                        <span className="fa fa-search search-icon"></span>
                        <input
                            type="text"
                            placeholder="Tên KH, mã ĐH, mã CQT"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
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
                                <td
                                    colSpan={9}
                                    style={{ textAlign: "center", padding: "40px" }}
                                >
                                    <div className="empty-state">
                                        <div className="empty-icon">📦</div>
                                        <h3>Chưa có đơn hàng nào</h3>
                                        <p>Khi có đơn hàng mới, chúng sẽ xuất hiện ở đây.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order, index) => (
                                <tr key={order.orderId}>
                                    <td>{index + 1}</td>
                                    <td
                                        onClick={() => handleViewOrder(order)}
                                        title="Xem chi tiết"
                                        style={{cursor: "pointer"}}
                                    >
                                        {order.code}
                                    </td>
                                    <td>
                                        <div className="customer-info">
                        <span>
                          Tên khách hàng: {order.customerName || "Khách lẻ"}
                        </span>
                                        </div>
                                    </td>
                                    <td>{order.createdAt}</td>
                                    <td></td>
                                    <td>{formatPrice(order.total)}</td>
                                    <td>TM/CK</td>
                                    <td>
                      <span
                          className="status-badge"
                          style={{color: getStatusColor(order.status)}}
                      >
                        {getStatusText(order.status)}
                      </span>
                                    </td>
                                    <td>
                                        <button
                                            className="action-btn menu-btn"
                                            onClick={() => handleViewOrder(order)}
                                            title="Xem chi tiết"
                                        >
                                            ☰
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Detail Modal */}
            <OrderDetailModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
};
