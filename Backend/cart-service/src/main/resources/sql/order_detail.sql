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

