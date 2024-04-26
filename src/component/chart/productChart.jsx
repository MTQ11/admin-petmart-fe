import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import Chart from 'chart.js/auto';
import baseURL from "../../utils/api";

const ProductChart = () => {
    const chartRef = useRef(null);
    const [mostSoldProduct, setMostSoldProduct] = useState(null);
    const [productData, setProductData] = useState(null);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        const fetchProductReport = async () => {
            try {
                const response = await axios.get(`${baseURL}/report/report-product`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `bearer ${localStorage.getItem('token')}`
                    }
                });
                setProductData(response.data);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchProductReport();
    }, []);

    useEffect(() => {
        if (productData) {
            // Tìm loại sản phẩm bán chạy nhất
            const mostSold = productData.reduce((prev, current) => (prev.totalSelled > current.totalSelled) ? prev : current);
            setMostSoldProduct(mostSold);
        }
    }, [productData]);

    useEffect(() => {
        if (chartInstance) {
            chartInstance.destroy(); // Huỷ bỏ biểu đồ cũ trước khi tạo biểu đồ mới
        }
        if (mostSoldProduct) {
            createChart();
        }
    }, [mostSoldProduct]);

    const createChart = () => {
        const ctx = chartRef.current.getContext('2d');
        const newChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: productData.map(product => product.type),
                datasets: [{
                    label: 'Sản phẩm bán chạy nhất',
                    data: productData.map(product => product.totalSelled),
                    backgroundColor: '#28a745',
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        setChartInstance(newChartInstance);
    };

    return (
        <div className="chart-container">
            <h3>Thống kê sản phẩm bán chạy nhất</h3>
            <div className="chart" style={{ width: '95%', height: 'auto' }}>
                <canvas ref={chartRef} />
            </div>
        </div>
    );
};

export default ProductChart;
