import React, { useState } from 'react';
import './modalEditPromotion.css';
import axios from 'axios';

const ModalEditPromotion = ({ promotion, handleShowModalEdit, deletePromotion }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedPromotion, setEditedPromotion] = useState({
        id: promotion?._id,
        name: promotion?.name,
        startday: promotion?.startday,
        endday: promotion?.endday,
        discount: promotion?.discount,
        note: promotion?.note
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPromotion(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const saveChanges = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`http://localhost:3001/promotion/update-promotion/${editedPromotion.id}`, editedPromotion, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': `bearer ${token}`
                }
            });
            console.log(response);
            handleShowModalEdit();
        } catch (error) {
            console.error('Error updating promotion:', error);
        }
    };

    return (
        <div className='promotion-main'>
            <div className='promotion-profile'>
                <div className="promotion-details">
                    <div><strong>Tên khuyến mãi:</strong> <input type="text" name="name" value={editedPromotion.name} onChange={handleInputChange} /></div>
                    <div><strong>Ngày bắt đầu:</strong> <input type="date" name="startday" value={editedPromotion.startday} onChange={handleInputChange} /></div>
                    <div><strong>Ngày kết thúc:</strong> <input type="date" name="endday" value={editedPromotion.endday} onChange={handleInputChange} /></div>
                    <div><strong>Phần trăm giảm giá:</strong> <input type="number" name="discount" value={editedPromotion.discount} onChange={handleInputChange} /></div>
                    <div><strong>Ghi chú:</strong> <input type="text" name="note" value={editedPromotion.note} onChange={handleInputChange} /></div>
                </div>
                <div className="promotion-actions">
                    <button onClick={() => setEditMode(!editMode)}>{editMode ? 'Hủy' : 'Chỉnh sửa'}</button>
                    {editMode && <button onClick={saveChanges}>Lưu</button>}
                    <button onClick={handleShowModalEdit}>Đóng</button>
                </div>
                <button className='button-delete' onClick={() => deletePromotion(editedPromotion.id)}>Xóa</button>
            </div>
        </div>
    );
};

export default ModalEditPromotion;
