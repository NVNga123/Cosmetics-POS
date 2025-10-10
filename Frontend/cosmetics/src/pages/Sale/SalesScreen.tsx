import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SalesScreen.css';
import type { Order, OrderItem } from '../../types/order.ts';
import type { Product } from '../../types/product.ts';
import { ProductCard } from '../../components/sales/ProductCard.tsx';
import { OrderSummary } from '../../components/sales/OrderSummary.tsx';
import { productApi } from '../../api/productApi.ts';
import { orderApi } from '../../api/orderApi.ts';
import { ORDER_STATUS } from '../../constants/orderStatusConstants.ts';

export const SalesScreen: React.FC = () => {
    const navigate = useNavigate();
    const [sidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const createNewOrder = (index: number): Order => ({
        orderId: index,
        code: `ĐH-${index}`,
        customerName: '',
        total: 0,
        status: 'DRAFT',
        createdAt: undefined as any,
        items: [],
        notes: '',
        paymentMethod: undefined,
    });

    const [orders, setOrders] = useState<Order[]>([createNewOrder(1)]);
    const [activeOrderIndex, setActiveOrderIndex] = useState(0);// Index của đơn hàng hiện tại

    const [customerName, setCustomerName] = useState('Khách lẻ');
    const [notes, setNotes] = useState('---');

    const handleAddOrder = () => {
        const newIndex = Math.max(...orders.map(o => o.orderId)) + 1;
        const newOrder = createNewOrder(newIndex);
        setOrders(prev => {
            const newOrders = [...prev, newOrder];
            return newOrders;
        });
        setActiveOrderIndex(orders.length);
    };

    const handleDeleteOrder = (index: number) => {
        if (orders.length <= 1) return;
        const newOrders = orders.filter((_, i) => i !== index);
        setOrders(newOrders);

        if (activeOrderIndex >= newOrders.length) {
            setActiveOrderIndex(newOrders.length - 1);
        } else if (activeOrderIndex > index) {
            setActiveOrderIndex(activeOrderIndex - 1);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productApi.getAllProducts();
                const productsData = response.result || [];
                setProducts(productsData);
                setFilteredProducts(productsData); // Initialize filtered products
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        const searchProducts = async () => {
            if (!searchQuery.trim()) {
                setFilteredProducts(products);
                return;
            }
            try {
                setSearchLoading(true);
                const response = await productApi.searchProducts(searchQuery);
                setFilteredProducts(response.result || []);
            } catch {
                const localFiltered = products.filter(product =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setFilteredProducts(localFiltered);
            } finally {
                setSearchLoading(false);
            }
        };

        const timeoutId = setTimeout(searchProducts, 300); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [searchQuery, products]);

    const addToOrder = (product: Product) => {
        const discount = product.discount ?? 0;
        const discounted = discount > 0
            ? product.price - (product.price * discount) / 100
            : product.price;
        const discountPerUnit = product.price - discounted;

        const existingItem = orders[activeOrderIndex].items.find(
            item => item.productId === product.id
        );

        if (existingItem) {
            const updatedItems = orders[activeOrderIndex].items.map(item =>
                item.productId === product.id
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                        subtotal: (item.quantity + 1) * product.price,
                        discountAmount: (item.quantity + 1) * discountPerUnit,
                        total: (item.quantity + 1) * discounted,
                    }
                    : item
            );
            updateOrder(updatedItems);
        } else {
            const newItem: OrderItem = {
                product,
                productId: product.id,
                quantity: 1,
                subtotal: product.price,
                discountAmount: discountPerUnit,
                total: discounted,
            };
            updateOrder([...orders[activeOrderIndex].items, newItem]);
        }
    };

    const updateOrder = (items: OrderItem[]) => {
        const totalAfterDiscount = items.reduce((sum, item) => sum + item.total, 0);
        const tax = totalAfterDiscount * 0.1;
        const total = totalAfterDiscount + tax;

        setOrders(prev => {
            const newOrders = [...prev];
            newOrders[activeOrderIndex] = {
                ...prev[activeOrderIndex],
                items,
                total,
            };
            return newOrders;
        });
    };

    const removeFromOrder = (productId: string) => {
        const updatedItems = orders[activeOrderIndex].items.filter(
            item => item.productId !== productId
        );
        updateOrder(updatedItems);
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromOrder(productId);
            return;
        }
        const updatedItems = orders[activeOrderIndex].items.map(item => {
            if (item.productId === productId && item.product) {
                const discount = item.product.discount ?? 0;
                const discounted =
                    discount > 0
                        ? item.product.price - (item.product.price * discount) / 100
                        : item.product.price;
                const discountPerUnit = item.product.price - discounted;
                return {
                    ...item,
                    quantity,
                    subtotal: quantity * item.product.price,
                    discountAmount: quantity * discountPerUnit,
                    total: quantity * discounted,
                };
            }
            return item;
        });
        updateOrder(updatedItems);
    };

    const buildOrderData = (status: string, paymentMethod?: string) => {
        const currentOrder = orders[activeOrderIndex];
        const subtotal = currentOrder.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
        const discount = currentOrder.items.reduce((sum, item) => sum + (item.subtotal - item.total), 0);
        const totalAfterDiscount = subtotal - discount;
        const tax = totalAfterDiscount * 0.1;
        const total = totalAfterDiscount + tax;


        return {
            items: currentOrder.items.map(item => ({
                productId: item.productId || item.product?.id,
                productName: item.product?.name,
                price: item.product?.price || item.unitPrice || item.price || 0,
                quantity: item.quantity,
                subtotal: item.subtotal,
                discountAmount: item.discountAmount || 0,
            })),
            subtotal: subtotal,
            discount: discount,
            tax: tax,
            total: total,
            customerName: customerName || 'Khách lẻ',
            notes: notes || '',
            status,
            paymentMethod: paymentMethod || currentOrder.paymentMethod,
        };
    };

    const handleSaveOrder = async () => {
        try {
            const orderData = buildOrderData(ORDER_STATUS.DRAFT);
            const result = await orderApi.submitOrder(orderData);

            if (result?.data?.orderId) {
                setOrders(prev => {
                    const newOrders = [...prev];
                    newOrders[activeOrderIndex] = {
                        ...orders[activeOrderIndex],
                        orderId: result.data.orderId,
                        createdAt: result.data.createdAt,
                    };
                    return newOrders;
                });
            }

            alert('Đơn hàng đã được lưu dưới dạng nháp!');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Có lỗi khi lưu đơn: ${errorMessage}`);
        }
    };

    const handleCheckout = async (paymentMethod?: string) => {
        try {
            console.log('handleCheckout - received paymentMethod:', paymentMethod);
            
            if (paymentMethod) {
                setOrders(prev => {
                    const newOrders = [...prev];
                    newOrders[activeOrderIndex] = {
                        ...newOrders[activeOrderIndex],
                        paymentMethod: paymentMethod
                    };
                    return newOrders;
                });
            }

            const orderData = buildOrderData(ORDER_STATUS.COMPLETED, paymentMethod);
            console.log('handleCheckout - orderData being sent:', orderData);
            const result = await orderApi.submitOrder(orderData);

            if (result?.data?.orderId) {
                setOrders(prev => {
                    const newOrders = [...prev];
                    newOrders[activeOrderIndex] = {
                        ...orders[activeOrderIndex],
                        orderId: result.data.orderId,
                        createdAt: result.data.createdAt,
                    };
                    return newOrders;
                });
            }

            alert('Đơn hàng đã được thanh toán thành công!');

            const newIndex = Math.max(...orders.map(o => o.orderId)) + 1;
            const newOrder = createNewOrder(newIndex);
            setOrders(prev => [...prev, newOrder]);
            setActiveOrderIndex(orders.length);
            setCustomerName('Khách lẻ');
            setNotes('');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Có lỗi xảy ra khi thanh toán: ${errorMessage}`);
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
                            <div className="search-form-cart">
                                <form className="search-product-order-cart">
                                    <div className="search-input-cart">
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
                                    {loading || searchLoading ? (
                                        <p>{searchLoading ? 'Đang tìm kiếm...' : 'Đang tải sản phẩm...'}</p>
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
