CREATE DATABASE cartDB;

USE cartDB;
CREATE TABLE orders (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        customer_id INT,
                        user_name VARCHAR(100),
                        customer_name VARCHAR(255),
                        note TEXT,
                        status VARCHAR(50),
                        total_quantity INT,
                        discount_id INT,
                        total_discount DOUBLE,
                        tax_rate DOUBLE,
                        tax_amount DOUBLE,
                        total_amount DOUBLE,
                        payment_method VARCHAR(50),
                        final_price DOUBLE,

                        created_by VARCHAR(50) NOT NULL DEFAULT 'system',
                        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        last_modified_by VARCHAR(50),
                        last_modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

/*                         CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
                       CONSTRAINT fk_discount FOREIGN KEY (discount_id) REFERENCES discounts(id)  */
);

INSERT INTO orders (
    customer_id, user_name, customer_name, note, status,
    total_quantity, discount_id, total_discount, tax_rate, tax_amount,
    total_amount, payment_method, final_price,
    created_by, last_modified_by
) VALUES
      (1, 'nhanvien_a', 'Khách lẻ', 'Không', 'CREATED',
       3, NULL, 0, 10, 30000,
       300000, 'CASH', 330000,
       'nhanvien_a', 'nhanvien_a'),

      (2, 'nhanvien_b', 'Khách lẻ', 'Không', 'CONFIRMED',
       2, NULL, 0, 5, 12500,
       250000, 'MOMO', 212500,
       'nhanvien_b', 'nhanvien_b'),

      (3, 'nhanvien_a', 'Khách lẻ', 'Không', 'CREATED',
       5, NULL, 0, 8, 40000,
       500000, 'BANK', 540000,
       'nhanvien_a', 'nhanvien_a'),

      (4, 'nhanvien_a', 'Khách lẻ', 'Không', 'COMPLETED',
       4, NULL, 0, 10, 42500,
       425000, 'CASH', 392500,
       'nhanvien_a', 'nhanvien_a');
