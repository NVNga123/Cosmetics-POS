import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SalesScreen.css';
import type { Order, OrderItem } from '../../types/order';
import type { Product } from '../../types/product';
import { ProductCard } from '../../components/sales/ProductCard';
import { OrderSummary } from '../../components/sales/OrderSummary';
import { productApi } from '../../api/productApi';
import { orderApi } from '../../api/orderApi';
import { ORDER_STATUS } from '../../constants/orderStatus.constants';

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
        status: ORDER_STATUS.DRAFT,
        createdAt: undefined as any,
        items: [],
        notes: '',
    });

    const [orders, setOrders] = useState<Order[]>([createNewOrder(1)]);
    const [activeOrderIndex, setActiveOrderIndex] = useState(0);
    const [customerName, setCustomerName] = useState('Khách lẻ');
    const [notes, setNotes] = useState('');

    // new order
    const handleAddOrder = () => {
        const newIndex = Math.max(...orders.map(o => o.orderId)) + 1;
        const newOrder = createNewOrder(newIndex);
        setOrders(prev => [...prev, newOrder]);
        setActiveOrderIndex(orders.length);
    };

    // delete order
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

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productApi.getAllProducts();
                const productsData = response.result || [];
                setProducts(productsData);
                setFilteredProducts(productsData);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    // Search products
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
            } catch (error) {
                const localFiltered = products.filter(product =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setFilteredProducts(localFiltered);
            } finally {
                setSearchLoading(false);
            }
        };
        const timeoutId = setTimeout(searchProducts, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, products]);

    // Thêm sản phẩm vào order
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

    // Cập nhật order
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

    // Xóa khỏi order
    const removeFromOrder = (productId: string) => {
        const updatedItems = orders[activeOrderIndex].items.filter(
            item => item.productId !== productId
        );
        updateOrder(updatedItems);
    };

    // Update số lượng
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

    // Build order data for submission
    const buildOrderData = () => {
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
            status: ORDER_STATUS.DRAFT,
        };
    };

    // Handle checkout (thanh toán)
    const handleCheckout = async () => {
        try {
            const orderData = buildOrderData();
            // Cập nhật trạng thái thành COMPLETED khi thanh toán
            const checkoutData = { ...orderData, status: 'COMPLETED' };
            console.log('Submitting order for checkout:', checkoutData);
            await orderApi.submitOrder(checkoutData);
            console.log('Order submitted successfully for checkout');
            alert('Đơn hàng đã được thanh toán thành công!');
            // Reset order after successful checkout
            const newOrder = createNewOrder(Math.max(...orders.map(o => o.orderId)) + 1);
            setOrders(prev => [...prev, newOrder]);
            setActiveOrderIndex(orders.length);
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
        }
    };

    // Handle save order (lưu đơn)
    const handleSaveOrder = async () => {
        try {
            const orderData = buildOrderData();
            // Đơn hàng được lưu có trạng thái DRAFT
            const saveData = { ...orderData, status: ORDER_STATUS.DRAFT };
            console.log('Submitting order for save:', saveData);
            await orderApi.submitOrder(saveData);
            console.log('Order submitted successfully for save');
            alert('Đơn hàng đã được lưu thành công!');
            
            // Xóa đơn hàng cũ và tạo đơn hàng mới
            const newOrder = createNewOrder(Math.max(...orders.map(o => o.orderId)) + 1);
            setOrders(prev => {
                const newOrders = [...prev];
                newOrders[activeOrderIndex] = newOrder;
                return newOrders;
            });
            // Giữ nguyên activeOrderIndex để ở cùng tab
        } catch (error) {
            console.error('Error during save order:', error);
            alert('Có lỗi xảy ra khi lưu đơn hàng. Vui lòng thử lại.');
        }
    };

    return (
        <div className={`pos-customer ${!sidebarOpen ? 'hidden-sidebar' : ''}`}>
            <div className={`pos-item pos-info ${!sidebarOpen ? 'spread-width' : ''}`}>
                <div className="wrap-right-content panel-custom">
                    {/* Header */}
                    <ul className="nav nav-tabs">
                        <li className="flex-start-center col-12">
                            <div className="logo-container" onClick={() => navigate('/')}>
                                CosmeticsPOS
                            </div>
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
                            <button className="filter-icon-btn">
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

                {/* Right Sidebar */}
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
