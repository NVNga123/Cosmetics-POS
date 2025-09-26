package com.example.cart_service.service;

import com.example.cart_service.dto.OrderSubmitDTO;
import com.example.cart_service.entity.Order;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    Order save(OrderSubmitDTO orderSubmitDTO);

    void delete(Integer id);

    Optional<Order> findOne(Integer id);

    List<Order> findAll();


}
