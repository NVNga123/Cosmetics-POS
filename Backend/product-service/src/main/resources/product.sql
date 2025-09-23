CREATE DATABASE productDB;

USE productDB;
CREATE TABLE `product` (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           brand VARCHAR(255),
                           category VARCHAR(255),
                           description TEXT,
                           discount double DEFAULT NULL,
                           name varchar(255) DEFAULT NULL,
                           price decimal(38,2) DEFAULT NULL,
                           slug varchar(255) DEFAULT NULL,
                           stock int DEFAULT NULL,
                           image varchar(255) DEFAULT NULL,

                           created_by VARCHAR(50) NOT NULL,
                           created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           last_modified_by VARCHAR(50),
                           last_modified_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


INSERT INTO product (
    brand, category, description, discount, name, price, slug, stock, image,
    created_by, last_modified_by
) VALUES
-- Son môi
('Maybelline', 'Son môi', 'Son lì lâu trôi màu đỏ cam, bám màu 8h', 0,
 'Son lì Maybelline đỏ cam', 150000, 'son-li-maybelline-do-cam', 100, 'maybelline_son.jpg',
 'nhanvien_a', 'nhanvien_a'),

-- Sữa rửa mặt
('Innisfree', 'Chăm sóc da', 'Sữa rửa mặt trà xanh kiềm dầu, dịu nhẹ cho da mụn', 20000,
 'Sữa rửa mặt Innisfree trà xanh', 120000, 'sua-rua-mat-innisfree-tra-xanh', 200, 'innisfree_srm.jpg',
 'nhanvien_b', 'nhanvien_b'),

-- Kem chống nắng
('L\'Oreal', 'Chống nắng', 'Kem chống nắng bảo vệ da SPF50+, chống tia UVA/UVB', 0,
 'Kem chống nắng L\'Oreal SPF50+', 250000, 'kem-chong-nang-loreal-spf50', 150, 'loreal_kcn.jpg',
 'nhanvien_a', 'nhanvien_a'),

-- Serum dưỡng da
('The Ordinary', 'Dưỡng da', 'Serum Niacinamide 10% + Zinc 1% giúp giảm mụn và se khít lỗ chân lông', 50000,
 'Serum The Ordinary Niacinamide 10% + Zinc 1%', 200000, 'serum-the-ordinary-niacinamide', 80, 'ordinary_serum.jpg',
 'nhanvien_a', 'nhanvien_a');

INSERT INTO product (
    brand, category, description, discount, name, price, slug, stock, image,
    created_by, last_modified_by
) VALUES
-- Kem dưỡng ẩm
('Cetaphil', 'Dưỡng ẩm', 'Kem dưỡng ẩm Cetaphil giúp cấp ẩm và phục hồi da khô', 0,
 'Kem dưỡng ẩm Cetaphil Moisturizing Cream', 180000, 'kem-duong-am-cetaphil', 120, 'cetaphil_kem.jpg',
 'nhanvien_b', 'nhanvien_b'),

-- Toner hoa hồng
('Thayers', 'Toner', 'Toner chiết xuất hoa hồng, làm sạch và se khít lỗ chân lông', 15000,
 'Toner Thayers Witch Hazel Rose Petal', 190000, 'toner-thayers-rose', 90, 'thayers_toner.jpg',
 'nhanvien_a', 'nhanvien_a'),

-- Mặt nạ đất sét
('Kiehl\'s', 'Mặt nạ', 'Mặt nạ đất sét Rare Earth Deep Pore Cleansing Masque', 0,
 'Mặt nạ đất sét Kiehl\'s Rare Earth', 320000, 'mat-na-kiehls-rare-earth', 70, 'kiehls_mask.jpg',
 'nhanvien_b', 'nhanvien_b'),

-- Dầu tẩy trang
('DHC', 'Tẩy trang', 'Dầu tẩy trang DHC Deep Cleansing Oil làm sạch sâu', 20000,
 'Dầu tẩy trang DHC Deep Cleansing Oil', 270000, 'dau-tay-trang-dhc', 110, 'dhc_oil.jpg',
 'nhanvien_a', 'nhanvien_a'),

-- Kem nền
('MAC', 'Trang điểm', 'Kem nền MAC Studio Fix Fluid SPF15, che phủ hoàn hảo', 0,
 'Kem nền MAC Studio Fix Fluid SPF15', 450000, 'kem-nen-mac-studio-fix', 60, 'mac_foundation.jpg',
 'nhanvien_b', 'nhanvien_b'),

-- Phấn phủ
('Maybelline', 'Trang điểm', 'Phấn phủ Fit Me Matte + Poreless kiểm soát dầu', 10000,
 'Phấn phủ Maybelline Fit Me Matte + Poreless', 220000, 'phan-phu-maybelline-fit-me', 130, 'maybelline_powder.jpg',
 'nhanvien_a', 'nhanvien_a');
