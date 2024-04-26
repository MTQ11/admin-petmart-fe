import React, { useEffect, useRef, useState } from 'react';
import './dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faShoppingCart, faUsers, faNewspaper, faCube } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Import axios
import RevenueChart from '../../component/chart/lineChart';
import formatDate from '../../utils/FormartDate';
import UserStatistics from '../../component/chart/userChart';
import ProductChart from '../../component/chart/productChart';
import PostChart from '../../component/chart/postChart';
import getHour from '../../utils/GetHour';
import formatCurrency from '../../utils/formatCurrency';
import formatPhone from '../../utils/formatPhoneNumber';
import baseURL from '../../utils/api';

const Dashboard = () => {
    const revenueChartRef = useRef(null);
    const userStatisticsRef = useRef(null);
    const productChartRef = useRef(null);
    const postChartRef = useRef(null);

    const [totalRevenue, setTotalRevenue] = useState(0)
    const [orders, setOrders] = useState([])
    const [totalOrder, setTotalOrder] = useState(0)
    const [totalUser, setTotalUser] = useState(0)
    const [totalPost, setTotalPost] = useState(0)
    const [totalProduct, setTotalProduct] = useState(0)
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [updated, setUpdated] = useState(false);



    useEffect(() => {
        fetchDataStartBox()
        fetchDataOrder()
    }, [updated]);

    const fetchDataStartBox = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/report/startbox`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `beare ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            setTotalOrder(data.totalOrder);
            setTotalUser(data.totalUser);
            setTotalPost(data.totalPost);
            setTotalProduct(data.totalProduct)
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchDataOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseURL}/order/get-all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `beare ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            setOrders(data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };


    // Lọc ra các đơn hàng trong ngày hôm nay
    const ordersToday = orders.filter(order => {
        return order.isDelivered === false
    });

    const handleStartBoxClick = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    const confirmOrder = async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${baseURL}/order/admin-confirm/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': `beare ${token}`
            }
        });
        setUpdated(!updated);
    }

    const ShowDetailOrder = (order) => {
        setShowModal(true)
        setSelectedOrder(order);
    };

    let totalReceiptPrice = 0;
    selectedOrder?.orderItems.map((item, index) => {
        const totalPrice = item.price * item.amount;
        totalReceiptPrice += totalPrice;
        return {
            ...item,
            totalPrice
        };
    });

    return (
        <div className='dashboard-container'>
            <div className="stats">
                <div className="stat-box">
                    <h4>Đơn hàng</h4>
                    <p>{totalOrder} <FontAwesomeIcon size="lg" icon={faShoppingCart} /></p>
                </div>
                <div className="stat-box" onClick={() => handleStartBoxClick(revenueChartRef)}>
                    <h4>Doanh thu</h4>
                    <p>{totalRevenue} <FontAwesomeIcon size="lg" icon={faWallet} /></p>
                </div>
                <div className="stat-box" onClick={() => handleStartBoxClick(userStatisticsRef)}>
                    <h4>Người dùng</h4>
                    <p>{totalUser} <FontAwesomeIcon size="lg" icon={faUsers} /></p>
                </div>
                <div className="stat-box" onClick={() => handleStartBoxClick(productChartRef)}>
                    <h4>Sản phẩm</h4>
                    <p>{totalProduct} <FontAwesomeIcon size="lg" icon={faCube} /></p>
                </div>
                <div className="stat-box" onClick={() => handleStartBoxClick(postChartRef)}>
                    <h4>Bài viết</h4>
                    <p>{totalPost} <FontAwesomeIcon size="lg" icon={faNewspaper} /></p>
                </div>
            </div>

            <div className="recent-orders">
                <h3>Chờ xác nhận</h3>
                {ordersToday.length > 0 ? (
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Mã hóa đơn</th>
                                <th>Thời gian</th>
                                <th>Khách hàng</th>
                                <th>Địa chỉ</th>
                                <th>Số điện thoại</th>
                                <th>Thành tiền</th>
                                <th>Phương thức thanh toán</th>
                                <th>Thanh toán</th>
                                <th>Vận chuyển</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordersToday.map(order => (
                                <tr key={order._id} onClick={() => ShowDetailOrder(order)}>
                                    <td>{order._id}</td>
                                    <td>{getHour(order.createdAt)}</td>
                                    <td>{order.shippingAddress.fullName}</td>
                                    <td>{order.shippingAddress.address}</td>
                                    <td>{formatPhone(order.shippingAddress.phone)}</td>
                                    <td>{formatCurrency(order.totalPrice)}</td>
                                    <td>{order.paymentMethod}</td>
                                    <td>{order.isPaid ? 'Đã thanh toán' : 'Khi nhận'}</td>
                                    <td>{order.isDelivered ? 'Đã vận chuyển' :
                                        <button onClick={() => confirmOrder(order._id)} style={{ backgroundColor: 'green', color: 'white', cursor: 'pointer' }}>Xác nhận</button>
                                    }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-orders-message">Chưa có đơn hàng mới</div>
                )}
            </div>
            {showModal && (
                <div className="detail-order-modal">
                    <div className="detail-order-content">
                        <table className="table-detail-order">
                            <thead>
                                <tr>
                                    <th>Mã</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Đơn giá</th>
                                    <th>Số lượng</th>
                                    <th>Tổng giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.orderItems.map((item, index) => (
                                    <tr key={index} className="product-item">
                                        <td>{item.idProduct}</td>
                                        <td>{item.name}</td>
                                        <td>{formatCurrency(item.price)}</td>
                                        <td>{item.amount}</td>
                                        <td>{formatCurrency(item.price * item.amount)}</td>
                                    </tr>
                                ))}
                                <tr> {/* Dòng cuối cùng để hiển thị tổng tiền phiếu nhập */}
                                    <td colSpan="4"><b>Phí vận chuyển</b></td>
                                    <td colSpan="4">{formatCurrency(selectedOrder.shippingPrice)}</td>
                                </tr>
                                <tr> {/* Dòng cuối cùng để hiển thị tổng tiền phiếu nhập */}
                                    <td colSpan="4"><b>Tổng tiền phiếu nhập</b></td>
                                    <td>{formatCurrency(totalReceiptPrice + selectedOrder.shippingPrice)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <button onClick={() => {
                            confirmOrder(selectedOrder._id)
                            setShowModal(false)
                        }} style={{backgroundColor: 'green', color: 'white', cursor: 'pointer'}}>Xác nhận</button>
                        <button onClick={() => setShowModal(false)} style={{marginLeft: '5px', cursor: 'pointer'}}>Đóng</button>
                    </div>
                </div>
            )}
            <div ref={revenueChartRef}>
                <RevenueChart setTotalRevenue={setTotalRevenue} />
            </div>
            <div ref={userStatisticsRef}>
                <UserStatistics />
            </div>
            <div ref={productChartRef}>
                <ProductChart />
            </div>
            <div ref={postChartRef}>
                <PostChart />
            </div>
        </div>
    );
}

export default Dashboard;
