USE cartDB;
CREATE TABLE order_detail (
                              id INT AUTO_INCREMENT PRIMARY KEY,
                              order_id INT NOT NULL,
                              product_id INT NOT NULL,
                              quantity_product INT,
                              unit_price DECIMAL(18,2),
                              total_price DECIMAL(18,2),
                              discount_amount DECIMAL(18,2),

                              created_by VARCHAR(50) NOT NULL DEFAULT 'system',
                              created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              last_modified_by VARCHAR(50),
                              last_modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                              CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE

);

-- Đơn hàng 1: Nhân viên A bán cho Khách lẻ
INSERT INTO order_detail (
    order_id, product_id, quantity_product, unit_price, total_price, discount_amount,
    created_by, last_modified_by
) VALUES
      (1, 101, 2, 150000, 300000, 0, 'nhanvien_a', 'nhanvien_a'),
      (1, 102, 1, 100000, 100000, 0, 'nhanvien_a', 'nhanvien_a');

-- Đơn hàng 2: Nhân viên B bán cho Khách lẻ
INSERT INTO order_detail (
    order_id, product_id, quantity_product, unit_price, total_price, discount_amount,
    created_by, last_modified_by
) VALUES
    (2, 103, 1, 250000, 250000, 0, 'nhanvien_b', 'nhanvien_b');

-- Đơn hàng 3: Nhân viên A bán cho Khách lẻ
INSERT INTO order_detail (
    order_id, product_id, quantity_product, unit_price, total_price, discount_amount,
    created_by, last_modified_by
) VALUES
      (3, 101, 3, 150000, 450000, 0, 'nhanvien_a', 'nhanvien_a'),
      (3, 104, 2, 200000, 400000, 20000, 'nhanvien_a', 'nhanvien_a');

-- Đơn hàng 4: Nhân viên A bán cho Khách lẻ
INSERT INTO order_detail (
    order_id, product_id, quantity_product, unit_price, total_price, discount_amount,
    created_by, last_modified_by
) VALUES
      (4, 102, 2, 100000, 200000, 0, 'nhanvien_a', 'nhanvien_a'),
      (4, 104, 2, 200000, 400000, 75000, 'nhanvien_a', 'nhanvien_a');


