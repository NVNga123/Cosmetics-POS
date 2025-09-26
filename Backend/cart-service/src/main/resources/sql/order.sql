
USE cartDB;
CREATE TABLE orders (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        code VARCHAR(50) UNIQUE,
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
