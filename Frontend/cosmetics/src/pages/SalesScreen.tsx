import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SalesScreen.css';
import type { Order, OrderItem } from '../types/order';
import type { Product } from '../types/product';
import { ProductCard } from '../components/sales/ProductCard';
import { OrderSummary } from '../components/sales/OrderSummary';
import { productApi } from '../api/productApi';

export const SalesScreen: React.FC = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentOrder, setCurrentOrder] = useState<Order>({
        id: 'ORD-001',
        items: [],
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
        customerName: '',
        customerPhone: '',
        notes: ''
    });

    // Fetch products từ API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productApi.getAll();
                console.log('Fetched products:', data);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Lọc sản phẩm theo category + search
    const filteredProducts = products.filter(product => {
        const matchesCategory =
            selectedCategory === null || product.category === selectedCategory;
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Thêm sản phẩm vào order
    const addToOrder = (product: Product) => {
        const existingItem = currentOrder.items.find(
            item => item.product.id === product.id
        );

        if (existingItem) {
            const updatedItems = currentOrder.items.map(item =>
                item.product.id === product.id
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                        total: (item.quantity + 1) * item.product.price
                    }
                    : item
            );
            updateOrder(updatedItems);
        } else {
            const newItem: OrderItem = {
                product,
                quantity: 1,
                total: product.price
            };
            updateOrder([...currentOrder.items, newItem]);
        }
    };

    // Cập nhật order
    const updateOrder = (items: OrderItem[]) => {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.1; // VAT 10%
        const total = subtotal + tax;

        setCurrentOrder(prev => ({
            ...prev,
            items,
            subtotal,
            tax,
            total
        }));
    };

    // Xóa khỏi order
    const removeFromOrder = (productId: number) => {
        const updatedItems = currentOrder.items.filter(
            item => item.productId.id !== productId
        );
        updateOrder(updatedItems);
    };

    // Update số lượng trong order
    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromOrder(productId);
            return;
        }

        const updatedItems = currentOrder.items.map(item =>
            item.product.id === productId
                ? { ...item, quantity, total: quantity * item.product.price }
                : item
        );
        updateOrder(updatedItems);
    };

    return (
        <div
            className={`pos-customer ${!sidebarOpen ? 'hidden-sidebar' : ''}`}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 1000
            }}
        >
            {/* Main Content */}
            <div
                className={`pos-item pos-info ${!sidebarOpen ? 'spread-width' : ''}`}
            >
                <div className="wrap-right-content panel-custom">
                    {/* Header */}
                    <ul className="nav nav-tabs">
                        <li className="flex-start-center col-12">
                            {/* Logo */}
                            <div
                                className="logo-container"
                                style={{
                                    marginRight: '16px',
                                    fontWeight: 'bold',
                                    fontSize: '25px',
                                    color: '#2c3e50',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate('/')}
                            >
                                CosmeticsPOS
                            </div>

                            {/* Search */}
                            <div className="search-form">
                                <form className="search-product-order">
                                    <div className="search-input">
                                        <input
                                            type="search"
                                            placeholder="Tìm kiếm sản phẩm..."
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </form>
                            </div>

                            {/* Filter Icon */}
                            <button
                                className="filter-icon-btn"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    border: 'none',
                                    borderRadius: '0px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'transparent',
                                    color: '#ffffff',   // màu trắng
                                    marginLeft: '12px',
                                    fontSize: '18px',
                                    outline: 'none'
                                }}
                            >
                                <i className="fa-solid fa-filter"></i>
                            </button>

                        </li>
                    </ul>

                    {/* Products Grid */}
                    <div className="pos-stock">
                        <div className="pos-stock-body">
                            <div className="pos-stock-content">
                                <div className="pos-stock-content-container">
                                    {loading ? (
                                        <p>Đang tải sản phẩm...</p>
                                    ) : (
                                        <div className="product-row">
                                            {filteredProducts.map(product => (
                                                <ProductCard
                                                    key={product.id}
                                                    product={product}
                                                    onAddToOrder={addToOrder}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Order Summary */}
                <OrderSummary
                    order={currentOrder}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeFromOrder}
                    onCheckout={() => {
                        console.log('Checkout:', currentOrder);
                    }}
                    onCancel={() => {
                        console.log('Cancel order');
                    }}
                />
            </div>
        </div>
    );
};

export default SalesScreen;
