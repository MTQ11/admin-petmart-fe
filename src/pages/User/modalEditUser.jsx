import React, { useState } from 'react';
import './modalEditUser.css';
import formatDate from '../../utils/FormartDate';
import axios from 'axios';

const ModalEditUser = ({ user, handleShowModalEdit, deleteUser }) => {
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
        }
    });
    const [newAvatar, setNewAvatar] = useState(null);

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
    return (
        <div className='user-main'>
            <div className="user-profile">
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
                <div className="user-details">
                    <div><strong>Tài khoản:</strong> <input type="text" name="email" value={editedUser.email} onChange={handleInputChange} /></div>
                    <div>
                        <strong>Quyền:</strong>
                        <select name="role" value={editedUser.role} onChange={handleInputChange}>
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                            <option value="customer">Customer</option>
                        </select>
                    </div>
                    <div><strong>Tên:</strong> <input type="text" name="name" value={editedUser.information.name} onChange={handleInputChange} /></div>
                    <div>
                        <strong>Giới tính:</strong>
                        <select name="gender" value={editedUser.information.gender} onChange={handleInputChange}>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                    <div><strong>Ngày sinh:</strong> <input type="text" value={editedUser.information.birthday} /> <input style={{width: '35px'}} className='input-date' type="date" name="birthday" value={editedUser.information.birthday} onChange={handleInputChange} /></div>
                    <div><strong>Số điện thoại:</strong> <input type="tel" name="phone" value={editedUser.information.phone} onChange={handleInputChange} /></div>
                    <div><strong>Địa chỉ:</strong> <input type="text" name="address" value={editedUser.information.address} onChange={handleInputChange} /></div>
                </div>
                <div className="user-actions">
                    <button onClick={() => setEditMode(!editMode)}>{editMode ? 'Hủy' : 'Chỉnh sửa'}</button>
                    {editMode && <button onClick={saveChanges}>Lưu</button>}
                    <button onClick={handleShowModalEdit}>Đóng</button>
                </div>
                <button className='button-delete' onClick={() => deleteUser(editedUser.id)}>Xóa</button>
            </div>
        </div>
    );
};

export default ModalEditUser;
