package com.example.product_service.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.example.product_service.dto.request.ApiResponse;
import com.example.product_service.dto.request.ProductCreationRequest;
import com.example.product_service.dto.request.ProductUpdateRequest;
import com.example.product_service.dto.response.ProductResponse;
import com.example.product_service.service.ProductService;
import org.springframework.data.domain.Page;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductController {

    ProductService productService;

    // Tạo sản phẩm mới
    @PostMapping
    public ApiResponse<ProductResponse> createProduct(@RequestBody @Valid ProductCreationRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.createProduct(request))
                .build();
    }

    // Lấy tất cả sản phẩm
    @GetMapping()
    public ApiResponse<List<ProductResponse>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size
    ) {
        List<ProductResponse> products;
        long total;

        if (page != null && size != null) {
            // Có phân trang
            products = productService.searchProducts(name, brand, category, page, size);
            total = productService.countProducts(name, brand, category);
        } else {
            // Không phân trang -> lấy hết
            products = productService.searchProducts(name, brand, category, null, null);
            total = products.size();
        }
        return ApiResponse.<List<ProductResponse>>builder()
                .result(products)
                .total(total)
                .build();
    }

    // Lấy sản phẩm theo id
    @GetMapping("/{productId}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable("productId") String productId) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.getProduct(productId))
                .build();
    }

    // Cập nhật sản phẩm
    @PutMapping("/{productId}")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable String productId,
                                                      @RequestBody @Valid ProductUpdateRequest request) {
        return ApiResponse.<ProductResponse>builder()
                .result(productService.updateProduct(productId, request))
                .build();
    }

    // Xóa sản phẩm
    @DeleteMapping("/{productId}")
    public ApiResponse<String> deleteProduct(@PathVariable String productId) {
        productService.deleteProduct(productId);
        return ApiResponse.<String>builder()
                .result("Product has been deleted")
                .build();
    }
}
