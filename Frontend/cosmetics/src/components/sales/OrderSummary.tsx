import React, { useState } from 'react';
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

  const handlePaymentClick = () => {
    console.log('Payment button clicked, opening modal');
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    onCheckout();
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

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
                    {orders[activeOrderIndex]?.code}
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
                  <div className="order-dropdown">
                    <button className="dropdown-trigger">
                      <i className="fa fa-file-text"></i>
                      <span className="badge">{orders.length - 1}</span>
                      <i className="fa fa-chevron-down"></i>
                    </button>
                    <div className="dropdown-menu">
                      <div className="dropdown-header">Đơn hàng</div>
                      {orders.map((ord, index) => (
                        index !== activeOrderIndex && (
                          <div 
                            key={`${ord.orderId}-${index}`} 
                            className="dropdown-item"
                            onClick={() => onSwitchOrder(index)}
                          >
                            <span>Đơn hàng: {ord.code}</span>
                            <button 
                              className="remove-order-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteOrder(index);
                              }}
                              title="Xóa đơn hàng"
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </div>
                        )
                      ))}
                    </div>
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
                    order?.items?.map((item) => (
                        <div key={item.product?.id || 'unknown'} className="order-item">
                          <div className="item-info">
                            <h5>{item.product?.name || 'Sản phẩm không xác định'}</h5>
                            <p>{item.product?.price?.toLocaleString() || '0'}đ</p>
                          </div>
                          <div className="item-controls">
                            <button
                                onClick={() => onUpdateQuantity(item.product?.id || '', item.quantity - 1)}
                                className="btn-quantity"
                            >
                              -
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button
                                onClick={() => onUpdateQuantity(item.product?.id || '', item.quantity + 1)}
                                className="btn-quantity"
                            >
                              +
                            </button>
                            <button
                                onClick={() => onRemoveItem(item.product?.id || '')}
                                className="btn-remove"
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                          <div className="item-total">{item.total.toLocaleString()}đ</div>
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
              <span>{order?.items?.reduce((sum, item) => sum + (item.subtotal || 0), 0)?.toLocaleString() || '0'}đ</span>
            </div>

            <div className="flex-between-center">
              <span>Khuyến mãi</span>
              <span>0đ</span>
            </div>

            <div className="flex-between-center">
              <span>Thuế VAT (10%)</span>
              <span>{Math.round((order?.items?.reduce((sum, item) => sum + (item.subtotal || 0), 0) || 0) * 0.1)?.toLocaleString() || '0'}đ</span>
            </div>

            <div className="total-amount">
              <span>Tổng tiền thanh toán</span>
              <span>{order?.total?.toLocaleString()}đ</span>
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
        orderTotal={order?.total || 0}
        orderCode={order?.code || ''}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};
