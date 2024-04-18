import React, { useEffect, useState } from 'react';
import './product.css';
import { MdEdit } from "react-icons/md";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import ModalEditProduct from './modalEditProduct';
import Pagination from '../../component/pagination/pagination';


const Product = () => {
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading
    const [products, setProducts] = useState([]);
    const [promotionData, setPromotionData] = useState([]);
    const [typeProductData, setTypeProductData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false)
    const [selected, setSelected] = useState(null)
    const [updated, setUpdated] = useState(false);
    const [avatar, setAvatar] = useState(null);

    const [pageSize, setPageSize] = useState(5); // Số sản phẩm trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // Tổng số trang
    const [totalItems, setTotalItems] = useState(0); // Tổng số sản phẩm

    const [datatFields, setDataFields] = useState({
        avatar: '',
        name: '',
        image: '',
        type: '',
        countInStock: 0,
        unit: '',
        price: 0,
        costPrice: 0,
        status: 'available',
        note: ''
    });

    const resetData = () => {
        setAvatar(null)
        setDataFields({
            avatar: '',
            name: '',
            image: '',
            type: '',
            countInStock: 0,
            unit: '',
            price: 0,
            costPrice: 0,
            status: 'available',
            note: ''
        })
    }

    useEffect(() => {
        fetchData();
        fetchDataPromotion()
        fetchDataTypeProduct()
    }, [currentPage, pageSize,searchTerm, updated]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/product/get-product?limit=${pageSize}&page=${currentPage - 1}&keysearch=${searchTerm}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data.data);
            setTotalItems(data.total);
            setTotalPages(data.totalPage); // Tính tổng số trang
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false); // Kết thúc loading dù có lỗi hay không
        }
    };

    const fetchDataPromotion = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:3001/promotion/get-promotion`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `beare ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch promotion');
            }
            const data = await response.json();
            setPromotionData(data.data);
        } catch (error) {
            console.error('Error fetching promotion:', error);
        } finally {
            setLoading(false); // Kết thúc loading dù có lỗi hay không
        }
    };

    const fetchDataTypeProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/type-product/get-type-product`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch type product');
            }
            const data = await response.json();
            setTypeProductData(data.data);
        } catch (error) {
            console.error('Error fetching type product:', error);
        } finally {
            setLoading(false); // Kết thúc loading dù có lỗi hay không
        }
    };

    const createProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            const newProduct = {
                name: datatFields.name,
                image: datatFields.avatar,
                type: datatFields.type,
                countInStock: datatFields.countInStock,
                unit: datatFields.unit,
                price: datatFields.price,
                costPrice: datatFields.costPrice,
                status: datatFields.status,
                note: datatFields.note,
                promotion: datatFields.promotion
            };
            console.log(newProduct)

            const response = await fetch('http://localhost:3001/product/create-product', {
                method: 'POST', // Sử dụng method POST thay vì GET
                headers: {
                    'Content-Type': 'application/json',
                    'token': `bearer ${token}` // Điều chỉnh 'beare' thành 'bearer'
                },
                body: JSON.stringify(newProduct)
            });
            if (!response.ok) {
                alert("Tạo không thành công sản phẩm")
                throw new Error('Failed to add sản phẩm');
            }
            setUpdated(!updated);
            setShowModal(false);
            resetData()
        } catch (error) {
            console.error('Error adding sản phẩm:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'avatar') {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setAvatar(reader.result);
                setDataFields({ ...datatFields, [name]: reader.result });
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        } else {
            setDataFields({ ...datatFields, [name]: value });
        }
    };
    

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };    

    const handleShowModalEdit = () => {
        setShowModalEdit(false);
        setUpdated(!updated);
    };

    const handleEditClick = (product) => {
        setSelected(product); // Set the product being edited
        setShowModalEdit(!showModalEdit); // Show the profile
    };

    const deleteProduct = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:3001/product/delete/${id}`;

            const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
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
                throw new Error('Failed to delete product');
            }

            setUpdated(!updated);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
        handleShowModalEdit()
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetData()
    };

    return (
        <div className="product-container">
            <div className="product-actions">
                <input id='search-input' type="text" placeholder="Tìm kiếm..." value={searchTerm} onChange={handleSearch} />
                <button onClick={() => setShowModal(true)}>Tạo sản phẩm</button>
            </div>
            {loading ? ( // Hiển thị loading khi đang fetching
                <div>
                    <FontAwesomeIcon icon={faSpinner} spin /> {/* Biểu tượng xoay tròn */}
                </div>
            ) : (
                <>
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Sản phẩm</th>
                                <th>Loại</th>
                                <th>Trong kho</th>
                                <th>Đã bán</th>
                                <th>Đơn vị</th>
                                <th>Giá bán</th>
                                <th>Giá nhập</th>
                                <th>Trạng thái</th>
                                <th>CCKM</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products?.map(product => (
                                    <tr key={product.id}>
                                        <td><img src={product?.image} alt={product.name} /></td>
                                        <td>{product?.name}</td>
                                        <td>{typeProductData.find(item => item._id === product?.type)?.name || ""}</td>
                                        <td>{product?.countInStock}</td>
                                        <td>{product?.selled}</td>
                                        <td>{product?.unit}</td>
                                        <td>{product?.price}</td>
                                        <td>{product?.costPrice}</td>
                                        <td>{product?.status}</td>
                                        <td>{promotionData.find(item => item._id === product?.promotion)?.name || ""}</td>
                                        <td>
                                            <MdEdit style={{ width: '30px', height: '30px' }} onClick={() => handleEditClick(product)} />
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
            {showModalEdit && <ModalEditProduct product={selected} handleShowModalEdit={(handleShowModalEdit)} deleteProduct={(deleteProduct)} promotionData={promotionData} typeProductData={typeProductData} />}
            {showModal && (
                <div className="modal">
                    <div className="modal-main">
                        <form className="add-product-form">
                            <div>
                                <input
                                    id='avatar'
                                    name="avatar"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleChange}
                                />
                                <img className='avatar' src={avatar || datatFields.avatar} alt="Avatar" onClick={() => document.querySelector('#avatar').click()} />
                            </div>
                            <div>
                                <label htmlFor="name">Tên sản phẩm:</label>
                                <input type="text" id="name" name="name" value={datatFields.name} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="type">Nhóm sản phẩm:</label>
                                <select id="type" name="type" value={datatFields.type} onChange={handleChange}>
                                    <option>Chọn danh mục</option>
                                    {typeProductData.map((type, index) => (
                                        <option key={index} value={type._id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="countInStock">Tồn kho:</label>
                                <input type="number" id="countInStock" name="countInStock" value={datatFields.countInStock} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="unit">Đơn vị:</label>
                                <input type="text" id="unit" name="unit" value={datatFields.unit} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="price">Giá bán:</label>
                                <input type="number" id="price" name="price" value={datatFields.price} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="costPrice">Giá nhập:</label>
                                <input type="number" id="costPrice" name="costPrice" value={datatFields.costPrice} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="promotion">Khuyến mãi:</label>
                                <select id="promotion" name="promotion" value={datatFields.promotion} onChange={handleChange}>
                                    <option>Áp dụng chương trình khuyến mãi</option>
                                    {promotionData.map((promotion, index) => (
                                        <option key={index} value={promotion._id}>{promotion.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div class="button-container">
                                <button type='button' onClick={createProduct}>Xác nhận</button>
                                <button onClick={handleCloseModal}>Đóng</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Product;
