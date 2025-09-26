package com.example.cart_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Objects;

public class OrderSubmitDTO {

    @Valid
    @NotNull
    private List<OrderItemDTO> items;

    @Min(0)
    private double subtotal;

    @Min(0)
    private double discount;

    @Min(0)
    private double tax;

    @Min(0)
    private double total;

    private String customerName;

    private String notes;


    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }

    public double getTax() {
        return tax;
    }

    public void setTax(double tax) {
        this.tax = tax;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @Override
    public String toString() {
        return "OrderSubmitDTO{" +
                "items=" + items +
                ", subtotal=" + subtotal +
                ", discount=" + discount +
                ", tax=" + tax +
                ", total=" + total +
                ", customerName='" + customerName + '\'' +
                ", notes='" + notes + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrderSubmitDTO that)) return false;
        return Double.compare(that.subtotal, subtotal) == 0 &&
                Double.compare(that.discount, discount) == 0 &&
                Double.compare(that.tax, tax) == 0 &&
                Double.compare(that.total, total) == 0 &&
                Objects.equals(items, that.items) &&
                Objects.equals(customerName, that.customerName) &&
                Objects.equals(notes, that.notes);
    }

    @Override
    public int hashCode() {
        return Objects.hash(items, subtotal, discount, tax, total, customerName, notes);
    }
}
