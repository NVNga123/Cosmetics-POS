package com.example.invoice_service.mapper;

// SỬA IMPORTS: Đảm bảo tất cả trỏ về "invoice_service"
import com.example.invoice_service.dto.request.OrderRequest;
import com.example.invoice_service.dto.response.OrderItemResponse;
import com.example.invoice_service.dto.response.OrderResponse;
import com.example.invoice_service.entity.Order;
import com.example.invoice_service.entity.OrderDetail;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    // (Các hàm toEntity và updateEntity được giữ lại để tránh lỗi biên dịch,
    // mặc dù invoice-service chỉ đọc)

    public Order toEntity(OrderRequest dto) {
        Order order = new Order();
        order.setCustomerName(dto.getCustomerName());
        order.setTotalAmount(dto.getSubtotal());
        order.setTotalDiscount(dto.getDiscount());
        order.setTaxAmount(dto.getTax());
        order.setFinalPrice(dto.getTotal());
        order.setNote(dto.getNotes());
        order.setReturnReason(dto.getReturnReason());
        order.setStatus(dto.getStatus() != null ? dto.getStatus() : "DRAFT");
        order.setPaymentMethod(dto.getPaymentMethod());
        order.setCashAmount(dto.getCashAmount());
        order.setTransferAmount(dto.getTransferAmount());

        if (dto.getItems() != null) {
            List<OrderDetail> items = dto.getItems().stream().map(itemDTO -> {
                OrderDetail item = new OrderDetail();
                item.setProductId(itemDTO.getProductId());
                item.setProductName(itemDTO.getProductName());
                // DTO uses primitive double; entity uses BigDecimal -> convert safely
                item.setUnitPrice(itemDTO.getPrice() == 0.0 ? BigDecimal.ZERO : BigDecimal.valueOf(itemDTO.getPrice()));
                item.setQuantityProduct(itemDTO.getQuantity());
                item.setTotalPrice(itemDTO.getSubtotal() == 0.0 ? BigDecimal.ZERO : BigDecimal.valueOf(itemDTO.getSubtotal()));
                item.setOrder(order);
                return item;
            }).collect(Collectors.toList());
            order.setOrderDetails(items);
        } else {
            order.setOrderDetails(Collections.emptyList());
        }

        return order;
    }

    public Order updateEntity(OrderRequest dto, Order order) {
        order.setCustomerName(dto.getCustomerName()!= null ? dto.getCustomerName() : order.getCustomerName());
        order.setTotalAmount(dto.getSubtotal());
        order.setTotalDiscount(dto.getDiscount());
        order.setTaxAmount(dto.getTax());
        order.setFinalPrice(dto.getTotal());
        order.setNote(dto.getNotes());
        order.setStatus(dto.getStatus() != null ? dto.getStatus() : order.getStatus());
        order.setReturnReason(dto.getReturnReason()!= null ? dto.getReturnReason() : order.getReturnReason());
        order.setPaymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : order.getPaymentMethod());
        order.setCashAmount(dto.getCashAmount() != null ? dto.getCashAmount() : order.getCashAmount());
        order.setTransferAmount(dto.getTransferAmount() != null ? dto.getTransferAmount() : order.getTransferAmount());

        return order;
    }

    // Hàm này là hàm quan trọng cần sửa
    public OrderResponse toDTO(Order order) { // Đảm bảo 'Order' là com.example.invoice_service.entity.Order
        OrderResponse dto = new OrderResponse();
        dto.setOrderId(order.getId());
        dto.setCode(order.getCode());
        dto.setCustomerName(order.getCustomerName());
        dto.setTotal(order.getFinalPrice());
        dto.setStatus(order.getStatus());

        // Thêm kiểm tra null cho createdDate
        if (order.getCreatedDate() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            dto.setCreatedAt(order.getCreatedDate().atZone(ZoneId.systemDefault()).format(formatter));
        }

        dto.setNotes(order.getNote());
        dto.setReturnReason(order.getReturnReason());
        dto.setPaymentMethod(order.getPaymentMethod());

        // Thêm kiểm tra null cho orderDetails
        if (order.getOrderDetails() != null) {
            List<OrderItemResponse> items = order.getOrderDetails().stream().map(item -> {
                OrderItemResponse itemDTO = new OrderItemResponse();
                itemDTO.setProductId(item.getProductId());
                itemDTO.setProductName(item.getProductName());
                // entity uses BigDecimal; DTO expects double -> convert, guard null
                itemDTO.setPrice(item.getUnitPrice() != null ? item.getUnitPrice().doubleValue() : 0.0);
                itemDTO.setQuantity(item.getQuantityProduct());
                itemDTO.setSubtotal(item.getTotalPrice() != null ? item.getTotalPrice().doubleValue() : 0.0);
                return itemDTO;
            }).collect(Collectors.toList());
            dto.setItems(items);
        } else {
            dto.setItems(Collections.emptyList()); // Đặt danh sách rỗng nếu null
        }

        return dto;
    }
}