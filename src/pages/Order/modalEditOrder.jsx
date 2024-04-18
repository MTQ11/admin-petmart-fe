import React, { useState } from 'react';
import formatDate from '../../utils/FormartDate';
import './modalEditOrder.css';
import axios from 'axios';

const ModalEditOrder = ({ order, handleShowModalEdit, deleteOrder }) => {
    const [editMode, setEditMode] = useState(false);
    console.log(order)
    const [editedOrder, setEditedOrder] = useState({
        id: order?._id,
        shippingAddress: {
            fullName: order?.shippingAddress.fullName,
            address: order?.shippingAddress.address,
            city: order?.shippingAddress.city,
            phone: order?.shippingAddress.phone
        },
        orderItems: order?.orderItems.map(item => ({
            product: item.product,
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
        isDelivered: order?.isDelivered
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
            console.log(response);
            handleShowModalEdit();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    return (
        <div className='order-main'>
            <div className="order-details">
                <button className="close-modal" onClick={handleShowModalEdit}>X</button> {/* Nút tắt modal */}
                <div className='order-details-info'>
                    <div>
                        <div><strong>Người nhận:</strong> <div className="fullname">{editedOrder.shippingAddress.fullName}</div></div>
                        <div><strong>Địa chỉ:</strong> <div className="address">{editedOrder.shippingAddress.address}</div></div>
                        <div><strong>Thành phố:</strong> <div className="city">{editedOrder.shippingAddress.city}</div></div>
                        <div><strong>SĐT:</strong> <div className="phone">{editedOrder.shippingAddress.phone}</div></div>
                    </div>
                    <div>
                    <div><strong>Phương thức:</strong> <div className="paymentMethod">{editedOrder.paymentMethod}</div></div>
                    <div><strong>Thành tiền:</strong> <div className="itemsPrice">{editedOrder.itemsPrice}</div></div>
                    <div><strong>Phí vận chuyển:</strong> <div className="shingpingPrice">{editedOrder.shippingPrice}</div></div>
                    <div><strong>Tổng tiền:</strong> <div className="totalPrice">{editedOrder.totalPrice}</div><div className="isPaid">{editedOrder.isPaid ? "(Đã thanh toán)" : "(Chờ thanh toán)"}</div></div>
                </div>
                </div>
                <div className="order-details-product">
                    <table>
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editedOrder.orderItems.map((item, index) => (
                                <tr key={index} className="product-item">
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="order-actions">
                    <button className="button-delete-order" onClick={() => deleteOrder(editedOrder.user, editedOrder.id)}>Hủy hóa đơn</button>
                </div>
            </div>
        </div>
    );
};

export default ModalEditOrder;
