import React, { useState } from 'react';
import './modalEditProduct.css';
import formatDate from '../../utils/FormartDate';
import axios from 'axios';

const ModalEditProduct = ({ product, handleShowModalEdit, deleteProduct, promotionData, typeProductData }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedProduct, setEditedProduct] = useState({
        id: product?._id,
        name: product?.name,
        image: product?.image,
        type: product?.type,
        countInStock: product?.countInStock,
        unit: product?.unit,
        price: product?.price,
        costPrice: product?.costPrice,
        selled: product?.selled,
        status: product?.status,
        note: product?.note,
        promotion: product?.promotion
    });
    const [newImage, setNewImage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage(reader.result);
                setEditedProduct(prevState => ({
                    ...prevState
                }));
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        } else {
            setEditedProduct(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };


    const saveChanges = async () => {
        try {
            let editedProductToSend = { ...editedProduct }
            if (editedProductToSend.promotion === null || editedProductToSend.promotion === undefined || editedProductToSend.promotion === "Không") {
                editedProductToSend.promotion = null;
            }

            const response = await axios.put(`http://localhost:3001/product/update-product/${editedProductToSend.id}`, editedProductToSend);
            handleShowModalEdit();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };
    return (
        <div className='product-main'>
            <div className="product-profile">
                <div className="image">
                    <input
                        name="image"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleInputChange}
                    />
                    <img src={newImage || editedProduct.image} alt="Image" onClick={() => document.querySelector('.image input[type="file"]').click()} />
                </div>
                <div className="product-details">
                    <div><strong>Tên sản phẩm:</strong> <input type="text" name="name" value={editedProduct.name} onChange={handleInputChange} /></div>
                    <div><strong>Nhóm sản phẩm</strong>
                        <select id="type" name="type" value={editedProduct.type} onChange={handleInputChange}>
                            <option value={null}></option>
                            {typeProductData.map((type, index) => (
                                <option key={index} value={type._id}>{type.name}</option>
                            ))}
                        </select>
                    </div>
                    <div><strong>Đơn vị</strong> <input type="text" name="unit" value={editedProduct.unit} onChange={handleInputChange} /></div>
                    <div><strong>Giá nhập</strong> <input type="text" name="costPrice" value={editedProduct.costPrice} onChange={handleInputChange} /></div>
                    <div><strong>Giá bán</strong> <input type="text" name="price" value={editedProduct.price} onChange={handleInputChange} /></div>
                    <div>
                        <strong>Trạng thái</strong>
                        <select name="status" id="status" value={editedProduct.status} onChange={handleInputChange}>
                            <option value="available">Có sẵn</option>
                            <option value="out of stock">Hết hàng</option>
                        </select>
                    </div>
                    <div><strong>Mô tả</strong> <input type="text" name="note" value={editedProduct.note} onChange={handleInputChange} /></div>
                    <div>
                        <strong>Khuyến mãi</strong>
                        <select id="promotion" name="promotion" value={editedProduct.promotion} onChange={handleInputChange}>
                            <option value={null}>Không</option>
                            {promotionData.map((promotion, index) => (
                                <option key={index} value={promotion._id}>{promotion.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="product-actions">
                    <button onClick={() => setEditMode(!editMode)}>{editMode ? 'Hủy' : 'Chỉnh sửa'}</button>
                    {editMode && <button onClick={saveChanges}>Lưu</button>}
                    <button onClick={handleShowModalEdit}>Đóng</button>
                </div>
                <button className='button-delete' onClick={() => deleteProduct(editedProduct.id)}>Xóa</button>
            </div>
        </div>
    );
};

export default ModalEditProduct;
