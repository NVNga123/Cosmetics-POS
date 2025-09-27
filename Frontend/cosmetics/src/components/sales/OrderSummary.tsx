import React, { useState } from 'react';
import type { OrderSummaryProps } from '../../types/order';
import { orderApi } from '../../api/orderApi';

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  order,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onSaveOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');

  const buildOrderData = (status: string) => ({
    items: order.items.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      subtotal: item.total,
        })),
        subtotal: order.subtotal,
        discount: 0,
        tax: order.tax,
        total: order.total,
        customerName: customerName,
        notes: notes,
        status: status,
      });

  const handleSaveOrder = async () => {
    try {
      const orderData = buildOrderData('DRAFT');
      console.log('Saving draft order:', orderData);
      const result = await orderApi.submitOrder(orderData);

      if (result?.id) {
        order.id = result.id;
      }

      console.log('Draft order saved:', result);
      alert('Đơn hàng đã được lưu dưới dạng nháp!');
      onSaveOrder();
    } catch (error: any) {
      console.error('Error saving draft order:', error);
      alert(`Có lỗi khi lưu đơn: ${error.message}`);
    }
  };

  // Thanh toán đơn
  const handleCheckout = async () => {
    try {
      const orderData = buildOrderData('COMPLETED');
      console.log('Submitting completed order:', orderData);
      const result = await orderApi.submitOrder(orderData);

      if (result?.id) {
        order.id = result.id;
      }

      console.log('Order submitted successfully:', result);
      alert('Đơn hàng đã được thanh toán thành công!');
      onCheckout();
    } catch (error: any) {
      console.error('Error submitting order:', error);
      alert(`Có lỗi xảy ra khi thanh toán: ${error.message}`);
    }
  };

  return (
    <div className="pos-sidebar">
      {/* Header */}
      <div className="pos-sidebar-nav">
        <div className="area">
          <div className="left-header">
            <div className="current-order">
              <span>{order.id}</span>
            </div>
            <div className="add">
              <i className="fa fa-plus"></i>
              <span>Đơn hàng</span>
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
                onChange={(e) => setCustomerName(e.target.value)}
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
              {order.items.length === 0 ? (
                <div className="empty-order">
                  <p>Chưa có sản phẩm nào</p>
                </div>
              ) : (
                order.items.map(item => (
                  <div key={item.product.id} className="order-item">
                    <div className="item-info">
                      <h5>{item.product.name}</h5>
                      <p>{item.product.price.toLocaleString()}đ</p>
                    </div>
                    <div className="item-controls">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="btn-quantity"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="btn-quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="btn-remove"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                    <div className="item-total">
                      {item.total.toLocaleString()}đ
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
            <span>{order.subtotal.toLocaleString()}đ</span>
          </div>

          <div className="flex-between-center">
            <span>Khuyến mãi</span>
            <span>0đ</span>
          </div>

          <div className="flex-between-center">
            <span>Thuế VAT (10%)</span>
            <span>{order.tax.toLocaleString()}đ</span>
          </div>

          <div className="total-amount">
            <span>Tổng tiền thanh toán</span>
            <span>{order.total.toLocaleString()}đ</span>
          </div>

          <div className="order-notes">
            <div className="notes-input-container">
              <i className="fa-solid fa-pen notes-icon"></i>
              <textarea
                placeholder="Nhập ghi chú..."
                className="notes-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="btn-row">
            <button
              className="btn btn-outline-primary cancel-order"
              onClick={handleSaveOrder}
              disabled={order.items.length === 0}
              title={order.items.length === 0 ? 'Vui lòng thêm sản phẩm vào giỏ hàng' : 'Hủy đơn hàng'}
            >
              <i className="fa fa-download"></i>
              <span>Lưu đơn</span>
            </button>
              <button
                className="btn btn-success checkout-order"
                onClick={handleCheckout}
                disabled={order.items.length === 0}
                title={order.items.length === 0 ? 'Vui lòng thêm sản phẩm vào giỏ hàng' : 'Thanh toán đơn hàng'}
              >
              <i className="fa fa-dollar"></i>
              <span>Thanh toán</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


