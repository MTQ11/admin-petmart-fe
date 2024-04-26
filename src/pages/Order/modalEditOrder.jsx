import React, { useState } from 'react';
import formatDate from '../../utils/FormartDate';
import './modalEditOrder.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import formatPhone from '../../utils/formatPhoneNumber';
import formatCurrency from '../../utils/formatCurrency';

const ModalEditOrder = ({ order, handleShowModalEdit, deleteOrder, confirmOrder }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedOrder, setEditedOrder] = useState({
        id: order?._id,
        shippingAddress: {
            fullName: order?.shippingAddress.fullName,
            address: order?.shippingAddress.address,
            district: order?.shippingAddress.district,
            city: order?.shippingAddress.city,
            phone: order?.shippingAddress.phone
        },
        orderItems: order?.orderItems.map(item => ({
            product: item.product,
            idProduct: item.idProduct,
            name: item.name,
            image: item.image,
            price: item.price,
            amount: item.amount
        })),
        paymentMethod: order?.paymentMethod,
        itemsPrice: order?.itemsPrice,
        shippingPrice: order?.shippingPrice,
        totalPrice: order?.totalPrice,
        user: order?.user,
        isPaid: order?.isPaid,
        isDelivered: order?.isDelivered,
        createdAt: order?.createdAt
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedOrder(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const saveChanges = async () => {
        try {
            const response = await axios.put(`http://localhost:3001/order/update-order/${editedOrder.id}`, editedOrder);
            handleShowModalEdit();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    let totalReceiptPrice = 0;
    editedOrder.orderItems.map((item, index) => {
        const totalPrice = item.price * item.amount;
        totalReceiptPrice += totalPrice;
        return {
            ...item,
            totalPrice
        };
    });

    return (
        <div className='order-main'>
            <div className="order-details">
                <FontAwesomeIcon className="close-modal" icon={faClose} onClick={handleShowModalEdit} />
                <div className='order-details-info'>
                    <div>
                        <div><strong>Người nhận:</strong> <div className="fullname">{editedOrder.shippingAddress.fullName}</div></div>
                        <div><strong>Địa chỉ:</strong> <div className="address">{editedOrder.shippingAddress.address}</div></div>
                        <div><strong>Thành phố:</strong> <div className="city">{editedOrder.shippingAddress.city}</div></div>
                        <div><strong>SĐT:</strong> <div className="phone">{formatPhone(editedOrder.shippingAddress.phone)}</div></div>
                    </div>
                    <div>
                        <div><strong>Ngày lập:</strong> <div className="paymentMethod">{formatDate(editedOrder.createdAt)}</div></div>
                        <div><strong>Phương thức:</strong> <div className="paymentMethod">{editedOrder.paymentMethod}</div></div>
                        <div><strong>Thanh toán:</strong> <div className="isPaid">{editedOrder.isPaid ? 'Đã thanh' : 'Thanh toán khi nhận'}</div></div>
                        <div><strong>Vận chuyển:</strong> <div className="isDelivered">{editedOrder.isDelivered ? 'Đã vận chuyển' : 'Chưa vận chuyển'}</div></div>
                    </div>
                </div>
                <div className="order-details-product">
                    <table>
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
                            {editedOrder.orderItems.map((item, index) => (
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
                                <td colSpan="4">{order.shippingPrice}</td>
                            </tr>
                            <tr> {/* Dòng cuối cùng để hiển thị tổng tiền phiếu nhập */}
                                <td colSpan="4"><b>Tổng tiền phiếu nhập</b></td>
                                <td>{formatCurrency(totalReceiptPrice + order.shippingPrice)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="order-actions">
                    <button className="button-confirm-order" onClick={() => {
                        handleShowModalEdit()
                        confirmOrder(editedOrder.id)
                    }}>Xác nhận</button>
                    <button className="button-delete-order" onClick={() => deleteOrder(editedOrder.user, editedOrder.id)}>Hủy hóa đơn</button>
                </div>
            </div>
        </div>
    );
};

export default ModalEditOrder;
