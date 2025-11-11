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

export const SalesScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation(); // ✅ để nhận dữ liệu truyền từ Cart
    const [sidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const createNewOrder = (index: number): Order => ({
        orderId: index,
        code: `ĐH-${index}`,
        customerName: 'Khách lẻ',
        total: 0,
        status: 'DRAFT',
        createdDate: undefined as any,
        items: [],
        notes: '',
        paymentMethod: undefined,
    });

    const [orders, setOrders] = useState<Order[]>([createNewOrder(1)]);
    const [activeOrderIndex, setActiveOrderIndex] = useState(0);
    const [customerName, setCustomerName] = useState('Khách lẻ');
    const [notes, setNotes] = useState('---');

    // Tìm số lớn nhất trong orderId hiện tại để tạo ID mới
    const getNextOrderId = () => {
        if (orders.length === 0) return 1;
        const maxId = Math.max(...orders.map(o => typeof o.orderId === 'number' ? o.orderId : 0), 0);
        return maxId + 1;
    };

    const handleAddOrder = () => {
        const newOrderId = getNextOrderId();
        const newOrder = createNewOrder(newOrderId);
        setOrders(prev => {
            const newOrders = [...prev, newOrder];
            setActiveOrderIndex(newOrders.length - 1);
            return newOrders;
        });
        setCustomerName('Khách lẻ');
        setNotes('---');
    };

    const handleSwitchOrder = (index: number) => {
        if (index >= 0 && index < orders.length) {
            setActiveOrderIndex(index);
            setCustomerName(orders[index].customerName || 'Khách lẻ');
            setNotes(orders[index].notes || '---');
        }
    };

    const handleDeleteOrder = (index: number) => {
        if (orders.length <= 1) {
            alert('Không thể xóa đơn hàng cuối cùng. Vui lòng tạo đơn hàng mới trước.');
            return;
        }

        setOrders(prev => {
            const newOrders = prev.filter((_, i) => i !== index);
            // Nếu xóa đơn hàng đang active hoặc đơn hàng trước active, điều chỉnh activeOrderIndex
            if (index <= activeOrderIndex) {
                const newActiveIndex = Math.max(0, activeOrderIndex - 1);
                setActiveOrderIndex(newActiveIndex);
                setCustomerName(newOrders[newActiveIndex]?.customerName || 'Khách lẻ');
                setNotes(newOrders[newActiveIndex]?.notes || '---');
            }
            return newOrders;
        });
    };

    // ✅ Nhận dữ liệu từ Cart (navigate state)
    useEffect(() => {
        if (location.state?.selectedOrder) {
            const orderData = location.state.selectedOrder;
            const mappedOrder: Order = {
                orderId: orderData.id || orderData.orderId,
                code: orderData.code || `ĐH-${orderData.id}`,
                customerName: orderData.customerName || 'Khách lẻ',
                total: orderData.total || orderData.finalPrice || 0,
                status: orderData.status || 'DRAFT',
                createdDate: orderData.createdDate,
                items: (orderData.items || orderData.orderDetails || []).map((item: any) => {
                    // Dữ liệu từ backend (OrderMapper.java -> OrderItemResponse.java)
                    // item.price là giá GỐC (unitPrice)
                    // item.subtotal là TỔNG ĐÃ GIẢM (totalPrice)
                    const unitPrice = item.price || item.unitPrice || 0;
                    const quantity = item.quantity || item.quantityProduct || 0;
                    const discountedTotalForItem = item.subtotal || item.totalPrice || 0;

                    // Tính toán lại cho đúng kiểu OrderItem của frontend
                    const originalTotalForItem = unitPrice * quantity; // Tổng gốc (chưa giảm)
                    const discountAmount = originalTotalForItem - discountedTotalForItem; // Tiền giảm
                    
                    return {
                        productId: item.productId,
                        product: item.product || {
                            id: item.productId,
                            name: item.productName,
                            price: unitPrice, // Giá gốc (phục vụ hàm updateQuantity)
                            // Thêm discount để hàm updateQuantity tính đúng
                            discount: (item.product?.discount || 0) 
                        },
                        quantity: quantity,
                        subtotal: originalTotalForItem, // (vd: 250,000)
                        discountAmount: discountAmount, // (vd: 20,000)
                        total: discountedTotalForItem, // (vd: 230,000)
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

    // Fetch sản phẩm
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

    // Search sản phẩm
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

    const buildOrderData = (status: string, paymentMethod?: string, transferAmount?: number) => {
        const currentOrder = orders[activeOrderIndex];
        const subtotal = currentOrder.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
        const discount = currentOrder.items.reduce((sum, item) => sum + (item.subtotal - item.total), 0);
        const totalAfterDiscount = subtotal - discount;
        const tax = totalAfterDiscount * 0.1;
        const total = totalAfterDiscount + tax;
        // SỬA TỪ ĐÂY
        // Tính toán tiền mặt và tiền chuyển khoản
        const finalTransferAmount = transferAmount || 0;
        // Nếu là TMCK, tiền mặt là phần còn lại. Nếu là tiền mặt, chuyển khoản là 0, tiền mặt là tổng.
        const finalCashAmount = (paymentMethod === 'tmck' || paymentMethod === 'cash') ? (total - finalTransferAmount) : 0;
        // SỬA ĐẾN ĐÂY

        return {
            id: currentOrder.orderId || 0, // Thêm trường id bắt buộc
            items: currentOrder.items.map(item => ({
                productId: String(item.productId || item.product?.id || ''),
                productName: item.product?.name || item.productName || '',
                price: item.product?.price || item.unitPrice || item.price || 0,
                quantity: item.quantity,
                subtotal: item.total,
            })),
            subtotal: subtotal,
            discount: discount,
            tax: tax,
            total: total,
            customerName: customerName || 'Khách lẻ',
            notes: notes || '',
            status,
            paymentMethod: paymentMethod || currentOrder.paymentMethod,
            cashAmount: finalCashAmount, // THÊM DÒNG NÀY
            transferAmount: finalTransferAmount, // THÊM DÒNG NÀY
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
                        status: ORDER_STATUS.DRAFT, // ✅ Cập nhật status cho save
                        createdDate: result.data.createdDate,
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

   const handleCheckout = async (paymentMethod?: string, transferAmount?: number) => { 
        try {
            const currentOrder = orders[activeOrderIndex];
            const orderData = buildOrderData(ORDER_STATUS.COMPLETED, paymentMethod, transferAmount); 

            let result;
            if (currentOrder.orderId && currentOrder.status === 'DRAFT') {
                console.log(`Updating existing order ID: ${currentOrder.orderId} to COMPLETED`);
                result = await orderApi.updateOrder(currentOrder.orderId, orderData);
            } else {
                console.log('Creating new order as COMPLETED');
                result = await orderApi.submitOrder(orderData);
            }
            console.log('Order save/update result:', result.data);

            // Cập nhật state nội bộ
            setOrders(prev => {
                const newOrders = [...prev];
                newOrders[activeOrderIndex] = {
                    ...newOrders[activeOrderIndex],
                    orderId: result.data.orderId || currentOrder.orderId,
                    status: ORDER_STATUS.COMPLETED,
                    paymentMethod: paymentMethod || currentOrder.paymentMethod,
                    createdDate: result.data.createdDate || currentOrder.createdDate,
                };
                return newOrders;
            });

            // SỬA: Chỉ alert và navigate NẾU là 'cash' (tiền mặt)
            if (paymentMethod === 'cash') { 
                alert('✅ Đơn hàng đã được thanh toán và cập nhật trạng thái thành công!');
                navigate('/user/cart');
            }
            // Nếu là 'bank' hoặc 'tmck', hàm này sẽ kết thúc
            // và để PaymentModal xử lý việc chuyển hướng.
            
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error(`❌ Có lỗi xảy ra khi lưu đơn hàng: ${message}`);
            // Ném lỗi ra ngoài để PaymentModal có thể bắt được
            throw error; 
        }
    };

    return (
        <div className={`pos-customer ${!sidebarOpen ? 'hidden-sidebar' : ''}`}>
            <div className={`pos-item pos-info ${!sidebarOpen ? 'spread-width' : ''}`}>
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
                    onCustomerNameChange={(name) => {
                        setCustomerName(name);
                        // Cập nhật customerName vào đơn hàng hiện tại
                        setOrders(prev => {
                            const newOrders = [...prev];
                            newOrders[activeOrderIndex] = {
                                ...newOrders[activeOrderIndex],
                                customerName: name,
                            };
                            return newOrders;
                        });
                    }}
                    onNotesChange={(notes) => {
                        setNotes(notes);
                        // Cập nhật notes vào đơn hàng hiện tại
                        setOrders(prev => {
                            const newOrders = [...prev];
                            newOrders[activeOrderIndex] = {
                                ...newOrders[activeOrderIndex],
                                notes: notes,
                            };
                            return newOrders;
                        });
                    }}
                    onAddOrder={handleAddOrder}
                    onSwitchOrder={handleSwitchOrder}
                    onDeleteOrder={handleDeleteOrder}
                />

            </div>
        </div>
    );
};

export default SalesScreen;