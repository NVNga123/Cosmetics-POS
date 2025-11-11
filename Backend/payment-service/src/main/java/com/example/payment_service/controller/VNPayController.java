package com.example.payment_service.controller;

import com.example.payment_service.config.VNPayConfig;
import com.example.payment_service.model.MomoPaymentRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer; // Import
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern; // Import

@RestController
@RequestMapping("/vnpay-payment")
public class VNPayController {

    private final VNPayConfig vnPayConfig;

    public VNPayController(VNPayConfig vnPayConfig) {
        this.vnPayConfig = vnPayConfig;
    }

    // Hàm trợ giúp xóa dấu tiếng Việt
    public static String removeAccents(String s) {
        String temp = Normalizer.normalize(s, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        // Thay thế "Đ" và "đ"
        return pattern.matcher(temp).replaceAll("").replaceAll("Đ", "D").replaceAll("đ", "d");
    }

    @PostMapping()
    public ResponseEntity<?> createVNPayPayment(@RequestBody MomoPaymentRequest paymentReq, HttpServletRequest httpReq) {

        try {
            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            String orderType = "other";
            long amount = paymentReq.getAmount() * 100;
            String vnp_TxnRef = vnPayConfig.getRandomNumber(8);
            String vnp_TmnCode = vnPayConfig.getTmnCode();

            // *** SỬA LỖI IP: Ép IP thành 127.0.0.1 nếu là localhost IPv6 ***
            String vnp_IpAddr = vnPayConfig.getIpAddress(httpReq);
            if (vnp_IpAddr.equals("0:0:0:0:0:0:0:1") || vnp_IpAddr.equals("::1")) {
                vnp_IpAddr = "127.0.0.1";
            }

            // SỬA LỖI Chữ ký: Xóa dấu tiếng Việt
            String orderInfo = "Thanh toan don hang " + paymentReq.getOrderInfo();
            String vnp_OrderInfo = removeAccents(orderInfo);

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(amount));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo); // Dùng chuỗi đã xóa dấu
            vnp_Params.put("vnp_OrderType", orderType);
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr); // Dùng IP đã sửa

            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

            // Build data to hash
            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            Iterator<String> itr = fieldNames.iterator();

            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {

                    // SỬA LỖI Chữ ký: Thay thế '+' bằng '%20'
                    String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()).replace("+", "%20");

                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(encodedValue);

                    query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8.toString()));
                    query.append('=');
                    query.append(encodedValue);

                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }

            String queryUrl = query.toString();
            String vnp_SecureHash = vnPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
            queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
            String paymentUrl = vnPayConfig.getVnpUrl() + "?" + queryUrl;

            // In ra chuỗi hash và chữ ký để debug (nếu cần)
            System.out.println("VNPay hashData (final): " + hashData.toString());
            System.out.println("VNPay vnp_SecureHash (final): " + vnp_SecureHash);

            return ResponseEntity.ok(Collections.singletonMap("payUrl", paymentUrl));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("error", "Lỗi khi tạo thanh toán VNPay: " + e.getMessage()));
        }
    }
}