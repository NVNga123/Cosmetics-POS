package com.example.invoice_service.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigDecimal;

public class SaleReportResponse {
    @JsonFormat(shape = JsonFormat.Shape.NUMBER)
    private BigDecimal totalRevenue; // Tổng doanh thu (số lớn)
    private String totalRevenueDisplay; // Doanh thu (dạng "47.22 triệu")
    private Long totalOrders; // Tổng đơn hàng
    private Long totalQuantityProduct; // Tổng sản phẩm đã bán
    private Long totalOrdersReturned; // Tổng đơn trả hàng

    // Constructors
    public SaleReportResponse(BigDecimal totalRevenue, Long totalOrders, Long totalQuantityProduct, Long totalOrdersReturned) {
        this.totalRevenue = totalRevenue;
        this.totalOrders = totalOrders;
        this.totalQuantityProduct = totalQuantityProduct;
        this.totalOrdersReturned = totalOrdersReturned;
    }

    // Getters và Setters (Hãy đảm bảo bạn có đủ)
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
    public String getTotalRevenueDisplay() { return totalRevenueDisplay; }
    public void setTotalRevenueDisplay(String totalRevenueDisplay) { this.totalRevenueDisplay = totalRevenueDisplay; }
    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }
    public Long getTotalQuantityProduct() { return totalQuantityProduct; }
    public void setTotalQuantityProduct(Long totalQuantityProduct) { this.totalQuantityProduct = totalQuantityProduct; }
    public Long getTotalOrdersReturned() { return totalOrdersReturned; }
    public void setTotalOrdersReturned(Long totalOrdersReturned) { this.totalOrdersReturned = totalOrdersReturned; }
}