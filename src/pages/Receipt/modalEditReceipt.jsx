import React, { useState } from 'react';
import formatDate from '../../utils/FormartDate';
import './modalEditReceipt.css'; // Đảm bảo import file CSS của modalEditReceipt
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import formatPhone from '../../utils/formatPhoneNumber';
import formatCurrency from '../../utils/formatCurrency';

const ModalEditReceipt = ({ receipt, handleShowModalEdit, deleteReceipt }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedReceipt, setEditedReceipt] = useState({
        id: receipt?._id,
        receivedFrom: {
            fullName: receipt?.receivedFrom.fullName,
            address: receipt?.receivedFrom.address,
            phone: receipt?.receivedFrom.phone,
            note: receipt?.receivedFrom.note
        },
        receiptItems: receipt?.receiptItems.map(item => ({
            product: item.product,
            name: item.name,
            unit: item.unit,
            type: item.type,
            image: item.image,
            amount: item.amount,
            price: item.price,
            isNewProduct: item.isNewProduct
        })),
        receivedBy: receipt?.receivedBy,
        receivedAt: receipt?.receivedAt
    });

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setEditedReceipt(prevState => ({
    //         ...prevState,
    //         receivedFrom: {
    //             ...prevState.receivedFrom,
    //             [name]: value
    //         }
    //     }));
    // };

    // const saveChanges = async () => {
    //     try {
    //         const response = await axios.put(`${baseURL}/receipt/update-receipt/${editedReceipt.id}`, editedReceipt);
    //         console.log(response);
    //         handleShowModalEdit();
    //     } catch (error) {
    //         console.error('Error updating receipt:', error);
    //     }
    // };

    let totalReceiptPrice = 0;
    const receiptItemsWithTotalPrice = editedReceipt.receiptItems.map((item, index) => {
        const totalPrice = item.price * item.amount;
        totalReceiptPrice += totalPrice;
        return {
            ...item,
            totalPrice
        };
    });

    const handleExportToExcel = () => {
        const data = [
            ['Thông tin người gửi:', editedReceipt.receivedFrom.fullName],
            ['Địa chỉ:', editedReceipt.receivedFrom.address],
            ['SĐT:', '0'+editedReceipt.receivedFrom.phone],
            ['Người nhận:', editedReceipt.receivedBy],
            ['Thời gian nhận:', editedReceipt.receivedAt ? formatDate(editedReceipt.receivedAt) : ''],
            ['Ghi chú:', editedReceipt.receivedFrom.note],
            ['', '', '', '', ''], // Dòng trống để phân cách giữa thông tin và chi tiết sản phẩm
            ['Tên sản phẩm', 'Đơn vị', 'Đơn giá', 'Số lượng', 'Tổng giá'],
            ...editedReceipt.receiptItems.map(item => [item.name, item.unit, item.price, item.amount, item.price * item.amount]),
            ['Tổng tiền phiếu nhập', '', '', '', totalReceiptPrice]
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Receipt Details');
        
        XLSX.writeFile(wb, 'receipt_details.xlsx');
    };


    return (
        <div className='receipt-main'>
            <div className="receipt-details">
                <FontAwesomeIcon className="close-modal" icon={faClose} onClick={handleShowModalEdit}/>
                <div className='receipt-details-received-info'>
                    <div>
                        <div><strong>Người gửi:</strong> <div className="fullName">{editedReceipt.receivedFrom.fullName}</div></div>
                        <div><strong>Địa chỉ:</strong> <div className="address">{editedReceipt.receivedFrom.address}</div></div>
                        <div><strong>SĐT:</strong> <div className="phone">{ formatPhone(editedReceipt.receivedFrom.phone) }</div></div>
                    </div>
                    <div>
                        <div><strong>Thời gian nhận:</strong> <div className="receivedAt">{editedReceipt.receivedAt ? formatDate(editedReceipt.receivedAt) : null}</div></div>
                        <div><strong>Ghi chú:</strong> <div className="note">{editedReceipt.receivedFrom.note}</div></div>
                    </div>
                </div>
                <div className="receipt-details-receipt-items">
                    <table id="receipt-details-table">
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Đơn vị</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Tổng giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editedReceipt.receiptItems.map((item, index) => (
                                <tr key={index} className="receipt-item">
                                    <td>{item.name}</td>
                                    <td>{item.unit}</td>
                                    <td>{ formatCurrency(item.price) }</td>
                                    <td>{item.amount}</td>
                                    <td>{ formatCurrency(item.price * item.amount)}</td>
                                </tr>
                            ))}
                            <tr> {/* Dòng cuối cùng để hiển thị tổng tiền phiếu nhập */}
                                <td colSpan="4"><b>Tổng tiền phiếu nhập</b></td>
                                <td>{formatCurrency(totalReceiptPrice)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="modalreceipt-actions">
                    <button className="button-export-excel" onClick={handleExportToExcel}>Xuất Excel</button>
                    <button className="button-delete-receipt" onClick={() => deleteReceipt(editedReceipt.id)}>Hủy phiếu nhập</button>
                </div>
            </div>
        </div>
    );
};

export default ModalEditReceipt;
