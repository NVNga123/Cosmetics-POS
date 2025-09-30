package com.example.cart_service.controller;


import com.example.cart_service.dto.OrderResponseDTO;
import com.example.cart_service.dto.OrderSubmitDTO;
import com.example.cart_service.service.OrderService;
import org.junit.platform.commons.logging.Logger;
import com.example.cart_service.entity.Order;
import org.junit.platform.commons.logging.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private static final Logger LOG = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody OrderSubmitDTO orderSubmitDTO) throws URISyntaxException {
        LOG.debug(() -> "REST request to save Order : " + orderSubmitDTO);
        Order result = orderService.save(orderSubmitDTO);
        return ResponseEntity.created(new URI("/api/orders/" + result.getId())).body(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> update(@PathVariable Integer id, @RequestBody OrderSubmitDTO orderSubmitDTO) throws URISyntaxException {
        LOG.debug(() -> "REST request to update Order : " + orderSubmitDTO);
        if(orderSubmitDTO.getId() == null || !orderSubmitDTO.getId().equals(id)) {
            return ResponseEntity.badRequest().build();
        }
        Order result = orderService.update(orderSubmitDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders(){
        LOG.debug(() -> "REST request to get all Orders");
        List<OrderResponseDTO> orders = orderService.findAll();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOne(@PathVariable Integer id) {
        LOG.debug(() -> "REST request to get Order : " + id);
        Optional<Order> orderOpt = orderService.findOne(id);
        return orderOpt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        LOG.debug(() -> "REST request to delete Order : " + id);
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
