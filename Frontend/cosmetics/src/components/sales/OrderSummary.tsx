import React, { useState, useEffect, useRef } from 'react';
import type { OrderSummaryProps } from '../../types/order';
import { PaymentModal } from './PaymentModal';
import './PaymentModal.css';

export const OrderSummary: React.FC<OrderSummaryProps> = ({
                                                              order,
                                                              orders,
                                                              activeOrderIndex,
                                                              customerName,
                                                              notes,
                                                              onUpdateQuantity,
                                                              onRemoveItem,
                                                              onCheckout,
                                                              onSaveOrder,
                                                              onCustomerNameChange,
                                                              onNotesChange,
                                                              onAddOrder,
                                                              onSwitchOrder,
                                                              onDeleteOrder,
                                                          }) => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
    const orderDropdownRef = useRef<HTMLDivElement>(null);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        if (!isOrderDropdownOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (orderDropdownRef.current && !orderDropdownRef.current.contains(event.target as Node)) {
                setIsOrderDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOrderDropdownOpen]);

    const handlePaymentClick = () => {
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = async (paymentMethod?: any, transferAmount?: number) => {
        setIsPaymentModalOpen(false);
        await onCheckout(paymentMethod, transferAmount);
    };

    const handleClosePaymentModal = () => {
        setIsPaymentModalOpen(false);
    };

    // Tổng tiền gốc (chưa giảm)
    const subtotal = order?.items?.reduce((sum, item) => sum + (item.subtotal || 0), 0) || 0;

    // Tổng khuyến mãi
    const discount = order?.items?.reduce((sum, item) => sum + (item.subtotal - item.total), 0) || 0;

    // Tổng sau giảm
    const discountedSubtotal = subtotal - discount;

    // Thuế VAT
    const vat = Math.round(discountedSubtotal * 0.1);

    // Tổng thanh toán
    const total = discountedSubtotal + vat;

    return (
        <>
            <div className="pos-sidebar">
                {/* Header */}
                <div className="pos-sidebar-nav">
                    <div className="area">
                        <div className="left-header">
                            {/* Order Selection */}
                            <div className="order-selection">
                                {/* Current Order Tab */}
                                <div className="current-order-tab">
                                    <button
                                        className="order-tab active"
                                        onClick={() => onSwitchOrder(activeOrderIndex)}
                                    >
                                        {orders[activeOrderIndex]?.code || `ĐH-${activeOrderIndex + 1}`}
                                    </button>
                                    {orders.length > 1 && (
                                        <button
                                            className="delete-order-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteOrder(activeOrderIndex);
                                            }}
                                            title="Xóa đơn hàng"
                                        >
                                            <i className="fa fa-times"></i>
                                        </button>
                                    )}
                                </div>

                                {/* Order Dropdown */}
                                {orders.length > 1 && (
                                    <div
                                        className="order-dropdown"
                                        ref={orderDropdownRef}
                                        style={{ position: 'relative', zIndex: 10001 }}
                                    >
                                        <button
                                            type="button"
                                            className="dropdown-trigger"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setIsOrderDropdownOpen(!isOrderDropdownOpen);
                                            }}
                                            style={{
                                                position: 'relative',
                                                zIndex: 10001,
                                                pointerEvents: 'auto',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <i className="fa fa-file-text"></i>
                                            <span className="badge">{orders.length - 1}</span>
                                            <i className="fa fa-chevron-down"></i>
                                        </button>
                                        {isOrderDropdownOpen && (
                                            <div
                                                className="dropdown-menu order-dropdown-open"
                                                onClick={(e) => e.stopPropagation()}
                                                style={{
                                                    display: 'block',
                                                    visibility: 'visible',
                                                    opacity: 1,
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: '0',
                                                    marginTop: '4px',
                                                    maxHeight: '300px',
                                                    overflowY: 'auto',
                                                    zIndex: 10002,
                                                    minWidth: '200px',
                                                    backgroundColor: 'white',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                    pointerEvents: 'auto'
                                                }}
                                            >
                                                <div className="dropdown-header">Danh sách đơn hàng ({orders.length})</div>
                                                {orders.map((ord, index) => (
                                                    <div
                                                        key={`${ord.orderId}-${index}`}
                                                        className={`dropdown-item ${index === activeOrderIndex ? 'active' : ''}`}
                                                        onClick={() => {
                                                            onSwitchOrder(index);
                                                            setIsOrderDropdownOpen(false);
                                                        }}
                                                        style={{
                                                            backgroundColor: index === activeOrderIndex ? '#e3f2fd' : 'transparent',
                                                            fontWeight: index === activeOrderIndex ? 'bold' : 'normal'
                                                        }}
                                                    >
                            <span>
                              {ord.code || `ĐH-${index + 1}`}
                                {index === activeOrderIndex && ' (Đang chọn)'}
                            </span>
                                                        <button
                                                            className="remove-order-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (orders.length > 1) {
                                                                    onDeleteOrder(index);
                                                                    setIsOrderDropdownOpen(false);
                                                                }
                                                            }}
                                                            title="Xóa đơn hàng"
                                                            disabled={orders.length <= 1}
                                                        >
                                                            <i className="fa fa-times"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Add Order Button */}
                                <button className="add-order-btn" onClick={onAddOrder}>
                                    <i className="fa fa-plus"></i>
                                    <span>Đơn hàng</span>
                                </button>
                            </div>
                        </div>

                        <div className="right-header">
                            <button className="icon">
                                <i className="fa-solid fa-bars"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="pos-sidebar-body">
                    <div className="order-datetime">
                        <div className="customer-section">
                            <div className="customer-tag">
                                <div className="tag-container">
                                    <input
                                        type="text"
                                        placeholder="Nhập tên khách hàng"
                                        className="tag-input"
                                        value={customerName}
                                        onChange={(e) => onCustomerNameChange(e.target.value)}
                                    />
                                    <button className="tag-remove" type="button">
                                        <i className="fa fa-times"></i>
                                    </button>
                                </div>
                            </div>
                            <button className="add-customer-btn" type="button">
                                <i className="fa fa-plus"></i>
                            </button>
                        </div>
                        <div className="datetime-display">
                            <span>{new Date().toLocaleString('vi-VN')}</span>
                        </div>
                    </div>
                    <div className="tab-content">
                        <div className="tab-pane fade show active">
                            <div className="order-items">
                                {order?.items?.length === 0 ? (
                                    <div className="empty-order">
                                        <p>Chưa có sản phẩm nào</p>
                                    </div>
                                ) : (
                                    order?.items?.map((item, index) => (
                                        <div key={`${item.product?.id || 'unknown'}-${index}`} className="order-item">
                                            <div className="item-info">
                                                <h5>{item.product?.name || 'Sản phẩm không xác định'}</h5>
                                                <p>-{item.discountAmount?.toLocaleString() || '0'}đ</p>
                                            </div>
                                            <div className="item-controls">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const newQuantity = item.quantity - 1;
                                                        onUpdateQuantity(item.product?.id || '', newQuantity);
                                                    }}
                                                    className="btn-quantity"
                                                    disabled={item.quantity <= 0}
                                                >
                                                    -
                                                </button>

                                                <span className="quantity">{item.quantity}</span>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onUpdateQuantity(item.product?.id || '', item.quantity + 1);
                                                    }}
                                                    className="btn-quantity"
                                                >
                                                    +
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onRemoveItem(item.product?.id || '');
                                                    }}
                                                    className="btn-remove"
                                                >
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </div>
                                            <div className="item-total">
                                                {(item.subtotal ?? 0).toLocaleString('vi-VN')}đ
                                            </div>

                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary Footer */}
                <div className="wrap-pos-sidebar-footer">
                    <div className="pos-sidebar-footer">
                        <div className="checkout-detail">
                            <span>Chi tiết thanh toán</span>
                        </div>

                        <div className="flex-between-center">
                            <span>Tạm tính</span>
                            <span>{subtotal.toLocaleString()}đ</span>
                        </div>

                        <div className="flex-between-center">
                            <span>Khuyến mãi</span>
                            <span>{discount.toLocaleString()}đ</span>
                        </div>

                        <div className="flex-between-center">
                            <span>Thuế VAT (10%)</span>
                            <span>{vat.toLocaleString()}đ</span>
                        </div>

                        <div className="total-amount">
                            <span>Tổng tiền thanh toán</span>
                            <span>{total.toLocaleString()}đ</span>
                        </div>

                        <div className="order-notes">
                            <div className="notes-input-container">
                                <i className="fa-solid fa-pen notes-icon"></i>
                                <textarea
                                    placeholder="Nhập ghi chú..."
                                    className="notes-input"
                                    value={notes}
                                    onChange={(e) => onNotesChange(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="btn-row">
                            <button
                                className="btn btn-outline-primary cancel-order"
                                onClick={onSaveOrder}
                                disabled={order?.items?.length === 0}
                            >
                                <i className="fa fa-download"></i>
                                <span>Lưu đơn</span>
                            </button>
                            <button
                                className="btn btn-success checkout-order"
                                onClick={handlePaymentClick}
                                disabled={order?.items?.length === 0}
                            >
                                <i className="fa fa-dollar"></i>
                                <span>Thanh toán</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={handleClosePaymentModal}
                orderTotal={total}
                orderCode={order?.code || ''}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </>
    );
};
