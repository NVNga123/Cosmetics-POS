package com.example.product_service.dto.request;

import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductUpdateRequest {

    @Size(min = 2, message = "PRODUCT_NAME_INVALID")
    String name;

    String image;

    String description;

    String brand;

    String category;

    @PositiveOrZero(message = "PRICE_INVALID")
    BigDecimal price;

    @PositiveOrZero(message = "DISCOUNT_INVALID")
    Double discount;

    @PositiveOrZero(message = "STOCK_INVALID")
    Integer stock;

    String slug;
}
