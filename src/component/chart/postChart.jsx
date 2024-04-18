import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const PostChart = () => {
    const [postChart, setPostChart] = useState(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchPostReport = async () => {
            try {
                const response = await axios.get('http://localhost:3001/report/report-post', {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `bearer ${localStorage.getItem('token')}`
                    }
                });
                setPostChart(response.data)
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };
    
        fetchPostReport();
    }, []);

    useEffect(() => {
        if (postChart) {
            if (chartRef.current !== null) {
                // Hủy biểu đồ hiện tại trước khi tạo biểu đồ mới
                chartRef.current.destroy();
            }
            createChart();
        }
    }, [postChart]);

    const createChart = () => {
        const ctx = document.getElementById('monthly-interactions-chart');
        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: postChart.map(data => data.category),
                datasets: [
                    {
                        label: 'Bình luận',
                        data: postChart.map(data => data.comments),
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        barPercentage: 0.4 // Điều chỉnh kích thước của cột
                    },
                    {
                        label: 'Lượt xem',
                        data: postChart.map(data => data.views),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        barPercentage: 0.4 // Điều chỉnh kích thước của cột
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Chủ đề'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Số lượng'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    };

    return (
        <div>
            <h3>Tương tác bài viêt</h3>
            <canvas id="monthly-interactions-chart"></canvas>
        </div>
    );
};

export default PostChart;
