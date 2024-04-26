import React, { useEffect, useState } from 'react';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import './modalNewReceipt.css'
import axios from 'axios';
import decodeToken from '../../utils/DecodeToken';

const ModalNewReceipt = ({ handleShowModalNew }) => {
    const [newReceiptFormData, setNewReceiptFormData] = useState({
        receiptItems: [
            {
                name: '',
                unit: '',
                type: '',
                image: '',
                amount: 0,
                price: 0,
                product: null,
                isNewProduct: true
            }
        ],
        receivedFrom: {
            fullName: '',
            address: '',
            phone: '',
            note: ''
        },
        receivedBy: ''
    });
    const [products, setProducts] = useState([])
    const [type, setType] = useState([])
    const [selectedType, setSelectedType] = useState([]); // State lưu trữ loại sản phẩm được chọn
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [updated, setUpdated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchProducts()
        fetchTypeProducts()

        if (token) {
            const decoded = decodeToken(token);
            setNewReceiptFormData(prevState => ({
                ...prevState,
                receivedBy: decoded.id
            }));
        }
    }, [updated]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/product/get-product');
            setProducts(response.data.data); // Lưu danh sách sản phẩm vào state
            setFilteredProducts(response.data.data)
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchTypeProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/type-product/get-type-product');
            setType(response.data.data)
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const searchProduct = (productName) => {
        return products.find(product => product.name === productName || product._id === productName);
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        if (name.startsWith('receiptItem')) {
            const updatedReceiptItems = [...newReceiptFormData.receiptItems];
            const itemKey = name.split('-')[2];
            updatedReceiptItems[index][itemKey] = value;
            if (itemKey === 'name') {
                const product = searchProduct(value);
                if (product) {
                    const existingIndex = newReceiptFormData.receiptItems.findIndex(item => item.product === product._id);
                    if (existingIndex !== -1 && existingIndex !== index) {
                        alert('Sản phẩm đã có trong danh sách!');
                        return;
                    }
                    updatedReceiptItems[index].product = product._id;
                    updatedReceiptItems[index].type = product.type;
                    updatedReceiptItems[index].unit = product.unit;
                    updatedReceiptItems[index].amount = product.amount;
                    updatedReceiptItems[index].price = product.costPrice;
                    updatedReceiptItems[index].isNewProduct = false
                } else {
                    updatedReceiptItems[index].product = null;
                    updatedReceiptItems[index].type = "";
                    updatedReceiptItems[index].unit = "";
                    updatedReceiptItems[index].amount = 0;
                    updatedReceiptItems[index].price = 0;
                    updatedReceiptItems[index].isNewProduct = true
                }
                setNewReceiptFormData(prevState => ({
                    ...prevState,
                    receiptItems: updatedReceiptItems
                }));
            }
            else if (itemKey === 'product') {
                const product = searchProduct(value);
                if (product) {
                    const existingIndex = newReceiptFormData.receiptItems.findIndex(item => item.product === product._id);
                    if (existingIndex !== -1 && existingIndex !== index) {
                        alert('Sản phẩm đã có trong danh sách!');
                        return;
                    }
                    updatedReceiptItems[index].name = product.name;
                    updatedReceiptItems[index].type = product.type;
                    updatedReceiptItems[index].unit = product.unit;
                    updatedReceiptItems[index].amount = product.amount;
                    updatedReceiptItems[index].price = product.costPrice;
                    updatedReceiptItems[index].isNewProduct = false
                } else {
                    updatedReceiptItems[index].name = "";
                    updatedReceiptItems[index].type = "";
                    updatedReceiptItems[index].unit = "";
                    updatedReceiptItems[index].amount = 0;
                    updatedReceiptItems[index].price = 0;
                    updatedReceiptItems[index].isNewProduct = true
                }
                setNewReceiptFormData(prevState => ({
                    ...prevState,
                    receiptItems: updatedReceiptItems
                }));
            }
            else {
                const field = name.split('-')[1];
                setNewReceiptFormData(prevState => ({
                    ...prevState,
                    [field]: value
                }));
            }

        } else if (name.startsWith('receivedFrom')) {
            const field = name.split('-')[1];
            setNewReceiptFormData(prevState => ({
                ...prevState,
                receivedFrom: {
                    ...prevState.receivedFrom,
                    [field]: value
                }
            }));
        } else {
            const field = name.split('-')[1];
            setNewReceiptFormData(prevState => ({
                ...prevState,
                [field]: value
            }));
        }
    };

    const addRow = () => {
        setNewReceiptFormData(prevState => ({
            ...prevState,
            receiptItems: [
                ...prevState.receiptItems,
                {
                    name: '',
                    unit: '',
                    type: '',
                    image: '',
                    amount: 0,
                    price: 0,
                    product: null,
                    isNewProduct: true
                }
            ]
        }));
    };

    const removeRow = (index) => {
        setNewReceiptFormData(prevState => ({
            ...prevState,
            receiptItems: prevState.receiptItems.filter((item, i) => i !== index)
        }));
    };

    const createReceipt = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3001/receipt/create', newReceiptFormData, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': `bearer ${token}`
                }
            });
            setUpdated(!updated);
            handleShowModalNew()
        } catch (error) {
            console.error('Error creating receipt:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createReceipt();
    };

    const handleProductSelection = (selectedProduct) => {
        const existingIndex = newReceiptFormData.receiptItems.findIndex(item => item.product === selectedProduct._id);

        if (existingIndex !== -1) {
            alert('Sản phẩm đã có trong danh sách!');
            return;
        }

        const emptyIndex = newReceiptFormData.receiptItems.findIndex(item => item.name === '');

        if (emptyIndex !== -1) {
            const updatedReceiptItems = [...newReceiptFormData.receiptItems];
            updatedReceiptItems[emptyIndex] = {
                name: selectedProduct.name,
                type: selectedProduct.type,
                unit: selectedProduct.unit,
                amount: selectedProduct.amount,
                price: selectedProduct.costPrice,
                product: selectedProduct._id,
                isNewProduct: false
            };
            setNewReceiptFormData(prevState => ({
                ...prevState,
                receiptItems: updatedReceiptItems
            }));
        } else {
            const newReceiptItem = {
                name: selectedProduct.name,
                type: selectedProduct.type,
                unit: selectedProduct.unit,
                amount: selectedProduct.amount,
                price: selectedProduct.costPrice,
                product: selectedProduct._id,
                isNewProduct: false
            };
            const updatedReceiptItems = [...newReceiptFormData.receiptItems, newReceiptItem];
            setNewReceiptFormData(prevState => ({
                ...prevState,
                receiptItems: updatedReceiptItems
            }));
        }
    };


    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
        const term = e.target.value.toLowerCase();
        const filtered = products.filter(product => product.name.toLowerCase().includes(term));
        setFilteredProducts(filtered);
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value)
        const term = searchTerm.toLowerCase(); // Lấy giá trị từ ô tìm kiếm và chuyển về chữ thường
        let filtered = products.filter(product => {
            return (
                product.name.toLowerCase().includes(term) &&
                (!e.target.value || product.type === e.target.value)
            );
        });

        setFilteredProducts(filtered);
    };

    return (
        <div className="modal">
            <div className="modal-main-reciep">
                <form className="add-receipt-form" onSubmit={handleSubmit}>
                    <div className='modal-header'>
                        <div className='modal-info'>
                            <div>
                                <label htmlFor="fullName">Tên nhà cung cấp:</label>
                                <input type="text" id="fullName" name="receivedFrom-fullName" value={newReceiptFormData.receivedFrom.fullName} onChange={handleChange} required />
                            </div>
                            <div>
                                <label htmlFor="address">Địa chỉ:</label>
                                <input type="text" id="address" name="receivedFrom-address" value={newReceiptFormData.receivedFrom.address} onChange={handleChange} required />
                            </div>
                            <div>
                                <label htmlFor="phone">Số điện thoại:</label>
                                <input type="text" id="phone" name="receivedFrom-phone" value={newReceiptFormData.receivedFrom.phone} onChange={handleChange} required />
                            </div>
                            <div>
                                <label htmlFor="note">Ghi chú:</label>
                                <textarea id="note" name="receivedFrom-note" value={newReceiptFormData.receivedFrom.note} onChange={handleChange}></textarea>
                            </div>
                        </div>
                        <div>
                            <input
                                className='input-list-product'
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={handleSearchInputChange}
                            />
                            <select
                                className='input-list-product'
                                value={selectedType}
                                onChange={handleTypeChange}
                            >
                                <option value="">Tất cả loại sản phẩm</option>
                                {type.map((type, index) => (
                                    <option key={index} value={type._id}>{type.name}</option>
                                ))}
                            </select>
                            <div className='modal-list-product'>
                                {filteredProducts.map(product => (
                                    <div key={product._id} className="product-item" onClick={() => handleProductSelection(product)}>
                                        <img src={product.image} alt={product.name} />
                                        <p>{product.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                    <div className='modal-info-product'>
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Mã sản phẩm</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Nhóm sản phẩm</th>
                                    <th>Đơn vị</th>
                                    <th>Số lượng</th>
                                    <th>Giá nhập</th>
                                    <th>
                                        <button type="button" onClick={addRow}>Thêm hàng</button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {newReceiptFormData.receiptItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <span>{item.isNewProduct ? "Mới" : ""}</span>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name={`receiptItem-${index}-product`}
                                                value={item.product ? item.product : ''}
                                                onChange={(e) => handleChange(e, index)}
                                                placeholder='Tìm mã sản phẩm...'
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name={`receiptItem-${index}-name`}
                                                value={item.name}
                                                onChange={(e) => handleChange(e, index)}
                                                placeholder='Tìm tên sản phẩm...'
                                            />
                                        </td>

                                        <td>
                                            <input type="text" name={`receiptItem-${index}-type`} value={item.type} onChange={(e) => handleChange(e, index)} />
                                        </td>
                                        <td>
                                            <input type="text" name={`receiptItem-${index}-unit`} value={item.unit} onChange={(e) => handleChange(e, index)} />
                                        </td>
                                        <td>
                                            <input type="number" name={`receiptItem-${index}-amount`} value={item.amount} onChange={(e) => handleChange(e, index)} />
                                        </td>
                                        <td>
                                            <input type="text" name={`receiptItem-${index}-price`} value={item.price} onChange={(e) => handleChange(e, index)} />
                                        </td>
                                        <td>
                                            <button type="button" onClick={() => removeRow(index)}>x</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='modal-button'>
                        <button type="submit">Xác nhận</button>
                        <button type="button" onClick={handleShowModalNew}>Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalNewReceipt;
