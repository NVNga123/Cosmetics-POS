import React from 'react';
import type { OrderSummaryProps } from '../../types/order';

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  order,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onCancel
}) => {
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
            <span>Tạm tính</span>
            <span>{order.subtotal.toLocaleString()}đ</span>
          </div>
          
          <div className="flex-between-center">
            <span>Thuế VAT (10%)</span>
            <span>{order.tax.toLocaleString()}đ</span>
          </div>
          
          <div className="total-amount">
            <span>Tổng tiền thanh toán</span>
            <span>{order.total.toLocaleString()}đ</span>
          </div>
        </div>

        <div className="pos-sidebar-footer">
          <div className="btn-row">
            <button 
              className="btn btn-outline-primary cancel-order"
              onClick={onCancel}
            >
              <i className="fa fa-times"></i>
              <span>Hủy</span>
            </button>
            <button 
              className="btn btn-success checkout-order"
              onClick={onCheckout}
              disabled={order.items.length === 0}
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


