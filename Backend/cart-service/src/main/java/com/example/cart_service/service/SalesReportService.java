package com.example.cart_service.service;

import com.example.cart_service.dto.request.SalesReportRequest;
import com.example.cart_service.dto.response.ResultDTO;

public interface SalesReportService {

    ResultDTO getAllReport (SalesReportRequest salesReportRequest);

    ResultDTO getDailySalesReport(SalesReportRequest salesReportRequest);

    ResultDTO getMonthlySalesReport(SalesReportRequest salesReportRequest);
}
