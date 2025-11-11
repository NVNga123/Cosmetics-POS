package com.example.invoice_service.service;
import com.example.invoice_service.dto.response.ResultDTO;

public interface InvoiceService {
    ResultDTO findOne(Integer id);
    ResultDTO findAllForAdmin(); // Đổi tên: Dùng cho Admin
    ResultDTO findAllForUser();  // Mới: Dùng cho User
}