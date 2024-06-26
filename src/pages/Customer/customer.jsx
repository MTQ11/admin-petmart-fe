import React, { useEffect, useState } from 'react';
import './customer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faFilter, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import formatDate from '../../utils/FormartDate';
import Pagination from '../../component/pagination/pagination';
import ModalEditCusomter from './modalEditCusomter';
import baseURL from '../../utils/api';


const Customer = () => {
    const [users, setUsers] = useState([]);
    const [userUpdated, setUserUpdated] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newUserFields, setNewUserFields] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'customer',
        name: '',
        avatar: '',
        gender: '',
        birthday: '',
        phone: '',
        address: '',
    });
    const [showProfile, setShowProfile] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading
    const [searchTerm, setSearchTerm] = useState('');
    const [avatar, setAvatar] = useState('');
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
    }, [currentPage, pageSize, sort, filter, userUpdated]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchData();
        }, 300); // Thời gian chờ 300ms
    
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm])

    const fetchData = async () => {
        setLoading(true); // Bắt đầu loading
        try {
            let url = `${baseURL}/user/getCustomer?limit=${pageSize}&page=${currentPage - 1}&keysearch=${searchTerm}`;

            if (filter.key) {
                url += `&filter=${filter.lable}&filter=${filter.key}`;
            }

            if (sort.key) {
                url += `&sort=${sort.key}&sort=${sort.lable}`;
            }

            const token = localStorage.getItem('token');
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `beare ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setUsers(data.data);
            setTotalItems(data.total);
            setTotalPages(Math.ceil(data.total / pageSize)); // Tính toán và cập nhật totalPages
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Kết thúc loading dù có lỗi hay không
        }
    };

    const addUser = async (e) => {
        try {
            e.preventDefault();
            const newUser = {
                email: newUserFields.email,
                password: newUserFields.password,
                confirmPassword: newUserFields.confirmPassword,
                role: newUserFields.role,
                information: {
                    name: newUserFields.name,
                    avatar: newUserFields.avatar,
                    gender: newUserFields.gender,
                    birthday: newUserFields.birthday,
                    phone: newUserFields.phone,
                    address: newUserFields.address,
                }
            };

            const response = await fetch(`${baseURL}/user/sign-up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (!response.ok) {
                alert("Tạo không thành công user")
                throw new Error('Failed to add user');
            }
            setUserUpdated(!userUpdated);
            setShowModal(false);
            resetNewUserFields()
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        if (name === 'avatar') {
            const file = e.target.files[0]; // Chỉ lấy file đầu tiên trong danh sách
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setNewUserFields(prevUserFields => ({
                    ...prevUserFields,
                    avatar: reader.result // Lưu đường dẫn dạng base64 của ảnh vào avatar
                }));
            };
        } else {
            setNewUserFields(prevUserFields => ({
                ...prevUserFields,
                [name]: value
            }));
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user); // Set the user being edited
        setShowProfile(!showProfile); // Show the profile
    };

    const handleShowModalEdit = () => {
        setShowProfile(false);
        setUserUpdated(!userUpdated)
    };

    const deleteUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const url = `${baseURL}/user/delete/${id}`;

            const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?");
            if (!confirmDelete) {
                return;
            }

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `beare ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUserUpdated(!userUpdated);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
        handleShowModalEdit()
    };

    const handleSearchChange = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);
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

    const handleCloseModal = () => {
        setShowModal(false);
        resetNewUserFields()
    };

    const resetNewUserFields = () => {
        setNewUserFields({
            email: '',
            password: '',
            confirmPassword: '',
            role: 'customer',
            name: '',
            avatar: '',
            gender: '',
            birthday: '',
            phone: '',
            address: '',
        });
    };

    return (
        <div className="user-container">
            <div className="user-actions">
                <input id='search-input' type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={handleSearchChange} />
                <button onClick={() => setShowModal(true)}>Thêm người dùng</button>
            </div>
            {loading ? ( // Hiển thị loading khi đang fetching
                <div>
                    <FontAwesomeIcon icon={faSpinner} spin /> {/* Biểu tượng xoay tròn */}
                </div>
            ) : (
                <>
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Email
                                <FontAwesomeIcon icon={faSearch} style={{ marginLeft: '5px' }} />
                                </th>
                                <th>Tên
                                <FontAwesomeIcon icon={faSort} style={{ marginLeft: '5px' }} />
                                    <select className='select-table' value={sort.key} onChange={(e) => handleSort(e, 'information.name')}>
                                        <option value='asc'>A-Z</option>
                                        <option value='desc'>Z-A</option>
                                    </select>
                                </th>
                                <th>Giới tính
                                    <FontAwesomeIcon icon={faFilter} style={{ marginLeft: '5px' }} />
                                    <select className='select-table' value={filter.key} onChange={(e) => handleFilter(e, 'information.gender')}>
                                        <option value=''>Tất cả</option>
                                        <option value='nam'>Nam</option>
                                        <option value='nữ'>Nữ</option>
                                    </select>
                                </th>
                                <th>Ngày sinh
                                <FontAwesomeIcon icon={faSort} style={{ marginLeft: '5px' }} />
                                    <select className='select-table' value={sort.key} onChange={(e) => handleSort(e, 'information.birthday')}>
                                        <option value='asc'>Tăng</option>
                                        <option value='desc'>Giảm</option>
                                    </select>
                                </th>
                                <th>SĐT</th>
                                <th>Địa chỉ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map(user => (
                                <tr key={user._id} onDoubleClick={() => handleEditClick(user)}>
                                    <td>
                                        <img src={user.information?.avatar} alt="Avatar" />
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.information?.name}</td>
                                    <td>{user.information?.gender}</td>
                                    <td>{user.information?.birthday ? formatDate(user.information.birthday) : null}</td>
                                    <td>0{user.information?.phone}</td>
                                    <td>{user.information?.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                    />

                </>

            )}

            {showModal && (
                <div className="customer-modal">
                    <div className="customer-modal-main">
                        <form className="add-user-form">
                            <div>
                                <input
                                    id='avatar'
                                    name="avatar"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleNewUserChange}
                                />
                                <img className='avatar' src={avatar || newUserFields.avatar} alt="Avatar" onClick={() => document.querySelector('#avatar').click()} />
                            </div>
                            <div>
                                <label htmlFor="email">Tài khoản</label>
                                <input type="text" id="email" name="email" value={newUserFields.email} onChange={handleNewUserChange} required />
                            </div>
                            <div>
                                <label htmlFor="password">Mật khẩu</label>
                                <input type="password" id="password" name="password" value={newUserFields.password} onChange={handleNewUserChange} required />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" value={newUserFields.confirmPassword} onChange={handleNewUserChange} required />
                            </div>
                            {/* <div>
                                <label htmlFor="role">Vai trò</label>
                                <select id="role" name="role" value={newUserFields.role} onChange={handleNewUserChange}>
                                    <option value="admin">Quản trị</option>
                                    <option value="member">Thành viên</option>
                                    <option value="customer">Khách hàng</option>
                                </select>
                            </div> */}
                            <div>
                                <label htmlFor="name">Tên</label>
                                <input type="text" id="name" name="name" value={newUserFields.name} onChange={handleNewUserChange} />
                            </div>
                            <div>
                                <label htmlFor="gender">Giới tính</label>
                                <select id="gender" name="gender" value={newUserFields.gender} onChange={handleNewUserChange}>
                                    <option></option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="birthday">Ngày sinh</label>
                                <input type="date" id="birthday" name="birthday" value={newUserFields.birthday} onChange={handleNewUserChange} />
                            </div>
                            <div>
                                <label htmlFor="phone">Số điện thoại</label>
                                <input type="text" id="phone" name="phone" value={newUserFields.phone} onChange={handleNewUserChange} />
                            </div>
                            <div>
                                <label htmlFor="address">Địa chỉ</label>
                                <input type="text" id="address" name="address" value={newUserFields.address} onChange={handleNewUserChange} />
                            </div>
                            <button onClick={addUser}>Xác nhận</button>
                            <button onClick={handleCloseModal}>Đóng</button>
                        </form>
                    </div>
                </div>
            )}
            {showProfile && <ModalEditCusomter user={selectedUser} handleShowModalEdit={(handleShowModalEdit)} deleteUser={(deleteUser)} />}
        </div>
    );
}

export default Customer;
