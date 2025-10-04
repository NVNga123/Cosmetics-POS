package com.example.cart_service.mapper;

import com.example.cart_service.dto.OrderItemDTO;
import com.example.cart_service.dto.OrderResponseDTO;
import com.example.cart_service.dto.OrderSubmitDTO;
import com.example.cart_service.entity.Order;
import com.example.cart_service.entity.OrderDetail;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public Order toEntity(OrderSubmitDTO dto) {
        Order order = new Order();
        order.setCustomerName(dto.getCustomerName());
        order.setTotalAmount(dto.getSubtotal());
        order.setTotalDiscount(dto.getDiscount());
        order.setTaxAmount(dto.getTax());
        order.setFinalPrice(dto.getTotal());
        order.setNote(dto.getNotes());
        order.setReturnReason(dto.getReturnReason());
        order.setStatus(dto.getStatus() != null ? dto.getStatus() : "DRAFT");

        List<OrderDetail> items = dto.getItems().stream().map(itemDTO -> {
            OrderDetail item = new OrderDetail();
            item.setProductId(itemDTO.getProductId());
            item.setProductName(itemDTO.getProductName());
            item.setUnitPrice(itemDTO.getPrice());
            item.setQuantityProduct(itemDTO.getQuantity());
            item.setTotalPrice(itemDTO.getSubtotal());
            item.setOrder(order);
            return item;
        }).collect(Collectors.toList());

        order.setOrderDetails(items);
        return order;
    }

    public Order updateEntity(OrderSubmitDTO dto, Order order) {
        order.setCustomerName(dto.getCustomerName()!= null ? dto.getCustomerName() : order.getCustomerName());
        order.setTotalAmount(dto.getSubtotal());
        order.setTotalDiscount(dto.getDiscount());
        order.setTaxAmount(dto.getTax());
        order.setFinalPrice(dto.getTotal());
        order.setNote(dto.getNotes());
        order.setStatus(dto.getStatus() != null ? dto.getStatus() : order.getStatus());
        order.setReturnReason(dto.getReturnReason()!= null ? dto.getReturnReason() : order.getReturnReason());

        return order;
    }

    public OrderResponseDTO toDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setOrderId(order.getId());
        dto.setCode(order.getCode());
        dto.setCustomerName(order.getCustomerName());
        dto.setTotal(order.getFinalPrice());
        dto.setStatus(order.getStatus());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        dto.setCreatedAt(order.getCreatedDate().atZone(ZoneId.systemDefault()).format(formatter));
        dto.setNotes(order.getNote());
        dto.setReturnReason(order.getReturnReason());

        List<OrderItemDTO> items = order.getOrderDetails().stream().map(item -> {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setProductId(item.getProductId());
            itemDTO.setProductName(item.getProductName());
            itemDTO.setPrice(item.getUnitPrice());
            itemDTO.setQuantity(item.getQuantityProduct());
            itemDTO.setSubtotal(item.getTotalPrice());
            return itemDTO;
        }).collect(Collectors.toList());

        dto.setItems(items);
        return dto;
    }
}
