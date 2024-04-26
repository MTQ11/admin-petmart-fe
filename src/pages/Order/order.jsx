import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faFilter, faSort } from '@fortawesome/free-solid-svg-icons';
import './order.css'; // Đảm bảo import file CSS của order
import formatDate from '../../utils/FormartDate';
import decodeToken from '../../utils/DecodeToken';
import ModalEditOrder from './modalEditOrder';
import Pagination from '../../component/pagination/pagination';
import formatCurrency from '../../utils/formatCurrency';
import formatPhone from '../../utils/formatPhoneNumber';

const Order = () => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updated, setUpdated] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState({
        lable: '',
        key: ''
    });
    const [sort, setSort] = useState({
        lable: '',
        key: ''
    });

    const [pageSize, setPageSize] = useState(5); // Số người dùng trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const [totalItems, setTotalItems] = useState(0); // Tổng số người dùng

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, searchTerm, sort, filter, updated]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let url = `http://localhost:3001/order/get-all?limit=${pageSize}&page=${currentPage - 1}&keysearch=${searchTerm}`;

            if (filter.key) {
                url += `&filter=${filter.lable}&filter=${filter.key}`;
            }

            if (sort.key) {
                url += `&sort=${sort.key}&sort=${sort.lable}`;
            }
            const response = await fetch(url, {
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
        setFilter({
            lable: '',
            key: ''
        })
        setSort({
            lable: '',
            key: ''
        })
    };

    const handleFilter = (e, lable) => {
        setFilter({
            lable: lable,
            key: e.target.value.toLowerCase()
        })
        setSort({
            lable: '',
            key: ''
        })
    };

    const handleSort = (e, lable) => {
        setFilter({
            lable: '',
            key: ''
        })
        setSort({
            lable: lable,
            key: e.target.value
        })
    };

    // const filteredOrders = orders?.filter(order =>
    //     order.orderItems.some(item =>
    //         item.name.toLowerCase().includes(searchTerm.toLowerCase())
    //     )
    // );

    const handleShowModalEdit = () => {
        setShowModalEdit(false);
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

    const confirmOrder = async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/order/admin-confirm/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': `beare ${token}`
            }
        });
        setUpdated(!updated);
    }

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
                                <th>Số điện thoại</th>
                                <th>Khách hàng
                                    <FontAwesomeIcon icon={faSort} style={{ marginLeft: '5px' }} />
                                    <select className='select-table' value={sort.key} onChange={(e) => handleSort(e, 'shippingAddress.fullName')}>
                                        <option value='asc'>A-Z</option>
                                        <option value='desc'>Z-A</option>
                                    </select>
                                </th>
                                <th>Thành tiền
                                    <FontAwesomeIcon icon={faSort} style={{ marginLeft: '5px' }} />
                                    <select className='select-table' value={sort.key} onChange={(e) => handleSort(e, 'totalPrice')}>
                                        <option value='asc'>Tăng</option>
                                        <option value='desc'>Giảm</option>
                                    </select>
                                </th>
                                <th>Thanh toán
                                    <FontAwesomeIcon icon={faFilter} style={{ marginLeft: '5px' }} />
                                    <select className='select-table' value={filter.key} onChange={(e) => handleFilter(e, 'isPaid')}>
                                        <option value=''>Tất cả</option>
                                        <option value='true'>Đã thanh toán</option>
                                        <option value='false'>Khi nhận</option>
                                    </select>
                                </th>
                                <th>Ngày lập
                                    <FontAwesomeIcon icon={faSort} style={{ marginLeft: '5px' }} />
                                    <select className='select-table' value={sort.key} onChange={(e) => handleSort(e, 'createdAt')}>
                                        <option value='asc'>Cũ nhất</option>
                                        <option value='desc'>Mới nhất</option>
                                    </select>
                                </th>
                                <th>Địa chỉ</th>
                                <th>Vận chuyển</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.map(order => (
                                <tr key={order._id} onClick={() => handleEditClick(order)}>
                                    <td>{order?._id}</td>
                                    <td>{formatPhone(order?.shippingAddress.phone)}</td>
                                    <td>{order?.shippingAddress.fullName}</td>
                                    <td>{formatCurrency(order?.totalPrice)}</td>
                                    <td>{order?.isPaid ? 'Đã thanh toán' : 'Khi nhận'}</td>
                                    <td>{order?.createdAt ? formatDate(order.createdAt) : null}</td>
                                    <td>{order?.shippingAddress.address}</td>
                                    <td>{order?.isDelivered ? 'Đã vận chuyển' :
                                        <button style={{backgroundColor: 'green', color: 'white', cursor: 'pointer'}}>Xác nhận</button>
                                    }</td>
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
            {showModalEdit && <ModalEditOrder order={selected} handleShowModalEdit={(handleShowModalEdit)} deleteOrder={deleteOrder} confirmOrder={confirmOrder}/>}
        </div>
    );
}

export default Order;
