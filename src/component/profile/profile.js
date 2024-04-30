import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import formatDate from '../../utils/FormartDate';
import axios from 'axios';
import baseURL from '../../utils/api';

const Profile = ({ setShowModal, userID }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState({
        id: '',
        email: '',
        role: '',
        information: {
            name: '',
            avatar: '',
            gender: '',
            birthday: '',
            phone: '',
            address: '',
        }
    });
    const [newAvatar, setNewAvatar] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${baseURL}/user/get-detail/${userID}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `Bearer ${token}`
                    }
                });

                const userData = response.data.data;
                setEditedUser({
                    id: userData._id,
                    email: userData.email,
                    role: userData.role,
                    information: {
                        name: userData.information?.name || '',
                        avatar: userData.information?.avatar || '',
                        gender: userData.information?.gender || '',
                        birthday: userData.information?.birthday ? formatDate(userData.information.birthday) : '',
                        phone: userData.information?.phone || '',
                        address: userData.information?.address || '',
                    }
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user details:', error);
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userID]);

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
            const response = await axios.put(`${baseURL}/user/update-user/${editedUser.id}`,
                editedUser,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `Bearer ${token}`
                    }
                }
            );
            setEditMode(false); // Đóng modal sau khi lưu thành công
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div className='user-main'>
            <div className="user-profile">
                {loading && ( // Kiểm tra trạng thái loading
                    <div className="loading-overlay">
                        <FontAwesomeIcon icon={faSpinner} className="fa-spin" size="2x" />
                    </div>
                )}
                {!loading && ( // Hiển thị thông tin người dùng khi không còn loading
                    <>
                        <div className="avatar">
                            {editMode && (
                                <input
                                    name="avatar"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }} // Bắt đầu ẩn khi editMode là false
                                    onChange={handleInputChange}
                                />
                            )}
                            <img
                                src={newAvatar || editedUser.information.avatar}
                                alt="Avatar"
                                onClick={() => {
                                    if (editMode) {
                                        document.querySelector('.avatar input[type="file"]').click();
                                    }
                                }}
                            />
                        </div>
                        <div className="user-details">
                            <div><strong>Tài khoản:</strong> {editedUser.email}</div>
                            <div><strong>Tên:</strong> {editMode ? <input type="text" name="name" value={editedUser.information.name} onChange={handleInputChange} /> : editedUser.information.name}</div>
                            <div><strong>Giới tính:</strong>
                                {editMode ?
                                    <select name="gender" value={editedUser.information.gender} onChange={handleInputChange}>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                    :
                                    <div>{editedUser.information.gender}</div>
                                }
                            </div>
                            <div><strong>Ngày sinh:</strong> {editMode ? <input className='input-date' type="date" name="birthday" value={editedUser.information.birthday} onChange={handleInputChange} /> : editedUser.information.birthday}</div>
                            <div><strong>Số điện thoại:</strong> {editMode ? <input type="tel" name="phone" value={editedUser.information.phone} onChange={handleInputChange} /> : editedUser.information.phone}</div>
                            <div><strong>Địa chỉ:</strong> {editMode ? <input type="text" name="address" value={editedUser.information.address} onChange={handleInputChange} /> : editedUser.information.address}</div>
                        </div>
                        <div className="user-actions">
                            <button onClick={() => setEditMode(!editMode)}>{editMode ? 'Hủy' : 'Chỉnh sửa'}</button>
                            {editMode && <button onClick={saveChanges}>Lưu</button>}
                            <button onClick={() => setShowModal(false)}>Đóng</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
