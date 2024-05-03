import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import baseURL from '../../utils/api';
import decodeToken from '../../utils/DecodeToken';

const RevenueChart = ({ setTotalRevenue, setTotalOrder }) => {
    const chartRef = useRef(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [chartInstance, setChartInstance] = useState(null); // Lưu trữ đối tượng biểu đồ hiện tại


    useEffect(() => {
        handleLineChart();
    }, [selectedYear]);
    
    const handleLineChart = async () => {
        try {
            if (chartInstance) {
                chartInstance.destroy();
            }
    
            const token = localStorage.getItem('token');
            const {role} = decodeToken(token); // Assuming you have a function to decode the token and extract the role
            const response = await axios.get(`${baseURL}/report/get-revenue-month?year=${selectedYear}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': `bearer ${token}`
                }
            });
            const data = response.data.data;
            setTotalRevenue(response.data.totalRevenue);
            const revenueByMonthArray = data.map(item => item.totalRevenue);
    
            const chartData = {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                datasets: [{
                    label: 'Doanh thu',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    data: revenueByMonthArray,
                }]
            };
            if (role === 'admin') {
                const responseCapital = await axios.get(`${baseURL}/report/get-capital-month?year=${selectedYear}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `bearer ${token}`
                    }
                });
                const dataCapital = responseCapital.data.data;
                const capitalByMonthArray = dataCapital.map(item => item.totalCapital);
    
                chartData.datasets.push({
                    label: 'Hàng nhập',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    data: capitalByMonthArray
                });
            }
    
            const ctx = chartRef.current.getContext('2d');
            const newChartInstance = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            setChartInstance(newChartInstance);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="chart-container">
                <h3>Biểu đồ thống kê</h3>
                <div className="select-year">
                    <span htmlFor="year">Năm </span>
                    <select id="year" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                        {Array.from({ length: 21 }, (_, i) => {
                            const year = new Date().getFullYear() - 10 + i;
                            return <option key={year} value={year}>{year}</option>;
                        })}
                    </select>
                </div>
                <canvas ref={chartRef} />
            </div>
    )
}

export default RevenueChart;
