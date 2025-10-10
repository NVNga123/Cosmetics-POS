package com.example.cart_service.service;

import com.example.cart_service.dto.request.SalesReportRequest;
import com.example.cart_service.dto.response.ResultDTO;
import com.example.cart_service.dto.response.SaleReportResponse;

public interface SalesReportService {

    ResultDTO getAllReport (SalesReportRequest salesReportRequest);

    ResultDTO getTotalRevenue (SalesReportRequest salesReportRequest);

    ResultDTO getDailySalesReport(SalesReportRequest salesReportRequest);

    ResultDTO getMonthlySalesReport(SalesReportRequest salesReportRequest);

    ResultDTO getTotalOrders(SalesReportRequest salesReportRequest);

    ResultDTO getTotalQuantityProduct(SalesReportRequest salesReportRequest);

    ResultDTO getTotalOrdersReturned(SalesReportRequest salesReportRequest);

}
