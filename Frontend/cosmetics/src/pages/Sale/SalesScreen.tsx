import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SalesScreen.css';
import type { Order, OrderItem } from '../../types/order.ts';
import type { Product } from '../../types/product.ts';
import { ProductCard } from '../../components/sales/ProductCard.tsx';
import { OrderSummary } from '../../components/sales/OrderSummary.tsx';
import { productApi } from '../../api/productApi.ts';
import { orderApi } from '../../api/orderApi.ts';
import { ORDER_STATUS } from '../../constants/orderStatusConstants.ts';

const createNewOrder = (): Order => ({
    orderId: undefined,
    code: '',
    customerName: 'Khách lẻ',
    total: 0,
    status: ORDER_STATUS.DRAFT,
    createdDate: undefined,
    items: [],
    notes: '',
    paymentMethod: undefined,
});

export const SalesScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const [orders, setOrders] = useState<Order[]>([createNewOrder()]);
    const [activeOrderIndex, setActiveOrderIndex] = useState(0);
    const [customerName, setCustomerName] = useState('Khách lẻ');
    const [notes, setNotes] = useState('---');


    useEffect(() => {
        if (location.state?.selectedOrder) {
            const orderData = location.state.selectedOrder;

            const mappedOrder: Order = {
                orderId: orderData.id || undefined,
                code: orderData.code || '',
                customerName: orderData.customerName || 'Khách lẻ',
                total: orderData.finalPrice || 0,
                status: orderData.status || ORDER_STATUS.DRAFT,
                createdDate: orderData.createdDate,
                items: (orderData.items || orderData.orderDetails || []).map((item: any) => {
                    const unitPrice = item.price || item.unitPrice || 0;
                    const quantity = item.quantity || item.quantityProduct || 0;
                    const discountedTotal = item.subtotal || item.totalPrice || 0;
                    const originalTotal = unitPrice * quantity;
                    const discountAmount = originalTotal - discountedTotal;

                    return {
                        productId: item.productId,
                        product: {
                            id: item.productId,
                            name: item.productName,
                            price: unitPrice,
                            discount: item.discount || 0,
                        },
                        quantity,
                        subtotal: originalTotal,
                        discountAmount,
                        total: discountedTotal,
                    };
                }),
                notes: orderData.notes || '',
                paymentMethod: orderData.paymentMethod,
            };

            setOrders([mappedOrder]);
            setCustomerName(mappedOrder.customerName);
            setNotes(mappedOrder.notes || '');
            setActiveOrderIndex(0);
        }
    }, [location.state]);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productApi.getAllProducts();
                const productsData = response.result || [];
                setProducts(productsData);
                setFilteredProducts(productsData);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);


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
                const localFiltered = products.filter(p =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setFilteredProducts(localFiltered);
            } finally {
                setSearchLoading(false);
            }
        };
        const timeoutId = setTimeout(searchProducts, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, products]);


    const addToOrder = (product: Product) => {
        const discount = product.discount ?? 0;
        const discounted = discount > 0 ? product.price - (product.price * discount) / 100 : product.price;
        const discountPerUnit = product.price - discounted;

        const currentOrder = orders[activeOrderIndex];
        const existingItem = currentOrder.items.find(i => i.productId === product.id);

        let updatedItems;

        if (existingItem) {
            updatedItems = currentOrder.items.map(item =>
                item.productId === product.id
                    ? ({
                        ...item,
                        quantity: item.quantity + 1,
                        subtotal: (item.quantity + 1) * product.price,
                        discountAmount: (item.quantity + 1) * discountPerUnit,
                        total: (item.quantity + 1) * discounted,
                    })
                    : item
            );
        } else {
            updatedItems = [
                ...currentOrder.items,
                {
                    product,
                    productId: product.id,
                    quantity: 1,
                    subtotal: product.price,
                    discountAmount: discountPerUnit,
                    total: discounted,
                }
            ];
        }

        updateOrder(updatedItems);
    };


    const updateOrder = (items: OrderItem[]) => {
        const totalAfterDiscount = items.reduce((sum, item) => sum + item.total, 0);
        const tax = totalAfterDiscount * 0.1;
        const total = totalAfterDiscount + tax;

        setOrders(prev => {
            const updated = [...prev];
            updated[activeOrderIndex] = { ...updated[activeOrderIndex], items, total };
            return updated;
        });
    };


    const removeFromOrder = (productId: string) => {
        const updatedItems = orders[activeOrderIndex].items.filter(item => item.productId !== productId);
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
                const discounted = discount > 0
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


    const buildOrderData = (status: string, paymentMethod?: string, transferAmount?: number) => {
        const currentOrder = orders[activeOrderIndex];

        const subtotal = currentOrder.items.reduce((sum, i) => sum + i.subtotal, 0);
        const discount = currentOrder.items.reduce((sum, i) => sum + (i.subtotal - i.total), 0);
        const totalAfterDiscount = subtotal - discount;
        const tax = totalAfterDiscount * 0.1;
        const total = totalAfterDiscount + tax;

        return {
            id: currentOrder.orderId ?? null,
            items: currentOrder.items.map(item => ({
                productId: String(item.productId),
                productName: item.product?.name || '',
                price: item.product?.price || 0,
                quantity: item.quantity,
                subtotal: item.total,
            })),
            subtotal,
            discount,
            tax,
            total,
            customerName,
            notes,
            status,
            paymentMethod,
            cashAmount: paymentMethod === 'cash' ? total : 0,
            transferAmount: paymentMethod !== 'cash' ? (transferAmount ?? 0) : 0,
        };
    };


    const handleSaveOrder = async () => {
        try {
            const currentOrder = orders[activeOrderIndex];
            const payload = buildOrderData(ORDER_STATUS.DRAFT);

            let result;
            if (currentOrder.orderId) {
                result = await orderApi.updateOrder(currentOrder.orderId, payload);
            } else {
                result = await orderApi.submitOrder(payload);
            }

            setOrders(prev => {
                const newOrders = [...prev];
                newOrders[activeOrderIndex] = {
                    ...newOrders[activeOrderIndex],
                    orderId: result.data.orderId,
                    code: result.data.code || newOrders[activeOrderIndex].code,
                    status: ORDER_STATUS.DRAFT,
                    createdDate: result.data.createdDate,
                };
                return newOrders;
            });

            alert('Đã lưu nháp!');
        } catch {
            alert('Lỗi khi lưu đơn hàng');
        }
    };


    const handleCheckout = async (paymentMethod?: string, transferAmount?: number) => {
        try {
            const currentOrder = orders[activeOrderIndex];
            const payload = buildOrderData(ORDER_STATUS.COMPLETED, paymentMethod, transferAmount);

            let result;

            if (currentOrder.orderId && currentOrder.status === ORDER_STATUS.DRAFT) {
                result = await orderApi.updateOrder(currentOrder.orderId, payload);
            } else {
                result = await orderApi.submitOrder(payload);
            }

            setOrders(prev => {
                const updated = [...prev];
                updated[activeOrderIndex] = {
                    ...updated[activeOrderIndex],
                    orderId: result.data.orderId,
                    code: result.data.code || updated[activeOrderIndex].code,
                    status: ORDER_STATUS.COMPLETED,
                    paymentMethod,
                    createdDate: result.data.createdDate,
                };
                return updated;
            });

            if (paymentMethod === 'cash') {
                alert('Thanh toán thành công!');
                navigate('/user/cart');
            }

        } catch (err) {
            console.error(err);
            throw err;
        }
    };


    return (
        <div className={`pos-customer ${!sidebarOpen ? 'hidden-sidebar' : ''}`}>
            <div className={`pos-item pos-info ${!sidebarOpen ? 'spread-width' : ''}`}>

                {/* HEADER */}
                <div className="wrap-right-content panel-custom">
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
                        </li>
                    </ul>

                    {/* PRODUCT LIST */}
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

                {/* ORDER SUMMARY */}
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

                    onCustomerNameChange={name => {
                        setCustomerName(name);
                        setOrders(prev => {
                            const updated = [...prev];
                            updated[activeOrderIndex].customerName = name;
                            return updated;
                        });
                    }}

                    onNotesChange={text => {
                        setNotes(text);
                        setOrders(prev => {
                            const updated = [...prev];
                            updated[activeOrderIndex].notes = text;
                            return updated;
                        });
                    }}

                    onAddOrder={() => {
                        setOrders(prev => [...prev, createNewOrder()]);
                        setActiveOrderIndex(orders.length);
                        setCustomerName('Khách lẻ');
                        setNotes('---');
                    }}

                    onSwitchOrder={index => {
                        setActiveOrderIndex(index);
                        setCustomerName(orders[index].customerName || 'Khách lẻ');
                        setNotes(orders[index].notes || '---');
                    }}

                    onDeleteOrder={index => {
                        if (orders.length === 1) {
                            alert('Không thể xóa đơn cuối cùng');
                            return;
                        }
                        const newOrders = orders.filter((_, i) => i !== index);
                        setOrders(newOrders);
                        setActiveOrderIndex(0);
                        setCustomerName(newOrders[0].customerName || 'Khách lẻ');
                        setNotes(newOrders[0].notes || '---');
                    }}
                />

            </div>
        </div>
    );
};

export default SalesScreen;
