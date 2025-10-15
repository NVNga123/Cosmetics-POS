package com.example.cart_service.service.implement;

import com.example.cart_service.dto.response.OrderResponse;
import com.example.cart_service.dto.request.OrderRequest;
import com.example.cart_service.dto.response.ResultDTO;
import com.example.cart_service.service.OrderService;
import com.example.cart_service.entity.Order;
import com.example.cart_service.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.cart_service.mapper.OrderMapper;
import com.example.cart_service.service.redis.RedisService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final RedisService redisService;

    public OrderServiceImpl(OrderRepository orderRepository, OrderMapper orderMapper, RedisService redisService) {
        this.redisService = redisService;
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
    }

    @Override
    @Transactional
    public ResultDTO save(OrderRequest orderRequest) {
        Order order = orderMapper.toEntity(orderRequest);
        String code = redisService.genCode("DH");
        order.setCode(code);
        order = orderRepository.save(order);
        return new ResultDTO("success", "lưu đơn hàng thành công", true, order, 1);
    }

    public ResultDTO update(OrderRequest orderRequest) {
        Order order = orderRepository.findById(orderRequest.getId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order = orderMapper.updateEntity(orderRequest, order);
        return new ResultDTO("success", "update đơn hàng thành công", true, order, 1);
    }

    @Override
    @Transactional
    public ResultDTO delete(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if(!"DRAFT".equals(order.getStatus())) {
            throw new RuntimeException("Only DRAFT orders can be deleted");
        }
        // Thực sự xóa order khỏi database
        orderRepository.delete(order);
        return new ResultDTO("success", "xoá đơn hàng thành công", true);
    }

    @Override
    @Transactional(readOnly = true)
    public ResultDTO findOne(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return new ResultDTO("success", "lấy đơn hàng thành công", true, order, 1);
    }

    @Override
    @Transactional(readOnly = true)
    public ResultDTO findAll() {
        List<Order> orders = orderRepository.findAll();
        orders.stream().map(order -> {
            OrderResponse dto = orderMapper.toDTO(order);
            return dto;
        }).collect(Collectors.toList());

        return new ResultDTO("success", "lấy danh sách order thành công", true, orders);
    }
}
