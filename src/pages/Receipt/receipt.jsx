import React, { useState, useEffect } from 'react';
import './receipt.css'
import { MdEdit } from 'react-icons/md';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import formatDate from '../../utils/FormartDate';
import ModalEditReceipt from './modalEditReceipt';
import ModalNewReceipt from './modalNewReceipt';
import Pagination from '../../component/pagination/pagination';

const Receipt = () => {
    const [loading, setLoading] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updated, setUpdated] = useState(false);
    const [showModalNew, setShowModalNew] = useState(false);

    const [pageSize, setPageSize] = useState(5); // Số sản phẩm trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const [totalItems, setTotalItems] = useState(0); // Tổng số sản phẩm

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, updated]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/receipt/get-all-receipt?limit=${pageSize}&page=${currentPage - 1}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch receipts');
            }
            const data = await response.json();
            setReceipts(data.data);
            setTotalItems(data.total);
            setTotalPages(data.totalPage); // Tính tổng số trang
        } catch (error) {
            console.error('Error fetching receipts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredReceipts = receipts?.filter(receipt =>
        receipt.receiptItems.some(item =>
            item.name?.toLowerCase().includes(searchTerm?.toLowerCase())
        )
    );

    const handleShowModalEdit = () => {
        setShowModalEdit(false);
        setUpdated(!updated);
    };

    const handleShowModalNew = () => {
        setShowModalNew(false);
        setUpdated(!updated);
    };

    const handleEditClick = (receipt) => {
        setSelected(receipt);
        setShowModalEdit(!showModalEdit);
    };

    const deleteReceipt = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:3001/receipt/cancel-receipt/${id}`;

            const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phiếu nhập?");
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
                throw new Error('Failed to delete receipt');
            }

            setUpdated(!updated);
        } catch (error) {
            console.error('Error deleting receipt:', error);
        }
        handleShowModalEdit();
    };

    return (
        <div className="receipt-container">
            <div className="receipt-actions">
                <input id='search-input' type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={handleSearch} />
                <button className='button-add-receipt' onClick={() => setShowModalNew(true)}>Tạo phiếu nhập</button>
            </div>
            {loading ? (
                <div>
                    <FontAwesomeIcon icon={faSpinner} spin />
                </div>
            ) : (
                <>
                    <table className="receipt-table">
                        <thead>
                            <tr>
                                <th>Mã</th>
                                <th>Thanh toán</th>
                                <th>Nhà cung cấp</th>
                                <th>Địa chỉ</th>
                                <th>SĐT</th>
                                <th>Thời gian nhận</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipts?.map(receipt => (
                                <tr key={receipt._id}>
                                    <td>{receipt?._id}</td>
                                    <td>{receipt?.totalPrice}</td>
                                    <td>{receipt?.receivedFrom.fullName}</td>
                                    <td>{receipt?.receivedFrom.address}</td>
                                    <td>0{receipt?.receivedFrom.phone}</td>
                                    <td>{receipt?.receivedAt ? formatDate(receipt.receivedAt) : null}</td>
                                    <td>
                                        <MdEdit style={{ width: '30px', height: '30px' }} onClick={() => handleEditClick(receipt)} />
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

            {showModalNew && <ModalNewReceipt handleShowModalNew={handleShowModalNew} />}

            {showModalEdit && <ModalEditReceipt receipt={selected} handleShowModalEdit={handleShowModalEdit} deleteReceipt={deleteReceipt} />}
        </div>
    );
}

export default Receipt;
