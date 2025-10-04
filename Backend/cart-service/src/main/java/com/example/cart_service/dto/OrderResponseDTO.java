package com.example.cart_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

public class OrderResponseDTO {
    private Integer orderId;
    private  String code;
    private String customerName;
    private double total;
    private String status;
    private String createdAt;
    private List<OrderItemDTO> items;
    private String notes;
    private String returnReason;

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getReturnReason() {
        return returnReason;
    }

    public void setReturnReason(String returnReason) {
        this.returnReason = returnReason;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderResponseDTO that = (OrderResponseDTO) o;
        return Double.compare(total, that.total) == 0 && Objects.equals(orderId, that.orderId) && Objects.equals(code, that.code) && Objects.equals(customerName, that.customerName) && Objects.equals(status, that.status) && Objects.equals(createdAt, that.createdAt) && Objects.equals(items, that.items) && Objects.equals(notes, that.notes);
    }

    @Override
    public int hashCode() {
        return Objects.hash(orderId, code, customerName, total, status, createdAt, items, notes);
    }

    @Override
    public String toString() {
        return "OrderResponseDTO{" +
                "orderId=" + orderId +
                ", code='" + code + '\'' +
                ", customerName='" + customerName + '\'' +
                ", total=" + total +
                ", status='" + status + '\'' +
                ", createdAt='" + createdAt + '\'' +
                ", items=" + items +
                ", notes='" + notes + '\'' +
                '}';
    }
}
