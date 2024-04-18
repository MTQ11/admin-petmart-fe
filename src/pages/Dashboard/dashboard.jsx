import React, { useEffect, useRef, useState } from 'react';
import './dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet , faShoppingCart, faUsers, faNewspaper, faCube} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Import axios
import RevenueChart from '../../component/chart/lineChart';
import formatDate from '../../utils/FormartDate';
import UserStatistics from '../../component/chart/userChart';
import ProductChart from '../../component/chart/productChart';
import PostChart from '../../component/chart/postChart';
import getHour from '../../utils/GetHour';

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


    useEffect(() => {
        fetchDataStartBox()
        fetchDataOrder()
    }, []);

    const fetchDataStartBox = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/report/startbox`, {
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
            const response = await fetch(`http://localhost:3001/order/get-all`, {
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
        const orderDate = new Date(order.createdAt); // Chuyển đổi ngày tạo của đơn hàng thành đối tượng Date
        // So sánh ngày của đơn hàng với ngày hiện tại
        const today = new Date(); // Lấy ngày hiện tại

        return orderDate.getDate() === today.getDate() &&
            orderDate.getMonth() === today.getMonth() &&
            orderDate.getFullYear() === today.getFullYear();
    });

    const handleStartBoxClick = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

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
                    <h4>Thành viên</h4>
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
                <h3>Đơn trong ngày</h3>
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
                                <th>Hình thức</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordersToday.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{getHour(order.createdAt)}</td>
                                    <td>{order.shippingAddress.fullName}</td>
                                    <td>{order.shippingAddress.address}</td>
                                    <td>0{order.shippingAddress.phone}</td>
                                    <td>{order.totalPrice}</td>
                                    <td>{order.paymentMethod}</td>
                                    <td>{order.isPaid ? 'Đã thanh toán' : 'Khi nhận'}</td>
                                    <td>{order.isDelivered ? 'Yes' : 'Vận chuyển'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-orders-message">Chưa có đơn hàng nào trong ngày hôm nay</div>
                )}

            </div>
            <div ref={revenueChartRef}>
                <RevenueChart setTotalRevenue={setTotalRevenue}/>
            </div>
            <div ref={userStatisticsRef}>
                <UserStatistics/>
            </div>
            <div ref={productChartRef}>
                <ProductChart/>
            </div>
            <div ref={postChartRef}>
                <PostChart/>
            </div>
        </div>
    );
}

export default Dashboard;
