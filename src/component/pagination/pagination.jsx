import React from 'react';
import './pagination.css'

const Pagination = ({ pageSize, setPageSize, currentPage, setCurrentPage, totalPages }) => {
    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value)); // Chuyển đổi giá trị thành số nguyên
        setCurrentPage(1); // Reset trang hiện tại về 1 khi thay đổi số lượng sản phẩm mỗi trang
    };

    return (
        <div className="pagination">
            <select value={pageSize} onChange={handlePageSizeChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={500}>500</option>
            </select>
            <button onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))} disabled={currentPage === 1}>Trang trước</button>
            <span>Trang {currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))} disabled={currentPage === totalPages}>Trang sau</button>
        </div>
    );
};

export default Pagination;
