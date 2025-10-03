import React from 'react';
import type { ProductCardProps } from '../../types/product';

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToOrder }) => {
  const handleClick = () => {
    onAddToOrder(product);
  };

  const discount = product.discount ?? 0; // default = 0
  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount
      ? product.price - (product.price * discount) / 100
      : product.price;

  return (
      <div
          className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 wrap-product-container"
          onClick={handleClick}
      >
        <div
            className="pos-stock-product"
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: 'auto',
              padding: '8px',
            }}
        >
          <div className="product">
            <div className="img" style={{ textAlign: 'center' }}>
              <img
                  src={product.image || 'https://via.placeholder.com/200x200?text=No+Image'}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/200x200?text=No+Image';
                  }}
                  style={{ maxHeight: '150px', objectFit: 'cover',  width: '100%' }}
              />
            </div>

            <div
                className="product-info"
                style={{
                  padding: '4px 0 4px 6px',
                  lineHeight: 1.2,
                }}
            >
              <h4
                  className="title"
                  style={{
                    fontSize: '0.9rem',
                    margin: '0 0 2px 0',
                  }}
              >
                {product.name}
              </h4>

              {hasDiscount ? (
                  <div className="price" style={{ margin: '0 0 2px 0' }}>
                <span
                    style={{
                      textDecoration: 'line-through',
                      marginRight: '6px',
                      color: 'gray',
                      fontSize: '0.7rem',
                      fontWeight: 300,
                    }}
                >
                  {product.price.toLocaleString()}đ
                </span>
                    <span
                        style={{
                          fontWeight: 500,
                          color: '#007bff',
                          fontSize: '0.95rem',
                        }}
                    >
                  {discountedPrice.toLocaleString()}đ
                </span>
                    <span
                        style={{
                          color: 'red',
                          display: 'block',
                          fontSize: '0.8rem',
                          marginTop: '2px',
                        }}
                    >
                  off: {discount}%
                </span>
                  </div>
              ) : (
                  <div className="price" style={{ margin: '0 0 2px 0' }}>
                    {product.price.toLocaleString()}đ
                  </div>
              )}

              <div
                  className="stock"
                  style={{
                    fontSize: '0.8rem',
                    margin: '0',
                  }}
              >
                Tồn: {product.stock}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
