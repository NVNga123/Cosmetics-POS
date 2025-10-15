package com.example.product_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryUpdateRequest {
    
    @NotEmpty(message = "Product items cannot be empty")
    private List<ProductInventoryItem> items;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductInventoryItem {
        @NotNull(message = "Product ID cannot be null")
        private String productId;
        
        @NotNull(message = "Quantity cannot be null")
        private Integer quantity;
        
        @NotNull(message = "Operation type cannot be null")
        private Integer operation; // 1 for add, -1 for subtract
    }
}
