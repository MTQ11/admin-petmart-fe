import React, { useState, useEffect } from 'react';
import './typeproduct.css'; // Import CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faAdd } from '@fortawesome/free-solid-svg-icons';
import baseURL from '../../utils/api';

const TypeProduct = () => {
    const [productTypes, setProductTypes] = useState([]);
    const [newProductTypeName, setNewProductTypeName] = useState('');
    const [editingProductId, setEditingProductId] = useState(null);
    const [editedProductName, setEditedProductName] = useState('');

    useEffect(() => {
        fetchProductTypes();
    }, []);

    const fetchProductTypes = async () => {
        try {
            const response = await fetch(`${baseURL}/type-product/get-type-product`);
            const data = await response.json();
            setProductTypes(data.data);
        } catch (error) {
            console.error('Error fetching product types:', error);
        }
    };

    const addProductType = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${baseURL}/type-product/create`, {
                method: 'POST',
                body: JSON.stringify({ name: newProductTypeName }),
                headers: {
                    'Content-Type': 'application/json',
                    'token': `bearer ${token}`
                }
            });
            fetchProductTypes();
            setNewProductTypeName('');
        } catch (error) {
            console.error('Error adding product type:', error);
        }
    };

    const updateProductTypeName = async (id, newName) => {
        try {
            const confirmUpdate = window.confirm("Are you sure you want to update this product type?");
            if (confirmUpdate) {
                const token = localStorage.getItem('token');
                await fetch(`${baseURL}/type-product/update/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ name: newName }),
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `bearer ${token}`
                    }
                });
                fetchProductTypes();
            }
        } catch (error) {
            console.error('Error editing product type:', error);
        }
    };


    const deleteProductType = async (id) => {
        try {
            const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa nhóm sản phẩm này?");
            if (confirmDelete) {
                const token = localStorage.getItem('token');
                await fetch(`${baseURL}/type-product/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `bearer ${token}`
                    }
                });
                fetchProductTypes();
            }
        } catch (error) {
            console.error('Error deleting product type:', error);
        }
    };


    const handleProductNameChange = (e) => {
        setEditedProductName(e.target.value);
    };

    return (
        <div className="type-product-container">
            <table className="product-type-table">
                <thead>
                    <tr>
                        <th>Mã danh mục</th>
                        <th>Danh mục</th>
                        <th>Số lượng</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <input
                                type="text"
                                className="product-type-name-input"
                                value={newProductTypeName}
                                onChange={(e) => setNewProductTypeName(e.target.value)}
                                placeholder="Danh mục mới..."
                            />
                        </td>
                        <td></td>
                        <td>
                            <button className="add-btn" onClick={addProductType}> <FontAwesomeIcon size="lg" icon={faAdd}/></button>
                        </td>
                    </tr>
                    {productTypes.map((item) => (
                        <tr key={item._id}>
                            <td>{item._id}</td>
                            <td>
                                <input
                                    type="text"
                                    className="product-type-name-input"
                                    value={editingProductId === item._id ? editedProductName : item.name}
                                    onChange={handleProductNameChange}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            if (editedProductName !== item.name) {
                                                updateProductTypeName(item._id, editedProductName);
                                            }
                                            setEditingProductId(null);
                                        }
                                    }}
                                    onBlur={()=>setEditingProductId(null)}
                                    onFocus={() => {
                                        setEditingProductId(item._id)
                                        setEditedProductName('')
                                    }}
                                />
                            </td>
                            <td><b className='product-count'>{item.productCount}</b></td>
                            <td>
                                <FontAwesomeIcon size="lg" icon={faTrash} onClick={() => deleteProductType(item._id)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TypeProduct;
