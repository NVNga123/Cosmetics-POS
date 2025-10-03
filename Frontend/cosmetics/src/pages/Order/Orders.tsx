import React, { useEffect, useState } from "react";
import { orderApi } from "../../api/orderApi.ts";
import type { Order } from "../../types/order.ts";
import { OrderDetailModal } from "../../components/orders/OrderDetailModal.tsx";
import { OrderFilters } from "../../components/orders/OrderFilters.tsx";
import { OrderTable } from "../../components/orders/OrderTable.tsx";
import { formatPrice, getStatusText, getStatusColor } from "../../utils/orderUtils.ts";
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
            const data = await orderApi.getAllOrders();
            console.log("Orders received:", data);
            console.log("First order structure:", data?.[0]);
            
            // Transform data to match frontend interface
            const transformedOrders = (data || []).map((order: any) => ({
                ...order,
                orderId: order.id || order.orderId,
                items: (order.items || order.orderDetails || []).map((item: any) => ({
                    ...item,
                    product: item.product || {
                        id: item.productId,
                        name: item.productName,
                        price: item.unitPrice || item.price
                    },
                    // Map backend fields to frontend fields
                    quantity: item.quantity || item.quantityProduct,
                    unitPrice: item.unitPrice || item.price,
                    totalPrice: item.totalPrice || item.total,
                    subtotal: item.subtotal || item.total
                }))
            }));
            
            console.log("Transformed orders:", transformedOrders);
            setOrders(transformedOrders);
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
                    <h3>Lỗi tải dữ liệu</h3>
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

            {/* Filters */}
            <OrderFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
            />

            {/* Orders Table */}
            <OrderTable
                orders={filteredOrders}
                onViewOrder={handleViewOrder}
                formatPrice={formatPrice}
                getStatusText={getStatusText}
                getStatusColor={getStatusColor}
            />

            {/* Order Detail Modal */}
            <OrderDetailModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
};
