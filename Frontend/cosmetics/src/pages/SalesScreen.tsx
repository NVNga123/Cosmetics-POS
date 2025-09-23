import React, { useState } from 'react';
import './SalesScreen.css';
import type { Order , OrderItem} from '../types/order';
import type { Product } from '../types/product';
import { ProductCard } from '../components/sales/ProductCard';
import { OrderSummary } from '../components/sales/OrderSummary';

export const SalesScreen: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
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

    // Fake data
    const categories = [
        { id: 'all', name: 'Tất cả' },
        { id: 'skincare', name: 'Chăm sóc da' },
        { id: 'makeup', name: 'Trang điểm' },
        { id: 'hair', name: 'Chăm sóc tóc' },
        { id: 'fragrance', name: 'Nước hoa' }
    ];

    const products: Product[] = [
        {
            id: '1',
            name: 'Kem dưỡng ẩm',
            price: 250000,
            category: 'skincare',
            stock: 50,
            image: '/api/placeholder/200/200'
        },
        {
            id: '2',
            name: 'Son môi matte',
            price: 180000,
            category: 'makeup',
            stock: 30,
            image: '/api/placeholder/200/200'
        },
        {
            id: '3',
            name: 'Dầu gội dưỡng tóc',
            price: 120000,
            category: 'hair',
            stock: 25,
            image: '/api/placeholder/200/200'
        },
        {
            id: '4',
            name: 'Nước hoa nữ',
            price: 450000,
            category: 'fragrance',
            stock: 15,
            image: '/api/placeholder/200/200'
        }
    ];

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === null || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const addToOrder = (product: Product) => {
        const existingItem = currentOrder.items.find(item => item.product.id === product.id);

        if (existingItem) {
            const updatedItems = currentOrder.items.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.product.price }
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

    const updateOrder = (items: OrderItem[]) => {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.1; // 10% VAT
        const total = subtotal + tax;

        setCurrentOrder(prev => ({
            ...prev,
            items,
            subtotal,
            tax,
            total
        }));
    };

    const removeFromOrder = (productId: string) => {
        const updatedItems = currentOrder.items.filter(item => item.product.id !== productId);
        updateOrder(updatedItems);
    };

    const updateQuantity = (productId: string, quantity: number) => {
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
        <div className={`pos-customer ${!sidebarOpen ? 'hidden-sidebar' : ''}`} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000 }}>
            {/* Left Sidebar */}
            <div className={`pos-menu pos-item ${sidebarOpen ? '' : 'hidden'}`}>
                <div className="nav-container">
                    <ul className="nav nav-tabs">
                        <div className="dashboard">
                            <img src="/logo.png" alt="Logo" />
                        </div>

                        {/* Search */}
                        <div className="search-form">
                            <form className="search-product-order">
                                <div className="search-input">
                                    <input
                                        type="search"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </form>
                        </div>

                        {/* Categories */}
                        <div className="wrap-list-nav-link">
                            <div className="product-group">Danh mục sản phẩm</div>
                            {categories.map(category => (
                                <li key={category.id} className="nav-item">
                                    <input
                                        type="radio"
                                        id={category.id}
                                        name="category"
                                        checked={selectedCategory === category.id}
                                        onChange={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
                                    />
                                    <label className="nav-link" htmlFor={category.id}>
                                        {category.name}
                                    </label>
                                </li>
                            ))}
                        </div>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className={`pos-item pos-info ${!sidebarOpen ? 'spread-width' : ''}`}>
                <div className="wrap-right-content panel-custom">
                    {/* Header */}
                    <ul className="nav nav-tabs">
                        <li className="flex-start-center col-12">
                            <div className="flex-center-center cursor-pointer" style={{ width: '8%' }}>
                                <i
                                    className="fa-solid fa-bars"
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                ></i>
                            </div>
                            <div className="nav-item">
                                <a className="nav-link active">Sản phẩm</a>
                            </div>
                        </li>
                    </ul>

                    {/* Products Grid */}
                    <div className="pos-stock">
                        <div className="pos-stock-body">
                            <div className="pos-stock-content">
                                <div className="pos-stock-content-container">
                                    <div className="product-row">
                                        {filteredProducts.map(product => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onAddToOrder={addToOrder}
                                            />
                                        ))}
                                    </div>
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
                        // TODO: Implement checkout logic
                        console.log('Checkout:', currentOrder);
                    }}
                    onCancel={() => {
                        // TODO: Implement cancel logic
                        console.log('Cancel order');
                    }}
                />
            </div>
        </div>
    );
};

export default SalesScreen;
