import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import Chart from 'chart.js/auto';

const UserStatistics = () => {
    const genderChartRef = useRef(null);
    const ageChartRef = useRef(null);
    const [genderChartData, setGenderChartData] = useState(null);
    const [ageChartData, setAgeChartData] = useState(null);
    const [genderChartInstance, setGenderChartInstance] = useState(null);
    const [ageChartInstance, setAgeChartInstance] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/report/report-user', {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `bearer ${localStorage.getItem('token')}`
                    }
                });
                const { genderReport, ageReport } = response.data;
                setGenderChartData(genderReport);
                setAgeChartData(ageReport);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
    
        fetchUserData();
    }, []);
    

    useEffect(() => {
        // Tạo biểu đồ khi dữ liệu đã được thiết lập
        if (genderChartData && !genderChartInstance) {
            createGenderChart();
        }
        if (ageChartData && !ageChartInstance) {
            createAgeChart();
        }
    }, [genderChartData, ageChartData, genderChartInstance, ageChartInstance]);

    const createGenderChart = () => {
        const labels = ['Nam', 'Nữ', 'Khác']; // Mảng nhãn tùy chỉnh
        const ctx = genderChartRef.current.getContext('2d');
        const newChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Gender Distribution',
                    data: Object.values(genderChartData),
                    backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                }]
            },
            options: {
                responsive: true
            }
        });
        setGenderChartInstance(newChartInstance);
    };
    
    
    const createAgeChart = () => {
        const labels = ['Dưới 20 tuổi', '20-40 tuổi', 'Trên 40 tuổi']; // Mảng nhãn tùy chỉnh
        const ctx = ageChartRef.current.getContext('2d');
        const newChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Age Distribution',
                    data: Object.values(ageChartData),
                    backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                }]
            },
            options: {
                responsive: true
            }
        });
        setAgeChartInstance(newChartInstance);
    };
    

    return (
        <div className="chart-container">
            <h3>Thống kê người dùng</h3>
            <div style={{ display: 'flex' }}>
                <div className="chart" style={{ width: '50%', height: 'auto' }}>
                    <canvas ref={genderChartRef} />
                </div>
                <div className="chart" style={{ width: '50%', height: 'auto' }}>
                    <canvas ref={ageChartRef} />
                </div>
            </div>
        </div>
    );
};

export default UserStatistics;
