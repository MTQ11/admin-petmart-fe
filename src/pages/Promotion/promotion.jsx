import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './promotion.css';
import formatDate from '../../utils/FormartDate';
import ModalEditPromotion from './modalEditPromotion';
import Pagination from '../../component/pagination/pagination';

const Promotion = () => {
    const [loading, setLoading] = useState(false);
    const [promotions, setPromotions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [updated, setUpdated] = useState(false);
    const [pageSize, setPageSize] = useState(5); // Số sản phẩm trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const [totalItems, setTotalItems] = useState(0); // Tổng số sản phẩm
    const [promotionFields, setPromotionFields] = useState({
        name: '',
        startday: '',
        endday: '',
        discount: 0,
        note: ''
    });

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, updated]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/promotion/get-promotion?limit=${pageSize}&page=${currentPage - 1}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch promotions');
            }
            const data = await response.json();
            setPromotions(data.data);
            setTotalItems(data.total);
            setTotalPages(data.totalPage); // Tính tổng số trang
        } catch (error) {
            console.error('Error fetching promotions:', error);
        } finally {
            setLoading(false);
        }
    };

    const createPromotion = async () => {
        try {
            const token = localStorage.getItem('token');
            const newPromotion = {
                name: promotionFields.name,
                startday: promotionFields.startday,
                endday: promotionFields.endday,
                discount: promotionFields.discount,
                note: promotionFields.note
            };

            const response = await fetch('http://localhost:3001/promotion/create-promotion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `bearer ${token}`
                },
                body: JSON.stringify(newPromotion)
            });

            if (!response.ok) {
                throw new Error('Failed to add promotion');
            }
            setUpdated(!updated);
            setShowModal(false);
        } catch (error) {
            console.error('Error adding promotion:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPromotionFields({ ...promotionFields, [name]: value });
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleShowModalEdit = () => {
        setShowModalEdit(false);
        setUpdated(!updated);
    };

    const handleEditClick = (promotion) => {
        setSelectedPromotion(promotion);
        setShowModalEdit(true);
    };

    const deletePromotion = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:3001/promotion/delete/${id}`;

            const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?");
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
                throw new Error('Failed to delete promotion');
            }

            setUpdated(!updated);
        } catch (error) {
            console.error('Error deleting promotion:', error);
        }
        handleShowModalEdit();
    };

    return (
        <div className="promotion-container">
            <div className="promotion-actions">
                <input type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={handleSearch} />
                <button onClick={() => setShowModal(true)}>Tạo chương trình</button>
            </div>
            {loading ? (
                <div>
                    <FontAwesomeIcon icon={faSpinner} spin />
                </div>
            ) : (
                <>
                    <table className="promotion-table">
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Phần trăm (%)</th>
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                promotions
                                    .filter(promotion => promotion.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map(promotion => (
                                        <tr key={promotion.id} onClick={() => handleEditClick(promotion)} >
                                            <td>{promotion?.name}</td>
                                            <td>{promotion?.startday ? formatDate(promotion.startday) : null}</td>
                                            <td>{promotion?.endday ? formatDate(promotion.endday) : null}</td>
                                            <td>{promotion?.discount}%</td>
                                            <td>{promotion?.note}</td>
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
            {showModalEdit && <ModalEditPromotion promotion={selectedPromotion} handleShowModalEdit={handleShowModalEdit} deletePromotion={deletePromotion} />}
            {showModal && (
                <div className="modal">
                    <div className="modal-main">
                        <form className="add-promotion-form">
                            <div>
                                <label htmlFor="name">Tên chương trình:</label>
                                <input type="text" id="name" name="name" value={promotionFields.name} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="startday">Ngày bắt đầu:</label>
                                <input type="date" id="startday" name="startday" value={promotionFields.startday} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="endday">Ngày kết thúc:</label>
                                <input type="date" id="endday" name="endday" value={promotionFields.endday} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="discount">Phần trăm (%):</label>
                                <input type="number" id="discount" name="discount" value={promotionFields.discount} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="note">Ghi chú:</label>
                                <input type="text" id="note" name="note" value={promotionFields.note} onChange={handleChange} />
                            </div>
                            <button type='button' onClick={createPromotion}>Lưu</button>
                            <button onClick={() => setShowModal(false)}>Đóng</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Promotion;
