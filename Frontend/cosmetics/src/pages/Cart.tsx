import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { orderApi } from "../api/orderApi.ts";
import type { Order } from "../types/order.ts";
import { OrderDetailModal } from "../components/orders/OrderDetailModal.tsx";
import { formatPrice, getStatusText, getStatusColor, getPaymentMethodText } from "../utils/orderUtils.ts";
import "./Cart.css";

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
        if (typeof dateString === 'number' || /^\d+$/.test(dateString)) {
            const timestamp = typeof dateString === 'number' ? dateString : parseInt(dateString);
            const date = timestamp < 10000000000 ? new Date(timestamp * 1000) : new Date(timestamp);
            return date.toLocaleString("vi-VN");
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleString("vi-VN");
    } catch {
        return 'N/A';
    }
};

export const Cart = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await orderApi.getAllOrders();
            const { data = [] } = result || {};

            const draftOrders = (data || []).filter((order: any) => order.status === 'DRAFT');
            const transformedOrders = draftOrders.map((order: any) => ({
                ...order,
                orderId: order.id || order.orderId,
                total: order.finalPrice,
                createdDate: order.createdDate || order.createdAt || order.created_date,
                items: (order.items || order.orderDetails || []).map((item: any) => ({
                    ...item,
                    product: item.product || {
                        id: item.productId,
                        name: item.productName,
                        price: item.unitPrice || item.price
                    },
                    quantity: item.quantity || item.quantityProduct,
                    unitPrice: item.unitPrice || item.price,
                    totalPrice: item.totalPrice || item.total,
                    subtotal: item.subtotal || item.total
                }))
            }));
            setOrders(transformedOrders);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Lỗi khi tải đơn hàng");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [location.key]);

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleDeleteOrder = async (orderId: string | number) => {
        try {
            if (!orderId) return alert('ID không hợp lệ');
            
            await orderApi.deleteOrder(String(orderId));
            setOrders(prev => prev.filter(order => order.orderId !== Number(orderId)));
            alert('Đơn hàng đã được xoá!');
            
            // Fallback: Refresh orders list after a short delay
            setTimeout(async () => {
                try {
                    const response = await orderApi.getAllOrders();
                    if (response.data) {
                        setOrders(response.data);
                    }
                } catch (error) {
                    // Silent error handling
                }
            }, 1000);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi xoá đơn hàng. Vui lòng thử lại.';
            alert(errorMessage);
        }
    };

    /** ✅ Khi bấm Hoàn thành → mở bên SalesScreen **/
    const handleCompleteOrder = async (orderId: string | number) => {
        try {
            if (!orderId) return alert('Không thể hoàn thành: ID không hợp lệ.');

            const result = await orderApi.getById(String(orderId));
            const orderData = result?.data;

            if (!orderData) {
                alert('Không tìm thấy đơn hàng.');
                return;
            }

            navigate('/user/sales', { state: { selectedOrder: orderData } });
        } catch (error) {
            alert('Có lỗi khi tải đơn hàng.');
        }
    };

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
        <div className="cart-page">
            <div className="page-title">Danh sách đơn hàng chưa hoàn thành</div>

            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn hàng</th>
                        <th>Thông tin KH</th>
                        <th>Ngày tạo</th>
                        <th>Tổng tiền</th>
                        <th>Hình thức TT</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order, index) => (
                        <tr key={order.orderId}>
                            <td>{index + 1}</td>
                            <td
                                onClick={() => handleViewOrder(order)}
                                title="Xem chi tiết"
                                style={{ cursor: "pointer" }}
                            >
                                {order.code}
                            </td>
                            <td>{order.customerName || "Khách lẻ"}</td>
                            <td>{formatDate(order.createdDate)}</td>
                            <td>{formatPrice(order.total)}</td>
                            <td>{getPaymentMethodText(order.paymentMethod)}</td>
                            <td>
                                    <span
                                        className="status-badge"
                                        style={{ color: getStatusColor(order.status) }}
                                    >
                                        {getStatusText(order.status)}
                                    </span>
                            </td>
                            <td>
                                <button
                                    className="action-btn complete-btn"
                                    onClick={() => handleCompleteOrder(order.orderId)}
                                    title="Hoàn thành đơn hàng"
                                >
                                    Hoàn thành
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <OrderDetailModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onDeleteOrder={handleDeleteOrder}
            />
        </div>
    );
};

export default Cart;
