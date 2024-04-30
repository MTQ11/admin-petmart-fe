import React, { useState, useEffect } from 'react';
import './receipt.css'
import { MdEdit } from 'react-icons/md';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faFilter, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import formatDate from '../../utils/FormartDate';
import ModalEditReceipt from './modalEditReceipt';
import ModalNewReceipt from './modalNewReceipt';
import Pagination from '../../component/pagination/pagination';
import formatCurrency from '../../utils/formatCurrency';
import formatPhone from '../../utils/formatPhoneNumber';
import baseURL from '../../utils/api';

const Receipt = () => {
    const [loading, setLoading] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selected, setSelected] = useState(null);
    const [updated, setUpdated] = useState(false);
    const [showModalNew, setShowModalNew] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState({
        lable: '',
        key: ''
    });
    const [sort, setSort] = useState({
        lable: '',
        key: ''
    });

    const [pageSize, setPageSize] = useState(5); // Số sản phẩm trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const [totalItems, setTotalItems] = useState(0); // Tổng số sản phẩm

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, searchTerm, sort, filter, updated]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let url = `${baseURL}/receipt/get-all-receipt?limit=${pageSize}&page=${currentPage - 1}&keysearch=${searchTerm}`;

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
            const url = `${baseURL}/receipt/cancel-receipt/${id}`;

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
                                <th>Mã phiếu nhập
                                <FontAwesomeIcon icon={faSearch} style={{ marginLeft: '5px' }} />
                                </th>
                                <th>Nhà cung cấp</th>
                                <th>Địa chỉ</th>
                                <th>SĐT</th>
                                <th>Thanh toán
                                <FontAwesomeIcon icon={faSort} style={{ marginLeft: '5px' }} />
                                    <select className='select-table' value={sort.key} onChange={(e) => handleSort(e, 'totalPrice')}>
                                        <option value='asc'>Tăng</option>
                                        <option value='desc'>Giảm</option>
                                    </select>
                                </th>
                                <th>Thời gian
                                    <FontAwesomeIcon icon={faSort} style={{ marginLeft: '5px' }} />
                                    <select className='select-table' value={sort.key} onChange={(e) => handleSort(e, 'receivedAt')}>
                                        <option value='asc'>Cũ nhất</option>
                                        <option value='desc'>Mới nhất</option>
                                    </select>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipts?.map(receipt => (
                                <tr key={receipt._id} onDoubleClick={() => handleEditClick(receipt)} >
                                    <td>{receipt?._id}</td>
                                    <td>{receipt?.receivedFrom.fullName}</td>
                                    <td>{receipt?.receivedFrom.address}</td>
                                    <td>{formatPhone(receipt?.receivedFrom.phone)}</td>
                                    <td>{formatCurrency(receipt?.totalPrice)}</td>
                                    <td>{receipt?.receivedAt ? formatDate(receipt.receivedAt) : null}</td>
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
