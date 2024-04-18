import React, { useEffect, useState } from 'react';
import { MdEdit } from "react-icons/md";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './order.css'; // Đảm bảo import file CSS của order
import formatDate from '../../utils/FormartDate';
import decodeToken from '../../utils/DecodeToken';
import ModalEditOrder from './modalEditOrder';
import Pagination from '../../component/pagination/pagination';

const Order = () => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updated, setUpdated] = useState(false);

    const [pageSize, setPageSize] = useState(5); // Số người dùng trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const [totalItems, setTotalItems] = useState(0); // Tổng số người dùng

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, updated]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/order/get-all?limit=${pageSize}&page=${currentPage - 1}`, {
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
            setTotalItems(data.total);
            setTotalPages(data.totalPage); // Tính tổng số trang
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/order/get-all?limit=10&page=0`, {
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
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredOrders = orders?.filter(order =>
        order.orderItems.some(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleShowModalEdit = () => {
        setShowModalEdit(false);
        setUpdated(!updated);
    };

    const handleEditClick = (order) => {
        setSelected(order);
        setShowModalEdit(!showModalEdit);
    };

    const deleteOrder = async (user, id) => {
        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:3001/order/admin-cancel-order/${user}/${id}`;

            const confirmDelete = window.confirm("Are you sure you want to delete this order?");
            if (!confirmDelete) {
                return;
            }

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete order');
            }

            setUpdated(!updated);
        } catch (error) {
            console.error('Error deleting order:', error);
        }
        handleShowModalEdit();
    };

    return (
        <div className="order-container">
            <div className="order-actions">
                <input id='search-input' type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={handleSearch} />
            </div>
            {loading ? (
                <div>
                    <FontAwesomeIcon icon={faSpinner} spin />
                </div>
            ) : (
                <>
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Mã hóa đơn</th>
                                <th>Khách hàng</th>
                                <th>Địa chỉ</th>
                                <th>Số điện thoại</th>
                                <th>Thành tiền</th>
                                <th>Phương thức</th>
                                <th>Thanh toán</th>
                                <th>Hình thức</th>
                                <th>Ngày lập</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders?.map(order => (
                                <tr key={order._id}>
                                    <td>{order?._id}</td>
                                    <td>{order?.shippingAddress.fullName}</td>
                                    <td>{order?.shippingAddress.address}</td>
                                    <td>0{order?.shippingAddress.phone}</td>
                                    <td>{order?.totalPrice}</td>
                                    <td>{order?.paymentMethod}</td>
                                    <td>{order?.isPaid ? 'Đã thanh toán' : 'Khi nhận'}</td>
                                    <td>{order?.isDelivered ? order.isDelivered : 'Vận chuyển'}</td>
                                    <td>{order?.createdAt ? formatDate(order.createdAt) : null}</td>
                                    <td>
                                        <MdEdit style={{ width: '30px', height: '30px' }} onClick={() => handleEditClick(order)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination // Sử dụng component Pagination
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                    />
                </>

            )}
            {showModalEdit && <ModalEditOrder order={selected} handleShowModalEdit={(handleShowModalEdit)} deleteOrder={deleteOrder} />}
        </div>
    );
}

export default Order;
