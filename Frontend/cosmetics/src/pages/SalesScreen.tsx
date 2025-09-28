import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SalesScreen.css';
import type { Order, OrderItem } from '../types/order';
import type { Product } from '../types/product';
import { ProductCard } from '../components/sales/ProductCard';
import { OrderSummary } from '../components/sales/OrderSummary';
import { productApi } from '../api/productApi';
import { orderApi } from '../api/orderApi';

export const SalesScreen: React.FC = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const createNewOrder = (index: number): Order => ({
        orderId: index,
        code: `ĐH-${index}`,
        customerName: '',
        total: 0,
        status: 'NEW',
        createdAt: new Date().toISOString(),
        items: [],
        notes: '',
        subtotal: 0,
        discount: 0,
        tax: 0,
    });

    const [orders, setOrders] = useState<Order[]>([createNewOrder(1)]);
    const [activeOrderIndex, setActiveOrderIndex] = useState(0);

    const onSwitchOrder = (index: number) => {
        setActiveOrderIndex(index);
    };

    const [customerName, setCustomerName] = useState('Khách lẻ');
    const [notes, setNotes] = useState('');

    // new order
    const handleAddOrder = () => {
        const newIndex = Math.max(...orders.map(o => o.orderId)) + 1;
        const newOrder = createNewOrder(newIndex);
        console.log('Creating new order:', newOrder);
        setOrders(prev => {
            const newOrders = [...prev, newOrder];
            console.log('Updated orders:', newOrders);
            return newOrders;
        });
        setActiveOrderIndex(orders.length);
    };

    // delete order
    const handleDeleteOrder = (index: number) => {
        if (orders.length <= 1) return; // Không cho xóa đơn cuối cùng
        
        const newOrders = orders.filter((_, i) => i !== index);
        setOrders(newOrders);
        
        // Điều chỉnh activeOrderIndex nếu cần
        if (activeOrderIndex >= newOrders.length) {
            setActiveOrderIndex(newOrders.length - 1);
        } else if (activeOrderIndex > index) {
            setActiveOrderIndex(activeOrderIndex - 1);
        }
    };


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

    // filter category + search
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
        const existingItem = orders[activeOrderIndex].items.find(
            item => item.product.id === product.id
        );

        if (existingItem) {
            const updatedItems = orders[activeOrderIndex].items.map(item =>
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
            updateOrder([...orders[activeOrderIndex].items, newItem]);
        }
    };

    // Cập nhật order
    const updateOrder = (items: OrderItem[]) => {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.1; // VAT 10%
        const total = subtotal + tax;

        setOrders(prev => {
            const newOrders = [...prev];
            newOrders[activeOrderIndex] = {
                ...orders[activeOrderIndex],
                items,
                subtotal,
                tax,
                total,
            };
            return newOrders;
        });
    };

    // Xóa khỏi order
    const removeFromOrder = (productId: string) => {
        const updatedItems = orders[activeOrderIndex].items.filter(
            item => item.product.id !== productId
        );
        updateOrder(updatedItems);
    };

    // Update số lượng trong order
    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromOrder(productId);
            return;
        }

        const updatedItems = orders[activeOrderIndex].items.map(item =>
            item.product.id === productId
                ? { ...item, quantity, total: quantity * item.product.price }
                : item
        );
        updateOrder(updatedItems);
    };

    // Build order data for API
    const buildOrderData = (status: string) => ({
        items: orders[activeOrderIndex].items.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            subtotal: item.total,
        })),
        subtotal: orders[activeOrderIndex].subtotal,
        discount: 0,
        tax: orders[activeOrderIndex].tax,
        total: orders[activeOrderIndex].total,
        customerName: customerName,
        notes: notes,
        status: status,
    });

    // Handle save order
    const handleSaveOrder = async () => {
        try {
            const orderData = buildOrderData('DRAFT');
            console.log('Saving draft order:', orderData);
            const result = await orderApi.submitOrder(orderData);

            if (result?.id) {
                setOrders(prev => {
                    const newOrders = [...prev];
                    newOrders[activeOrderIndex] = {
                        ...orders[activeOrderIndex],
                        orderId: result.id,
                    };
                    return newOrders;
                });
            }

            alert('Đơn hàng đã được lưu dưới dạng nháp!');
        } catch (error: any) {
            console.error('Error saving draft order:', error);
            alert(`Có lỗi khi lưu đơn: ${error.message}`);
        }
    };

    // Handle checkout
    const handleCheckout = async () => {
        try {
            const orderData = buildOrderData('COMPLETED');
            console.log('Submitting completed order:', orderData);
            const result = await orderApi.submitOrder(orderData);

            if (result?.id) {
                setOrders(prev => {
                    const newOrders = [...prev];
                    newOrders[activeOrderIndex] = {
                        ...orders[activeOrderIndex],
                        orderId: result.id,
                        status: 'COMPLETED',
                    };
                    return newOrders;
                });
            }

            alert('Đơn hàng đã được thanh toán thành công!');
            
            // Reset order after successful checkout
            const newIndex = Math.max(...orders.map(o => o.orderId)) + 1;
            const newOrder = createNewOrder(newIndex);
            setOrders(prev => [...prev, newOrder]);
            setActiveOrderIndex(orders.length);
            setCustomerName('Khách lẻ');
            setNotes('');
        } catch (error: any) {
            console.error('Error submitting order:', error);
            alert(`Có lỗi xảy ra khi thanh toán: ${error.message}`);
        }
    };


    return (
        <div
            className={`pos-customer ${!sidebarOpen ? 'hidden-sidebar' : ''}`}
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
                    order={orders[activeOrderIndex]}
                    orders={orders}
                    activeOrderIndex={activeOrderIndex}
                    customerName={customerName}
                    notes={notes}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeFromOrder}
                    onCheckout={handleCheckout}
                    onSaveOrder={handleSaveOrder}
                    onCustomerNameChange={setCustomerName}
                    onNotesChange={setNotes}
                    onAddOrder={handleAddOrder}
                    onSwitchOrder={setActiveOrderIndex}
                    onDeleteOrder={handleDeleteOrder}
                />
            </div>
        </div>
    );
};

export default SalesScreen;
