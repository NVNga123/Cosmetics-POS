package com.example.cart_service.service.implement;

import com.example.cart_service.dto.request.SalesReportRequest;
import com.example.cart_service.dto.response.ResultDTO;
import com.example.cart_service.dto.response.SaleReportResponse;
import com.example.cart_service.entity.Order;
import com.example.cart_service.repository.OrderDetailReposotory;
import com.example.cart_service.repository.OrderRepository;
import com.example.cart_service.service.SalesReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class SalesReportServiceImpl implements SalesReportService {

    private final OrderRepository orderRepository;
    private final OrderDetailReposotory orderDetailReposotory;

    public SalesReportServiceImpl(OrderRepository orderRepository, OrderDetailReposotory orderDetailReposotory){
        this.orderRepository = orderRepository;
        this.orderDetailReposotory = orderDetailReposotory;
    }

    @Override
    @Transactional
    public ResultDTO getAllReport(SalesReportRequest salesReportRequest){
        BigDecimal totalRevenue = orderRepository.getTotalRevenue();
        Long totalOrder = orderRepository.count();
        Long totalQuantityProduct = orderDetailReposotory.getTotalQuantityProduct();
        Long totalOrdersReturned = orderRepository.countReturnedOrders();
        BigDecimal totalRevenueDisplay = totalRevenue.divide(BigDecimal.valueOf(1_000_000)).setScale(2, RoundingMode.HALF_UP);

        SaleReportResponse reportSummary = new SaleReportResponse(totalRevenue, totalOrder,totalQuantityProduct, totalOrdersReturned );

        reportSummary.setTotalRevenueDisplay(totalRevenueDisplay.toPlainString());

        return new ResultDTO("success", "lấy báo cáo thành công", true, reportSummary);
    }

    @Override
    @Transactional
    public ResultDTO getDailySalesReport(SalesReportRequest salesReportRequest){
        ZoneId vietnamZone = ZoneId.of("Asia/Ho_Chi_Minh");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String today = LocalDate.now(vietnamZone).format(formatter);

        if (salesReportRequest.getFromDate() == null || salesReportRequest.getFromDate().isEmpty()) {
            salesReportRequest.setFromDate(today);
        }
        if (salesReportRequest.getToDate() == null ||salesReportRequest.getToDate().isEmpty()) {
            salesReportRequest.setToDate(today);
        }

        Instant fromDate = LocalDate.parse(salesReportRequest.getFromDate()).atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant toDate = LocalDate.parse(salesReportRequest.getToDate()).atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant();

        BigDecimal revenueDaily = orderRepository.getTotalRevenue(fromDate, toDate);
        return new ResultDTO("OK", "Báo cáo doanh thu theo ngày", true,revenueDaily);
    }

    @Override
    @Transactional
    public ResultDTO getMonthlySalesReport(SalesReportRequest salesReportRequest) {
        ZoneId vietnamZone = ZoneId.of("Asia/Ho_Chi_Minh");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        if (salesReportRequest.getFromDate() == null || salesReportRequest.getFromDate().isEmpty() ||
                salesReportRequest.getToDate() == null || salesReportRequest.getToDate().isEmpty()) {

            LocalDate now = LocalDate.now(vietnamZone);
            LocalDate firstDayOfMonth = now.withDayOfMonth(1);
            LocalDate lastDayOfMonth = now.withDayOfMonth(now.lengthOfMonth());

            salesReportRequest.setFromDate(firstDayOfMonth.format(formatter));
            salesReportRequest.setToDate(lastDayOfMonth.format(formatter));
        }

        Instant fromDate = LocalDate.parse(salesReportRequest.getFromDate(), formatter)
                .atStartOfDay(vietnamZone).toInstant();
        Instant toDate = LocalDate.parse(salesReportRequest.getToDate(), formatter)
                .atTime(23, 59, 59).atZone(vietnamZone).toInstant();

        BigDecimal revenueMonth = orderRepository.getTotalRevenue(fromDate, toDate);
        if (revenueMonth == null) {
            revenueMonth = BigDecimal.ZERO;
        }

        return new ResultDTO("OK", "Báo cáo doanh thu tháng này", true, revenueMonth);
    }
}