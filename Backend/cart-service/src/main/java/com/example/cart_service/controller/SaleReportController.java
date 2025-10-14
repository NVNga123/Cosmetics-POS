package com.example.cart_service.controller;

import com.example.cart_service.dto.request.SalesReportRequest;
import com.example.cart_service.dto.response.ResultDTO;
import com.example.cart_service.service.SalesReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
public class SaleReportController {

    private static final Logger LOG = LoggerFactory.getLogger(SaleReportController.class);
    private final SalesReportService salesReportService;

    public SaleReportController(SalesReportService salesReportService) {
        this.salesReportService = salesReportService;
    }

    @GetMapping
    public ResponseEntity<ResultDTO> getAllReport(){
        SalesReportRequest salesReportRequest = new SalesReportRequest();
        ResultDTO resultDTO = salesReportService.getAllReport(salesReportRequest);
        return ResponseEntity.ok(resultDTO);
    }

    @GetMapping("/daily")
    public ResponseEntity<ResultDTO> getDailySalesReport(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {

        LOG.info("REST request to get daily sales report from {} to {}", fromDate, toDate);
        SalesReportRequest request = new SalesReportRequest();
        request.setFromDate(fromDate);
        request.setToDate(toDate);

        ResultDTO resultDTO = salesReportService.getDailySalesReport(request);
        return ResponseEntity.ok(resultDTO);
    }

    @GetMapping("/monthly")
    public ResponseEntity<ResultDTO> getMonthlySalesReport(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {

        LOG.info("REST request to get monthly sales report from {} to {}", fromDate, toDate);
        SalesReportRequest request = new SalesReportRequest();
        request.setFromDate(fromDate);
        request.setToDate(toDate);

        ResultDTO resultDTO = salesReportService.getMonthlySalesReport(request);
        return ResponseEntity.ok(resultDTO);
    }
}
