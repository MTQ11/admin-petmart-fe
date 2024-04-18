import React, { useState, useEffect } from 'react';
import './report.css';
import axios from 'axios';
//import { exportToExcel } from './excelExport'; // assuming you have an exportToExcel function

const Report = () => {
    const [Revenue, setRevenue] = useState([]);
    const [Capital, setCapital] = useState([]);
    const [selectedYear, setSelectedYear] = useState(''); // default option
    const [years, setYears] = useState([]);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear - 10; i <= currentYear; i++) {
            years.push(i.toString());
        }
        setYears(years);
        fetchDataRevenue(selectedYear);
        fetchDataCapital(selectedYear)
    }, [selectedYear]);

    const fetchDataRevenue = async (option) => {
        const response = await axios.get(`http://localhost:3001/report/get-revenue-month?year=${selectedYear}`, {
            headers: {
                'Content-Type': 'application/json',
                'token': `beare ${localStorage.getItem('token')}`
            }
        });
        console.log(response.data)
        setRevenue(response.data.data)
    };

    const fetchDataCapital = async (option) => {
        const response = await axios.get(`http://localhost:3001/report/get-capital-month?year=${selectedYear}`, {
            headers: {
                'Content-Type': 'application/json',
                'token': `beare ${localStorage.getItem('token')}`
            }
        });
        console.log(response.data)
        setCapital(response.data.data)
    };

    const handleExport = () => {
        // Export data to Excel
        //exportToExcel(data);
    };

    return (
        <div className="report-container">
            <div className="options">
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    {years.map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                    ))}
                </select>
                <button onClick={handleExport}>Xuất Excel</button>
            </div>
            <table className="report-table">
                <thead>
                    <tr>
                        <th>Tháng</th>
                        <th>Doanh Thu</th>
                    </tr>
                </thead>
                <tbody>
                    {Revenue.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td className="month-cell">{item.month}</td>
                                <td>{item.totalRevenue}</td>
                            </tr>
                        );
                    })}
                    <tr>
                        <td><strong>Tổng</strong></td>
                    </tr>
                </tbody>

            </table>
        </div>
    );
};

export default Report;
