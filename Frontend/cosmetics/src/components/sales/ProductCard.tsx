import React from 'react';
import type { ProductCardProps } from '../../types/product';

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToOrder }) => {
  const handleClick = () => {
    onAddToOrder(product);
  };

  return (
    <div 
      className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 wrap-product-container"
      onClick={handleClick}
    >
      <div className="pos-stock-product">
        <div className="product">
          <div className="img">
            <img
                src={product.image || 'https://via.placeholder.com/200x200?text=No+Image'}
                alt={product.name}
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/200x200?text=No+Image';
              }}
            />
          </div>
          <div className="product-info">
            <h4 className="title">{product.name}</h4>
            <div className="price">{product.price.toLocaleString()}đ</div>
            <div className="stock">Tồn: {product.stock}</div>
          </div>
        </div>
      </div>
    </div>
  );
};


