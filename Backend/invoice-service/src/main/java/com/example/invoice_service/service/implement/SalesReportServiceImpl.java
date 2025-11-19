package com.example.invoice_service.service.implement;

import com.example.invoice_service.dto.request.SalesReportRequest;
import com.example.invoice_service.dto.response.ResultDTO;
import com.example.invoice_service.dto.response.SaleReportResponse;
import com.example.invoice_service.repository.InvoiceRepository;
import com.example.invoice_service.service.SalesReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
@Transactional
public class SalesReportServiceImpl implements SalesReportService {

    private final InvoiceRepository invoiceRepository;

    public SalesReportServiceImpl(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public ResultDTO getAllReport(SalesReportRequest request) {
        BigDecimal totalRevenue;

        // Xử lý lọc theo ngày
        if (request != null && request.getFromDate() != null && !request.getFromDate().isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDateTime fromDate = LocalDate.parse(request.getFromDate(), formatter).atStartOfDay();
            LocalDateTime toDate = LocalDate.parse(request.getToDate(), formatter).atTime(LocalTime.MAX);

            totalRevenue = invoiceRepository.getTotalRevenueBetween(fromDate, toDate);
        } else {
            totalRevenue = invoiceRepository.getTotalRevenue();
        }

        Long totalOrders = invoiceRepository.countByInvoiceType("COMPLETED");
        Long totalQuantityProduct = invoiceRepository.getTotalQuantitySold();
        Long totalOrdersReturned = invoiceRepository.countReturnedOrders();

        // Tính hiển thị (Triệu đồng)
        BigDecimal totalRevenueDisplay = BigDecimal.ZERO;
        if (totalRevenue.compareTo(BigDecimal.ZERO) > 0) {
            totalRevenueDisplay = totalRevenue.divide(BigDecimal.valueOf(1_000_000), 2, RoundingMode.HALF_UP);
        }

        SaleReportResponse response = new SaleReportResponse(
                totalRevenue,
                totalOrders,
                totalQuantityProduct,
                totalOrdersReturned
        );
        response.setTotalRevenueDisplay(totalRevenueDisplay.toPlainString() + " triệu");

        return new ResultDTO("success", "Lấy báo cáo thành công", true, response);
    }

    @Override
    public ResultDTO getDailySalesReport(SalesReportRequest request) {
        // Logic tương tự, gọi invoiceRepository.getTotalRevenueBetween(...)
        // ... (Bạn có thể copy logic cũ và thay orderRepository bằng invoiceRepository như trên)
        return new ResultDTO("success", "Chức năng đang cập nhật", true, null);
    }

    @Override
    public ResultDTO getMonthlySalesReport(SalesReportRequest request) {
        // Logic tương tự, gọi invoiceRepository.getTotalRevenueBetween(...)
        // ...
        return new ResultDTO("success", "Chức năng đang cập nhật", true, null);
    }
}