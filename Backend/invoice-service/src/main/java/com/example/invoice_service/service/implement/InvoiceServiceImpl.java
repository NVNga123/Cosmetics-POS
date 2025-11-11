package com.example.invoice_service.service.implement;

// SỬA IMPORTS: Đảm bảo tất cả đến từ "invoice_service"
import com.example.invoice_service.dto.response.OrderResponse;
import com.example.invoice_service.dto.response.ResultDTO;
import com.example.invoice_service.entity.Order;
import com.example.invoice_service.mapper.OrderMapper;
import com.example.invoice_service.repository.OrderRepository;
import com.example.invoice_service.service.InvoiceService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    public InvoiceServiceImpl(OrderRepository orderRepository, OrderMapper orderMapper) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public ResultDTO findOne(Integer id) {
        // 1. Lấy Order entity từ CSDL (của invoice_service)
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // 2. Chuyển đổi sang DTO
        OrderResponse orderResponse = orderMapper.toDTO(order);

        // 3. Trả về DTO trong ResultDTO
        return new ResultDTO("success", "lấy đơn hàng thành công", true, orderResponse, 1);
    }

    @Override
    @Transactional(readOnly = true)
    public ResultDTO findAllForAdmin() {
        // 1. Lấy danh sách Order entity (của invoice_service)
        List<Order> orders = orderRepository.findAll();

        // 2. SỬA LỖI LOGIC: Chuyển đổi List<Order> thành List<OrderResponse>
        List<OrderResponse> orderResponses = orders.stream()
                .map(orderMapper::toDTO) // Sửa lỗi "invalid method reference"
                .collect(Collectors.toList());

        // 3. Trả về danh sách DTO (orderResponses), không phải danh sách Entity (orders)
        return new ResultDTO("success", "lấy danh sách order (Admin)", true, orderResponses);
    }

    @Override
    @Transactional(readOnly = true)
    public ResultDTO findAllForUser() { // Hàm mới cho User
        // Gọi hàm query mới, chỉ lấy các đơn hàng CHƯA bị user xóa
        List<Order> orders = orderRepository.findAllForUser();

        List<OrderResponse> orderResponses = orders.stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());

        return new ResultDTO("success", "lấy danh sách order (User)", true, orderResponses);
    }
}