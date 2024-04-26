import React, { useEffect, useState } from 'react';
import './modalEditCustomer.css';
import formatDate from '../../utils/FormartDate';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import formatCurrency from '../../utils/formatCurrency';
import formatPhone from '../../utils/formatPhoneNumber';

const ModalEditCusomter = ({ user, handleShowModalEdit, deleteUser }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState({
        id: user._id,
        email: user.email,
        role: user.role,
        information: {
            name: user.information?.name,
            avatar: user.information?.avatar,
            gender: user.information?.gender,
            birthday: user.information?.birthday ? formatDate(user.information.birthday) : null,
            phone: user.information?.phone,
            address: user.information?.address,
            city: user.information?.city,
        }
    });
    const [newAvatar, setNewAvatar] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3001/order/admin-get-order-user/${editedUser.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `beare ${token}`
                    }
                });
                setOrderHistory(response.data.data);
            } catch (error) {
                console.error('Lỗi khi lấy lịch sử hóa đơn:', error);
            }
        };
        fetchOrderHistory();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'avatar') {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAvatar(reader.result);
                setEditedUser(prevState => ({
                    ...prevState,
                    information: {
                        ...prevState.information,
                        [name]: reader.result // Lưu trữ dưới dạng base64
                    }
                }));
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        } else {
            const isInformationField = ['name', 'gender', 'birthday', 'phone', 'address'].includes(name);
            if (isInformationField) {
                setEditedUser(prevState => ({
                    ...prevState,
                    information: {
                        ...prevState.information,
                        [name]: value
                    }
                }));
            } else {
                setEditedUser(prevState => ({
                    ...prevState,
                    [name]: value
                }));
            }
        }
    };

    const saveChanges = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:3001/user/admin-update-user/${editedUser.id}`,
                editedUser,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `beare ${token}`
                    }
                }
            ); handleShowModalEdit();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const calculateOrderTotal = (order) => {
        let totalOrderPrice = 0;
        order.orderItems.forEach(item => {
            totalOrderPrice += item.price * item.amount;
        });
        // Cộng thêm phí vận chuyển vào tổng giá trị
        totalOrderPrice += order.shippingPrice;
        return totalOrderPrice;
    };

    return (
        <div className='customer-main'>
            <div className="customer-profile">
                <div>
                <FontAwesomeIcon icon={faClose} onClick={handleShowModalEdit} style={{float: 'left', cursor: 'pointer'}}/>
                    <div className="avatar">
                        <input
                            name="avatar"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleInputChange}
                        />
                        <img src={newAvatar || editedUser.information.avatar} alt="Avatar" onClick={() => document.querySelector('.avatar input[type="file"]').click()} />
                    </div>
                    <div className="customer-details">
                        <div className="detail-row">
                            <strong>Tài khoản:</strong>
                            <p>{editedUser.email}</p>
                            {/* <input type="text" name="email" value={editedUser.email} onChange={handleInputChange} /> */}
                        </div>
                        <div className="detail-row">
                            <strong>Tên:</strong>
                            <p>{editedUser.information.name}</p>
                            {/* <input type="text" name="name" value={editedUser.information.name} onChange={handleInputChange} /> */}
                        </div>
                        <div className="detail-row">
                            <strong>Giới tính:</strong>
                            <p>{editedUser.information.gender}</p>
                            {/* <select name="gender" value={editedUser.information.gender} onChange={handleInputChange}>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select> */}
                        </div>
                        <div className="detail-row">
                            <strong>Ngày sinh:</strong>
                            <p>{editedUser.information.birthday}</p>
                            {/* <input className='input-date' type="date" name="birthday" value={editedUser.information.birthday} onChange={handleInputChange} /> */}
                        </div>
                        <div className="detail-row">
                            <strong>Số điện thoại:</strong>
                            <p>{editedUser.information.phone}</p>
                            {/* <input type="tel" name="phone" value={editedUser.information.phone} onChange={handleInputChange} /> */}
                        </div>
                        <div className="detail-row">
                            <strong>Địa chỉ:</strong>
                            <p>{editedUser.information.address}-{editedUser.information.city}</p>
                            {/* <input type="text" name="address" value={editedUser.information.address} onChange={handleInputChange} /> */}
                        </div>
                    </div>
                    <div className="customer-actions">
                        {/* <button onClick={() => setEditMode(!editMode)}>{editMode ? 'Hủy' : 'Chỉnh sửa'}</button>
                        {editMode && <button onClick={saveChanges}>Lưu</button>} */}
                    </div>
                    <button className='button-delete' onClick={() => deleteUser(editedUser.id)}>Xóa</button>
                </div>
                {orderHistory.length > 0 && (
                    <div className="order-history">
                        <h3>Lịch sử hóa đơn({orderHistory.length})</h3>
                        <ul>
                            {orderHistory.map(order => (
                                <li className='order' key={order._id}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th colSpan="2">Thông tin</th>
                                                <td colSpan="3">{order.shippingAddress.fullName} - {formatPhone(order.shippingAddress.phone)} <br/> {order.shippingAddress.address}, {order.shippingAddress.city}</td>
                                            </tr>
                                            <tr>
                                                <th colSpan="2">Thời gian</th>
                                                <td colSpan="3">{formatDate(order.createdAt)}</td>
                                            </tr>
                                            <tr>
                                                <th colSpan="2">Mã hóa đơn</th>
                                                <td colSpan="3">{order._id}</td>
                                            </tr>
                                            <tr>
                                                <th>Mã</th>
                                                <th>Tên sản phẩm</th>
                                                <th>Đơn giá</th>
                                                <th>Số lượng</th>
                                                <th>Tổng giá</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.orderItems.map(item => (
                                                <tr key={item.id}>
                                                    <td>{item.idProduct}</td>
                                                    <td>{item.name}</td>
                                                    <td>{formatCurrency(item.price)}</td>
                                                    <td>{item.amount}</td>
                                                    <td>{formatCurrency(item.price * item.amount)}</td>
                                                </tr>
                                            ))}
                                            <tr> {/* Dòng cuối cùng để hiển thị tổng tiền phiếu nhập */}
                                                <td colSpan="4"><b>Phí vận chuyển</b></td>
                                                <td colSpan="4">{order.shippingPrice}</td>
                                            </tr>
                                            <tr> {/* Dòng cuối cùng để hiển thị tổng tiền phiếu nhập */}
                                                <td colSpan="4"><b>Tổng hóa đơn</b></td>
                                                <td>{formatCurrency(calculateOrderTotal(order))}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModalEditCusomter;
