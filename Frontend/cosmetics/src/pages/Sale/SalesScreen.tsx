import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './SalesScreen.css';
import type { Order, OrderItem } from '../../types/order.ts';
import type { Product } from '../../types/product.ts';
import { ProductCard } from '../../components/sales/ProductCard.tsx';
import { OrderSummary } from '../../components/sales/OrderSummary.tsx';
import { InvoiceInfo } from '../../components/sales/InvoiceInfo.tsx';
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
    const { orderId: orderIdParam } = useParams<{ orderId?: string }>();

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
    const [showInvoiceInfo, setShowInvoiceInfo] = useState(false);
    const [paidOrder, setPaidOrder] = useState<Order | null>(null);


    // Xử lý callback sau khi thanh toán MoMo/VNPay thành công
    useEffect(() => {
        const checkPaymentCallback = async () => {
            // Kiểm tra query params từ MoMo/VNPay callback
            const urlParams = new URLSearchParams(window.location.search);
            const resultCode = urlParams.get('resultCode');
            const momoOrderId = urlParams.get('orderId'); // orderId từ MoMo (không phải orderId của hệ thống)
            
            // Lấy orderId của hệ thống từ localStorage
            const pendingOrderId = localStorage.getItem('pendingPaymentOrderId');
            const pendingPaymentMethod = localStorage.getItem('pendingPaymentMethod');
            
            // Kiểm tra nếu có resultCode từ MoMo (resultCode = 0 nghĩa là thanh toán thành công)
            const isPaymentSuccess = resultCode === '0' || resultCode === '9000'; // 0 hoặc 9000 = thành công
            
            // Nếu thanh toán thành công (có resultCode = 0) hoặc có pendingPaymentOrderId
            if (isPaymentSuccess && pendingOrderId && pendingPaymentMethod === 'momo') {
                console.log('MoMo payment successful. Loading invoice for order:', pendingOrderId);
                // Retry logic: thử lấy order với delay vì có thể chưa được cập nhật status ngay
                const fetchOrderWithRetry = async (retries = 5, delay = 1000) => {
                    for (let i = 0; i < retries; i++) {
                        try {
                            // Lấy thông tin order từ API
                            const orderResult = await orderApi.getById(pendingOrderId);
                            if (orderResult.data && orderResult.data.status === ORDER_STATUS.COMPLETED) {
                                // Map order data để hiển thị InvoiceInfo
                                const orderData = orderResult.data;
                                const mappedOrder: Order = {
                                    orderId: orderData.orderId,
                                    code: orderData.code || '',
                                    customerName: orderData.customerName || 'Khách lẻ',
                                    total: orderData.total || 0,
                                    status: orderData.status,
                                    createdDate: orderData.createdDate,
                                    items: (orderData.items || []).map((item: any) => {
                                        const unitPrice = item.price || item.unitPrice || 0;
                                        const quantity = item.quantity || 0;
                                        const discountedTotal = item.total || item.subtotal || 0;
                                        const originalTotal = unitPrice * quantity;
                                        const discountAmount = originalTotal - discountedTotal;

                                        return {
                                            productId: item.productId,
                                            product: {
                                                id: item.productId,
                                                name: item.productName || item.product?.name || 'Sản phẩm không xác định',
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

                                setPaidOrder(mappedOrder);
                                setShowInvoiceInfo(true);
                                
                                // Xóa localStorage sau khi xử lý
                                localStorage.removeItem('pendingPaymentOrderId');
                                localStorage.removeItem('pendingPaymentMethod');
                                
                                // Xóa query params từ URL
                                window.history.replaceState({}, document.title, window.location.pathname);
                                return; // Thành công, thoát khỏi retry loop
                            }
                        } catch (error) {
                            console.error(`Lỗi khi lấy thông tin đơn hàng (lần thử ${i + 1}/${retries}):`, error);
                        }
                        
                        // Đợi trước khi retry (trừ lần cuối)
                        if (i < retries - 1) {
                            await new Promise(resolve => setTimeout(resolve, delay));
                        }
                    }
                    
                    // Nếu sau tất cả retry vẫn không thành công, xóa localStorage
                    console.warn('Không thể lấy thông tin đơn hàng sau thanh toán sau nhiều lần thử');
                    localStorage.removeItem('pendingPaymentOrderId');
                    localStorage.removeItem('pendingPaymentMethod');
                };

                fetchOrderWithRetry();
            } else if (pendingOrderId && (pendingPaymentMethod === 'bank' || pendingPaymentMethod === 'tmck')) {
                // Xử lý cho VNPay (bank, tmck) - tương tự MoMo
                console.log('VNPay payment callback. Loading invoice for order:', pendingOrderId);
                const fetchOrderWithRetry = async (retries = 5, delay = 1000) => {
                    for (let i = 0; i < retries; i++) {
                        try {
                            const orderResult = await orderApi.getById(pendingOrderId);
                            if (orderResult.data && orderResult.data.status === ORDER_STATUS.COMPLETED) {
                                const orderData = orderResult.data;
                                const mappedOrder: Order = {
                                    orderId: orderData.orderId,
                                    code: orderData.code || '',
                                    customerName: orderData.customerName || 'Khách lẻ',
                                    total: orderData.total || 0,
                                    status: orderData.status,
                                    createdDate: orderData.createdDate,
                                    items: (orderData.items || []).map((item: any) => {
                                        const unitPrice = item.price || item.unitPrice || 0;
                                        const quantity = item.quantity || 0;
                                        const discountedTotal = item.total || item.subtotal || 0;
                                        const originalTotal = unitPrice * quantity;
                                        const discountAmount = originalTotal - discountedTotal;

                                        return {
                                            productId: item.productId,
                                            product: {
                                                id: item.productId,
                                                name: item.productName || item.product?.name || 'Sản phẩm không xác định',
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

                                setPaidOrder(mappedOrder);
                                setShowInvoiceInfo(true);
                                localStorage.removeItem('pendingPaymentOrderId');
                                localStorage.removeItem('pendingPaymentMethod');
                                window.history.replaceState({}, document.title, window.location.pathname);
                                return;
                            }
                        } catch (error) {
                            console.error(`Lỗi khi lấy thông tin đơn hàng (lần thử ${i + 1}/${retries}):`, error);
                        }
                        
                        if (i < retries - 1) {
                            await new Promise(resolve => setTimeout(resolve, delay));
                        }
                    }
                    
                    console.warn('Không thể lấy thông tin đơn hàng sau thanh toán sau nhiều lần thử');
                    localStorage.removeItem('pendingPaymentOrderId');
                    localStorage.removeItem('pendingPaymentMethod');
                };

                fetchOrderWithRetry();
            } else if (resultCode && resultCode !== '0' && resultCode !== '9000') {
                // Thanh toán thất bại
                console.warn('Payment failed with resultCode:', resultCode);
                alert('Thanh toán thất bại. Vui lòng thử lại.');
                localStorage.removeItem('pendingPaymentOrderId');
                localStorage.removeItem('pendingPaymentMethod');
            }
        };

        checkPaymentCallback();
    }, [location.search]);

    // Kiểm tra localStorage khi component mount (trường hợp redirect về mà không có query params hoặc chưa được xử lý)
    useEffect(() => {
        // Chỉ kiểm tra nếu không có query params (đã được xử lý ở useEffect trên)
        const urlParams = new URLSearchParams(window.location.search);
        const hasQueryParams = urlParams.toString().length > 0;
        
        // Nếu đã có query params, useEffect trên sẽ xử lý, không cần xử lý ở đây
        if (hasQueryParams) return;
        
        const pendingOrderId = localStorage.getItem('pendingPaymentOrderId');
        const pendingPaymentMethod = localStorage.getItem('pendingPaymentMethod');
        
        if (pendingOrderId && (pendingPaymentMethod === 'momo' || pendingPaymentMethod === 'bank' || pendingPaymentMethod === 'tmck')) {
            // Chỉ xử lý nếu chưa có InvoiceInfo đang hiển thị
            if (!showInvoiceInfo) {
                console.log('Checking pending payment on mount. Order:', pendingOrderId, 'Method:', pendingPaymentMethod);
                const fetchOrderWithRetry = async (retries = 5, delay = 1000) => {
                    for (let i = 0; i < retries; i++) {
                        try {
                            const orderResult = await orderApi.getById(pendingOrderId);
                            if (orderResult.data && orderResult.data.status === ORDER_STATUS.COMPLETED) {
                                const orderData = orderResult.data;
                                const mappedOrder: Order = {
                                    orderId: orderData.orderId,
                                    code: orderData.code || '',
                                    customerName: orderData.customerName || 'Khách lẻ',
                                    total: orderData.total || 0,
                                    status: orderData.status,
                                    createdDate: orderData.createdDate,
                                    items: (orderData.items || []).map((item: any) => {
                                        const unitPrice = item.price || item.unitPrice || 0;
                                        const quantity = item.quantity || 0;
                                        const discountedTotal = item.total || item.subtotal || 0;
                                        const originalTotal = unitPrice * quantity;
                                        const discountAmount = originalTotal - discountedTotal;

                                        return {
                                            productId: item.productId,
                                            product: {
                                                id: item.productId,
                                                name: item.productName || item.product?.name || 'Sản phẩm không xác định',
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

                                setPaidOrder(mappedOrder);
                                setShowInvoiceInfo(true);
                                localStorage.removeItem('pendingPaymentOrderId');
                                localStorage.removeItem('pendingPaymentMethod');
                                return;
                            }
                        } catch (error) {
                            console.error(`Lỗi khi lấy thông tin đơn hàng (lần thử ${i + 1}/${retries}):`, error);
                        }
                        
                        if (i < retries - 1) {
                            await new Promise(resolve => setTimeout(resolve, delay));
                        }
                    }
                    
                    localStorage.removeItem('pendingPaymentOrderId');
                    localStorage.removeItem('pendingPaymentMethod');
                };

                fetchOrderWithRetry();
            }
        }
    }, []); // Chỉ chạy khi component mount

    // Xử lý khi có orderId trong URL (sau khi redirect từ MoMo)
    useEffect(() => {
        const loadOrderFromUrl = async () => {
            if (orderIdParam) {
                try {
                    setLoading(true);
                    const orderResult = await orderApi.getById(orderIdParam);
                    
                    if (orderResult.data) {
                        const orderData = orderResult.data;
                        
                        // Map dữ liệu từ Backend về cấu trúc Frontend
                        const mappedOrder: Order = {
                            orderId: orderData.orderId,
                            code: orderData.code || '',
                            customerName: orderData.customerName || 'Khách lẻ',
                            total: orderData.total || 0,
                            status: orderData.status,
                            createdDate: orderData.createdDate,
                            items: (orderData.items || []).map((item: any) => {
                                // Xử lý giá trị số an toàn
                                const unitPrice = item.price || item.unitPrice || 0;
                                const quantity = item.quantity || 0;
                                const subtotal = item.subtotal || (unitPrice * quantity);
                                const total = item.total || subtotal; // Tổng sau giảm giá
                                const discountAmount = subtotal - total;

                                return {
                                    productId: item.productId, // Quan trọng: phải khớp ID để update/xóa hoạt động
                                    product: {
                                        id: item.productId,
                                        name: item.productName || item.product?.name || 'Sản phẩm',
                                        price: unitPrice,
                                        image: item.product?.image || item.image || '', // Đảm bảo có ảnh nếu có
                                        discount: item.product?.discount || 0,
                                        stock: item.product?.stock || 999 // Fallback nếu thiếu stock
                                    },
                                    quantity: quantity,
                                    subtotal: subtotal,
                                    discountAmount: discountAmount,
                                    total: total,
                                };
                            }),
                            notes: orderData.notes || '',
                            paymentMethod: orderData.paymentMethod,
                        };

                        // Cập nhật State
                        setOrders([mappedOrder]);
                        setActiveOrderIndex(0);
                        setCustomerName(mappedOrder.customerName);
                        setNotes(mappedOrder.notes);

                        // Nếu đơn đã hoàn thành thì hiện hóa đơn luôn
                        if (orderData.status === 'COMPLETED') {
                            setPaidOrder(mappedOrder);
                            setShowInvoiceInfo(true);
                        }
                    }
                } catch (error) {
                    console.error('Lỗi tải đơn hàng:', error);
                    alert('Không tìm thấy đơn hàng hoặc có lỗi xảy ra.');
                    navigate('/user/sales'); // Quay về trang bán mới nếu lỗi
                } finally {
                    setLoading(false);
                }
            }
        };

        loadOrderFromUrl();
    }, [orderIdParam, navigate]);

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


    const handleCheckout = async (paymentMethod?: string, transferAmount?: number): Promise<number | undefined> => {
        try {
            const currentOrder = orders[activeOrderIndex];
            const payload = buildOrderData(ORDER_STATUS.COMPLETED, paymentMethod, transferAmount);

            let result;

            if (currentOrder.orderId && currentOrder.status === ORDER_STATUS.DRAFT) {
                result = await orderApi.updateOrder(currentOrder.orderId, payload);
            } else {
                result = await orderApi.submitOrder(payload);
            }

            // Debug: log response để kiểm tra
            console.log('Checkout response:', result);
            console.log('Result data:', result.data);
            
            if (!result.data) {
                console.error('Response data is null or undefined:', result);
                throw new Error('Không nhận được dữ liệu từ server');
            }

            const orderId = result.data.orderId || result.data.id; // Hỗ trợ cả orderId và id

            if (!orderId) {
                console.error('OrderId is missing in response:', result.data);
                throw new Error('Không nhận được orderId từ server sau khi lưu đơn hàng');
            }

            const updatedOrder: Order = {
                ...orders[activeOrderIndex],
                orderId: orderId,
                status: ORDER_STATUS.COMPLETED,
                paymentMethod,
                createdDate: result.data.createdDate || result.data.createdAt,
            };

            setOrders(prev => {
                const updated = [...prev];
                updated[activeOrderIndex] = updatedOrder;
                return updated;
            });

            // Lưu orderId vào localStorage để xử lý callback sau khi thanh toán online
            if (orderId) {
                localStorage.setItem('pendingPaymentOrderId', String(orderId));
                localStorage.setItem('pendingPaymentMethod', paymentMethod || '');
            }

            // Chỉ hiển thị InvoiceInfo cho thanh toán tiền mặt
            // Các phương thức khác sẽ redirect đến cổng thanh toán
            if (paymentMethod === 'cash') {
                setPaidOrder(updatedOrder);
                setShowInvoiceInfo(true);
                // Xóa localStorage vì đã xử lý xong
                localStorage.removeItem('pendingPaymentOrderId');
                localStorage.removeItem('pendingPaymentMethod');
            }

            // Trả về orderId để PaymentModal sử dụng
            return orderId;

        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const handleCreateInvoice = () => {
        // Có thể thêm logic in hóa đơn hoặc lưu PDF ở đây
        // Hiện tại chỉ đóng và tạo đơn hàng mới
        window.print();
        handleCancelInvoice();
    };

    const handleCancelInvoice = () => {
        setShowInvoiceInfo(false);
        setPaidOrder(null);
        // Tạo đơn hàng mới sau khi hủy
        setOrders([createNewOrder()]);
        setActiveOrderIndex(0);
        setCustomerName('Khách lẻ');
        setNotes('---');
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

                {/* Invoice Info Modal - chỉ hiển thị sau khi thanh toán thành công */}
                {paidOrder && (
                    <InvoiceInfo
                        order={paidOrder}
                        isOpen={showInvoiceInfo}
                        onCreateInvoice={handleCreateInvoice}
                        onCancel={handleCancelInvoice}
                    />
                )}
            </div>
        </div>
    );
};

export default SalesScreen;
