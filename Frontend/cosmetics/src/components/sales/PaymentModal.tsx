import React, { useState } from 'react';
import { createMomoPayment } from '../../api/paymentApi';
import './PaymentModal.css';
import type { PaymentModalProps} from "../../types/payment.ts";
import { paymentMethods } from "../../constants/payment.constants.ts";
import type { PaymentMethod } from "../../constants/payment.constants.ts";

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderTotal,
  orderCode,
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transferAmount, setTransferAmount] = useState<number>(0);

  const handleMethodChange = (method: PaymentMethod) => {
    setSelectedMethod(method);
    if (method !== 'tmck') {
      setTransferAmount(0);
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) return;

    if (selectedMethod === 'tmck' && transferAmount <= 0) {
      alert('Vui lòng nhập số tiền chuyển khoản');
      return;
    }
    setIsProcessing(true);

    try {
      if (selectedMethod === 'momo') {
        await createMomoPayment(orderCode, orderTotal);
        onPaymentSuccess();
      } else if (selectedMethod === 'tmck') {
        onPaymentSuccess();
      } else {
        onPaymentSuccess();
      }
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setSelectedMethod(null);
    setTransferAmount(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal-header">
          <h3>Chi tiết thanh toán</h3>
          <button className="close-btn" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="payment-modal-body">
          <div className="order-info">
            <div className="order-code">
              <span>Mã đơn hàng: {orderCode}</span>
            </div>
            <div className="order-total">
              <span>Tổng tiền: {orderTotal.toLocaleString()}đ</span>
            </div>
          </div>

          <div className="payment-methods">
            <h4>Chọn phương thức thanh toán:</h4>
            <div className="payment-methods-grid">
              {paymentMethods.map((method) => (
                 <div
                   key={method.id}
                   className={`payment-method ${selectedMethod === method.id ? 'selected' : ''}`}
                   onClick={() => handleMethodChange(method.id)}
                 >
                  <div className="method-icon">
                    <i className={method.icon}></i>
                  </div>
                  <div className="method-info">
                    <h5>{method.name}</h5>
                    <p>{method.description}</p>
                  </div>
                  <div className="method-radio">
                     <input
                       type="radio"
                       name="paymentMethod"
                       value={method.id}
                       checked={selectedMethod === method.id}
                       onChange={() => handleMethodChange(method.id)}
                     />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TMCK Input */}
          {selectedMethod === 'tmck' && (
            <div className="tmck-input-section">
              <h4>Số tiền chuyển khoản:</h4>
              <div className="transfer-amount-input">
                <input
                  type="number"
                  placeholder="Nhập số tiền chuyển khoản"
                  value={transferAmount || ''}
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  min="0"
                  max={orderTotal}
                />
                <span className="currency">đ</span>
              </div>
              <div className="amount-breakdown">
                <div className="breakdown-item">
                  <span>Chuyển khoản:</span>
                  <span>{transferAmount.toLocaleString()}đ</span>
                </div>
                <div className="breakdown-item">
                  <span>Tiền mặt:</span>
                  <span>{(orderTotal - transferAmount).toLocaleString()}đ</span>
                </div>
                <div className="breakdown-total">
                  <span>Tổng cộng:</span>
                  <span>{orderTotal.toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="payment-modal-footer">
          <button
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Hủy bỏ
          </button>
          <button
            className="btn btn-primary"
            onClick={handlePayment}
            disabled={!selectedMethod || isProcessing}
          >
            {isProcessing ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Đang xử lý...
              </>
            ) : (
              'Thanh toán'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
