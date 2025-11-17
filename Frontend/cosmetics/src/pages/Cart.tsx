import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { orderApi } from "../api/orderApi.ts";
import type { Order } from "../types/order.ts";
import { OrderDetailModal } from "../components/orders/OrderDetailModal.tsx";
/*import { formatPrice, getStatusText, getStatusColor, getPaymentMethodText } from "../utils/orderUtils.ts";*/
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
            <div className="page-title">Danh hoá đơn</div>

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

                    </tbody>
                </table>
            </div>

            <OrderDetailModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default Cart;
