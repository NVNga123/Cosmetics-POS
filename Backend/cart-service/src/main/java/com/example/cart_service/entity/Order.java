package com.example.cart_service.entity;


import jakarta.persistence.*;
import org.apache.catalina.User;
import org.hibernate.annotations.DynamicUpdate;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "orders")
@DynamicUpdate
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Order extends AbstractAuditing<Integer> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "customer_id")
    private String customerId;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name ="user_name")
    private String userName;

    @Column(name = "note")
    private String note;

    @Column(name = "status")
    private String status;

    @Column(name = "total_quantity")
    private Integer quantity;

    @Column(name = "discount_id")
    private Double discountId;

    @Column(name = "total_discount")
    private Double totalDiscount;

    @Column(name = "tax_rate") // % thuế
    private Double taxRate;

    @Column(name = "tax_amount") // tiền thuế
    private Double taxAmount;

    @Column (name = "total_amount") // tổng tiền thanh toán
    private Double totalAmount;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "final_price")
    private Double finalPrice;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderDetail> orderDetails;

    @Override
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getDiscountId() {
        return discountId;
    }

    public void setDiscountId(Double discountId) {
        this.discountId = discountId;
    }

    public Double getTotalDiscount() {
        return totalDiscount;
    }

    public void setTotalDiscount(Double totalDiscount) {
        this.totalDiscount = totalDiscount;
    }

    public Double getTaxRate() {
        return taxRate;
    }

    public void setTaxRate(Double taxRate) {
        this.taxRate = taxRate;
    }

    public Double getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(Double taxAmount) {
        this.taxAmount = taxAmount;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Double getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(Double finalPrice) {
        this.finalPrice = finalPrice;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public List<OrderDetail> getOrderDetails() {
        return orderDetails;
    }

    public void setOrderDetails(List<OrderDetail> orderDetails) {
        this.orderDetails = orderDetails;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Order that = (Order) o;
        return Objects.equals(id, that.id) && Objects.equals(customerId, that.customerId) && Objects.equals(customerName, that.customerName) && Objects.equals(note, that.note) && Objects.equals(status, that.status) && Objects.equals(quantity, that.quantity) && Objects.equals(discountId, that.discountId) && Objects.equals(totalDiscount, that.totalDiscount) && Objects.equals(taxRate, that.taxRate) && Objects.equals(taxAmount, that.taxAmount) && Objects.equals(totalAmount, that.totalAmount) && Objects.equals(paymentMethod, that.paymentMethod) && Objects.equals(finalPrice, that.finalPrice);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, customerId, customerName, note, status, quantity, discountId, totalDiscount, taxRate, taxAmount, totalAmount, paymentMethod, finalPrice);
    }

    @Override
    public String toString() {
        return "OrderEntity{" +
                "id=" + id +
                ", customerId='" + customerId + '\'' +
                ", customerName='" + customerName + '\'' +
                ", note='" + note + '\'' +
                ", status='" + status + '\'' +
                ", quantity=" + quantity +
                ", discountId=" + discountId +
                ", totalDiscount=" + totalDiscount +
                ", taxRate=" + taxRate +
                ", taxAmount=" + taxAmount +
                ", totalAmount=" + totalAmount +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", finalPrice=" + finalPrice +
                '}';
    }
}
