package com.example.cart_service.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;

public class SaleReportResponse {
    private String reportDate;

    @JsonFormat(shape = JsonFormat.Shape.NUMBER)
    private BigDecimal totalRevenue;
    private String totalRevenueDisplay;

    @JsonFormat(shape = JsonFormat.Shape.NUMBER)
    private BigDecimal revenueDaily;

    @JsonFormat(shape = JsonFormat.Shape.NUMBER)
    private BigDecimal revenueMonth;
    private Long totalOrders;
    private Long totalQuantityProduct;
    private Long totalOrdersReturned;

    public SaleReportResponse(BigDecimal totalRevenue, Long totalOrders, Long totalQuantityProduct, Long totalOrdersReturned){
        this.totalRevenue = totalRevenue;
        this.totalRevenueDisplay = totalRevenueDisplay;
        this.totalOrders = totalOrders;
        this.totalQuantityProduct = totalQuantityProduct;
        this.totalOrdersReturned = totalOrdersReturned;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public String getTotalRevenueDisplay() { return totalRevenueDisplay;}

    public void setTotalRevenueDisplay(String totalRevenueDisplay) { this.totalRevenueDisplay = totalRevenueDisplay;}

    public BigDecimal getRevenueDaily() {  return revenueDaily;}

    public void setRevenueDaily(BigDecimal revenueDaily) { this.revenueDaily = revenueDaily;}

    public BigDecimal getRevenueMonth() { return revenueMonth;}

    public void setRevenueMonth(BigDecimal revenueMonth) { this.revenueMonth = revenueMonth;}

    public Long getTotalOrders() { return totalOrders;}

    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders;}

    public Long getTotalQuantityProduct() {
        return totalQuantityProduct;
    }

    public void setTotalQuantityProduct(Long totalQuantityProduct) {
        this.totalQuantityProduct = totalQuantityProduct;
    }

    public String getReportDate() {
        return reportDate;
    }

    public void setReportDate(String reportDate) {
        this.reportDate = reportDate;
    }

    public Long getTotalOrdersReturned() { return totalOrdersReturned; }

    public void setTotalOrdersReturned(Long totalOrdersReturned) { this.totalOrdersReturned = totalOrdersReturned;}
}
