package com.example.cart_service.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        //Đăng ký module giúp Jackson hiểu Instant, LocalDateTime, ...
        mapper.registerModule(new JavaTimeModule());

        //Tắt timestamp để hiển thị dạng chuỗi ISO-8601 (2025-10-10T09:37:00Z)
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        //Tắt định dạng khoa học (E+7)
        mapper.configure(SerializationFeature.WRITE_BIGDECIMAL_AS_PLAIN, true);
        return mapper;
    }
}
