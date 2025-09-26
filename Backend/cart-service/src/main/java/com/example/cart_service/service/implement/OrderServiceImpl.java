package com.example.cart_service.service.implement;

import com.example.cart_service.dto.OrderResponseDTO;
import com.example.cart_service.dto.OrderSubmitDTO;
import com.example.cart_service.service.OrderService;
import com.example.cart_service.entity.Order;
import com.example.cart_service.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.cart_service.mapper.OrderMapper;
import com.example.cart_service.redis.RedisService;

import java.util.List;
import java.util.Optional;
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
    public Order save(OrderSubmitDTO orderSubmitDTO) {
        Order order = new Order();
        order = orderMapper.toEntity(orderSubmitDTO);
        String code = redisService.genCode("DH");
        order.setCode(code);
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        orderRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Order> findOne(Integer id) {
        return orderRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> findAll() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(order ->{
            OrderResponseDTO dto = orderMapper.toDTO(order);
            return dto;
        }) .collect(Collectors.toList());

    }
}
