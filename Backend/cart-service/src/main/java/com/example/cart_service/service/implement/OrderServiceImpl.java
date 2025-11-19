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
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final RedisService redisService;
    private final RestTemplate restTemplate;

    // URL của Invoice Service (thông qua Gateway localhost:8888 hoặc trực tiếp 8089)
    // Nếu chạy qua Gateway thì là: http://localhost:8888/api/v1/invoices/create
    // Nếu chạy trực tiếp thì là: http://localhost:8089/invoices/create
    private static final String INVOICE_SERVICE_URL = "http://localhost:8089/invoices/create";
    private static final String INVENTORY_SERVICE_URL = "http://localhost:8085/inventory/update";

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

        // Nếu tạo đơn mới mà trạng thái đã là COMPLETED (ví dụ thanh toán ngay)
        // thì cũng cần trừ kho và tạo hóa đơn ngay lập tức.
        if ("COMPLETED".equals(orderRequest.getStatus())) {
            if (orderRequest.getItems() != null && !orderRequest.getItems().isEmpty()) {
                updateInventory(orderRequest.getItems());
            }
            // Tạo hóa đơn ngay
            sendInvoiceCreateRequest(order, "COMPLETED");
        }
        else if (orderRequest.getItems() != null && !orderRequest.getItems().isEmpty()) {
            // Nếu chỉ là DRAFT thì chỉ giữ chỗ tồn kho (nếu logic yêu cầu) hoặc trừ kho
            updateInventory(orderRequest.getItems());
        }

        OrderResponse orderResponse = orderMapper.toDTO(order);
        return new ResultDTO("success", "lưu đơn hàng thành công", true, orderResponse, 1);
    }

    @Override
    public ResultDTO update(OrderRequest orderRequest) {
        Order existingOrder = orderRepository.findById(orderRequest.getId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String oldStatus = existingOrder.getStatus();
        String newStatus = orderRequest.getStatus();

        // 1. Cập nhật thông tin đơn hàng
        existingOrder = orderMapper.updateEntity(orderRequest, existingOrder);
        existingOrder = orderRepository.save(existingOrder); // Lưu xuống DB trước

        // 2. Kiểm tra thay đổi trạng thái để xử lý nghiệp vụ
        if (!oldStatus.equals(newStatus)) {

            // Trường hợp 1: Hoàn thành đơn hàng (DRAFT -> COMPLETED)
            if ("COMPLETED".equals(newStatus)) {
                sendInvoiceCreateRequest(existingOrder, "COMPLETED");
            }

            // Trường hợp 2: Hủy đơn hoặc Trả hàng (COMPLETED -> CANCELLED/RETURNED)
            else if ("COMPLETED".equals(oldStatus) && ("CANCELLED".equals(newStatus) || "RETURNED".equals(newStatus))) {

                // Hoàn trả tồn kho
                if (existingOrder.getOrderDetails() != null && !existingOrder.getOrderDetails().isEmpty()) {
                    returnInventory(existingOrder.getOrderDetails());
                }

                // Tạo hóa đơn (Hóa đơn hoàn trả / Credit Note)
                sendInvoiceCreateRequest(existingOrder, newStatus);
            }

            // Trường hợp 3: Đang DRAFT mà Hủy luôn (DRAFT -> CANCELLED)
            else if ("DRAFT".equals(oldStatus) && "CANCELLED".equals(newStatus)) {
                // Chỉ cần hoàn tồn kho, không cần tạo hóa đơn tài chính (hoặc tùy nghiệp vụ)
                if (existingOrder.getOrderDetails() != null && !existingOrder.getOrderDetails().isEmpty()) {
                    returnInventory(existingOrder.getOrderDetails());
                }
            }
        }

        OrderResponse orderResponse = orderMapper.toDTO(existingOrder);
        return new ResultDTO("success", "update đơn hàng thành công", true, orderResponse, 1);
    }

    // Hàm gửi yêu cầu sang Invoice Service
    private void sendInvoiceCreateRequest(Order order, String invoiceType) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("orderId", order.getId());
            payload.put("code", order.getCode());
            payload.put("invoiceType", invoiceType); // COMPLETED, RETURNED, ...
            payload.put("customerName", order.getCustomerName());
            payload.put("totalAmount", order.getFinalPrice());
            payload.put("paymentMethod", order.getPaymentMethod());

            // Map chi tiết sản phẩm
            List<Map<String, Object>> detailList = new ArrayList<>();
            if (order.getOrderDetails() != null) {
                for (OrderDetail d : order.getOrderDetails()) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("productId", d.getProductId());
                    item.put("productName", d.getProductName());
                    item.put("quantity", d.getQuantityProduct());
                    item.put("unitPrice", d.getUnitPrice());
                    detailList.add(item);
                }
            }
            payload.put("items", detailList);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            // Gọi API bất đồng bộ hoặc try-catch để không chặn luồng chính nếu lỗi
            restTemplate.postForEntity(INVOICE_SERVICE_URL, entity, ResultDTO.class);

        } catch (Exception e) {
            // Chỉ log lỗi, không throw exception để tránh rollback giao dịch đơn hàng
            System.err.println("Lỗi khi gọi Invoice Service: " + e.getMessage());
        }
    }

    private void updateInventory(List<OrderItemResponse> items) {
        try {
            List<Map<String, Object>> inventoryItems = new ArrayList<>();
            for (OrderItemResponse item : items) {
                Map<String, Object> inventoryItem = new HashMap<>();
                inventoryItem.put("productId", item.getProductId());
                inventoryItem.put("quantity", item.getQuantity());
                inventoryItem.put("operation", -1); // Trừ kho
                inventoryItems.add(inventoryItem);
            }
            callInventoryService(inventoryItems);
        } catch (Exception e) {
            System.err.println("Failed to update inventory: " + e.getMessage());
        }
    }

    private void returnInventory(List<OrderDetail> orderDetails) {
        try {
            List<Map<String, Object>> inventoryItems = new ArrayList<>();
            for (OrderDetail detail : orderDetails) {
                Map<String, Object> inventoryItem = new HashMap<>();
                inventoryItem.put("productId", detail.getProductId());
                inventoryItem.put("quantity", detail.getQuantityProduct());
                inventoryItem.put("operation", 1); // Cộng lại kho
                inventoryItems.add(inventoryItem);
            }
            callInventoryService(inventoryItems);
        } catch (Exception e) {
            System.err.println("Failed to return inventory: " + e.getMessage());
        }
    }

    private void callInventoryService(List<Map<String, Object>> inventoryItems) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<List<Map<String, Object>>> entity = new HttpEntity<>(inventoryItems, headers);
        restTemplate.exchange(INVENTORY_SERVICE_URL, HttpMethod.POST, entity, String.class);
    }

    @Override
    @Transactional
    public ResultDTO delete(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Logic xóa mềm (soft delete)
        if ("DRAFT".equals(order.getStatus())) {
            // Nếu là nháp thì có thể xóa cứng hoặc trả tồn kho rồi xóa
            if (order.getOrderDetails() != null && !order.getOrderDetails().isEmpty()) {
                returnInventory(order.getOrderDetails());
            }
            orderRepository.delete(order);
            return new ResultDTO("success", "Xóa đơn hàng nháp thành công", true);
        } else {
            // Nếu đã hoàn thành, chỉ đánh dấu xóa (soft delete)
            order.setDeletedByUser(true);
            orderRepository.save(order);
            return new ResultDTO("success", "Đã ẩn đơn hàng khỏi lịch sử", true);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ResultDTO findOne(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        OrderResponse orderResponse = orderMapper.toDTO(order);
        return new ResultDTO("success", "Lấy đơn hàng thành công", true, orderResponse, 1);
    }

    @Override
    @Transactional(readOnly = true)
    public ResultDTO findAll() {
        List<Order> orders = orderRepository.findAll();
        List<OrderResponse> orderResponses = orders.stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
        return new ResultDTO("success", "Lấy danh sách đơn hàng thành công", true, orderResponses);
    }
}