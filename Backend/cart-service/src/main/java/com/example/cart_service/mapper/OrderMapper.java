package com.example.cart_service.mapper;

import com.example.cart_service.dto.OrderItemDTO;
import com.example.cart_service.dto.OrderResponseDTO;
import com.example.cart_service.dto.OrderSubmitDTO;
import com.example.cart_service.entity.Order;
import com.example.cart_service.entity.OrderDetail;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public static Order toEntity(OrderSubmitDTO dto) {
        Order order = new Order();
        order.setCustomerName(dto.getCustomerName());
        order.setTotalAmount(dto.getSubtotal());
        order.setTotalDiscount(dto.getDiscount());
        order.setTaxAmount(dto.getTax());
        order.setFinalPrice(dto.getTotal());
        order.setNote(dto.getNotes());
        order.setStatus("NEW");

        List<OrderDetail> items = dto.getItems().stream().map(itemDTO -> {
            OrderDetail item = new OrderDetail();
            item.setProductId(itemDTO.getProductId());
            item.setUnitPrice(itemDTO.getPrice());
            item.setQuantityProduct(itemDTO.getQuantity());
            item.setTotalPrice(itemDTO.getSubtotal());
            item.setOrder(order);
            return item;
        }).collect(Collectors.toList());

        order.setOrderDetails(items);
        return order;
    }
}
