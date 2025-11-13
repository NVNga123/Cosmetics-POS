package com.example.invoice_service.controller;

// SỬA IMPORTS:
import com.example.invoice_service.dto.response.ResultDTO;
import com.example.invoice_service.service.InvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    // API này cho Admin
    @GetMapping("/admin/all") // Sửa đường dẫn cho rõ ràng
    public ResponseEntity<ResultDTO> getAllInvoicesForAdmin() {
        ResultDTO resultDTO = invoiceService.findAllForAdmin();
        return ResponseEntity.ok(resultDTO);
    }

    // API này cho User
    @GetMapping("/my-history") // Thêm endpoint mới cho user
    public ResponseEntity<ResultDTO> getMyOrderHistory() {
        ResultDTO resultDTO = invoiceService.findAllForUser();
        return ResponseEntity.ok(resultDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultDTO> getOne(@PathVariable Integer id) {
        ResultDTO resultDTO = invoiceService.findOne(id);
        return ResponseEntity.ok(resultDTO);
    }
}