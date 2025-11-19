package com.example.invoice_service.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChartItemDTO {
    private String label;   // Ví dụ: "10:00", "Ngày 01", "Tháng 05"
    private BigDecimal value; // Doanh thu tại mốc đó
}