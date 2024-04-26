// UserInfoLoader.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '../../utils/api';

const UserInfo = ({ userId }) => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${baseURL}/user/admin-get-detail/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `bearer ${token}`
                    }
                });
                setUserInfo(response.data.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserInfo();
    }, [userId]);

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={userInfo.information.avatar} alt="Avatar" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
            <p style={{ fontWeight: 'bold', marginLeft: '10px' }}>{userInfo.information.name}</p>
        </div>
    );
};

export default UserInfo;
