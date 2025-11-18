package com.example.cart_service.service.implement;

import com.example.cart_service.dto.response.OrderItemResponse;
import com.example.cart_service.dto.response.OrderResponse;
import com.example.cart_service.dto.request.OrderRequest;
import com.example.cart_service.dto.response.ResultDTO;
import com.example.cart_service.entity.OrderDetail;
import com.example.cart_service.service.OrderService;
import com.example.cart_service.entity.Order;
import com.example.cart_service.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.cart_service.mapper.OrderMapper;
import com.example.cart_service.service.redis.RedisService;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final RedisService redisService;
    private final RestTemplate restTemplate;

    public OrderServiceImpl(OrderRepository orderRepository, OrderMapper orderMapper, RedisService redisService, RestTemplate restTemplate) {
        this.redisService = redisService;
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.restTemplate = restTemplate;
    }

    @Override
    @Transactional
    public ResultDTO save(OrderRequest orderRequest) {
        Order order = orderMapper.toEntity(orderRequest);
        String code = redisService.genCode("DH");
        order.setCode(code);
        order = orderRepository.save(order);

        if (orderRequest.getItems() != null && !orderRequest.getItems().isEmpty()) {
            try {
                updateInventory(orderRequest.getItems());
            } catch (Exception e) {
                System.err.println("Failed to update inventory: " + e.getMessage());
            }
        }

        // Convert Order entity to OrderResponse DTO
        OrderResponse orderResponse = orderMapper.toDTO(order);
        return new ResultDTO("success", "lưu đơn hàng thành công", true, orderResponse, 1);
    }

    // giảm
    private void updateInventory(List<OrderItemResponse> items) {
        List<Map<String, Object>> inventoryItems = new ArrayList<>();

        for (OrderItemResponse item : items) {
            Map<String, Object> inventoryItem = new HashMap<>();
            inventoryItem.put("productId", item.getProductId());
            inventoryItem.put("quantity", item.getQuantity());
            inventoryItem.put("operation", -1);
            inventoryItems.add(inventoryItem);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<Map<String, Object>>> entity = new HttpEntity<>(inventoryItems, headers);

        String url = "http://localhost:8085/inventory/update";
        restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
    }

    public ResultDTO update(OrderRequest orderRequest) {
        Order existingOrder = orderRepository.findById(orderRequest.getId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String oldStatus = existingOrder.getStatus();
        String newStatus = orderRequest.getStatus();

        if ("COMPLETED".equals(oldStatus) && ("CANCELLED".equals(newStatus) || "RETURNED".equals(newStatus))) {

            // return inventory
            if (existingOrder.getOrderDetails() != null && !existingOrder.getOrderDetails().isEmpty()) {
                try {
                    returnInventory(existingOrder.getOrderDetails());
                } catch (Exception e) {
                    System.err.println("Failed to return inventory: " + e.getMessage());
                }
            }

            // create invoice
            try {
                sendInvoiceCreateRequest(existingOrder, newStatus);
            } catch (Exception e) {
                System.err.println("Failed to create invoice: " + e.getMessage());
            }
        }


        existingOrder = orderMapper.updateEntity(orderRequest, existingOrder);
        // Convert Order entity to OrderResponse DTO
        OrderResponse orderResponse = orderMapper.toDTO(existingOrder);
        return new ResultDTO("success", "update đơn hàng thành công", true, orderResponse, 1);
    }

    // send full order to inventory
    private void returnInventory(List<OrderDetail> orderDetails) {
        List<Map<String, Object>> inventoryItems = new ArrayList<>();

        for (OrderDetail detail : orderDetails) {
            Map<String, Object> inventoryItem = new HashMap<>();
            inventoryItem.put("productId", detail.getProductId());
            inventoryItem.put("quantity", detail.getQuantityProduct());
            inventoryItem.put("operation", 1);
            inventoryItems.add(inventoryItem);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<Map<String, Object>>> entity = new HttpEntity<>(inventoryItems, headers);

        String url = "http://localhost:8085/inventory/update";
        restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
    }


    // send full order to invoice
    private void sendInvoiceCreateRequest(Order existingOrder, String newStatus) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("orderId", existingOrder.getId());
            payload.put("invoiceType", newStatus);
            payload.put("customerId", existingOrder.getCustomerId());
            payload.put("totalAmount", existingOrder.getTotalAmount());

            List<Map<String, Object>> detailList = new ArrayList<>();

            for (OrderDetail d : existingOrder.getOrderDetails()) {
                Map<String, Object> item = new HashMap<>();
                item.put("productId", d.getProductId());
                item.put("productName", d.getProductName()); // nếu có
                item.put("quantity", d.getQuantityProduct());
                item.put("unitPrice", d.getUnitPrice());
                detailList.add(item);
            }

            payload.put("items", detailList);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            restTemplate.postForEntity("http://localhost:8089/invoices/create", entity, Void.class);

        } catch (Exception e) {
            System.err.println("Error creating invoice: " + e.getMessage());
        }
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
        // Convert Order entity to OrderResponse DTO
        OrderResponse orderResponse = orderMapper.toDTO(order);
        return new ResultDTO("success", "lấy đơn hàng thành công", true, orderResponse, 1);
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
