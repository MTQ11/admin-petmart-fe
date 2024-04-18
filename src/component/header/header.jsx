import React, { useState, useEffect } from 'react';
import logo from '../../asset/image/logo.webp';
import './header.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const { currentUser, setCurrentUser } = useAuth();
    const [userDetails, setUserDetails] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null); // Clear current user from context
        navigate('/login');
    };

    useEffect(() => {
        fetchUserDetails();
    }, [currentUser]);
    console.log(currentUser)
    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3001/user/get-detail/${currentUser.id}`, {
                method: 'GET',
                headers: {
                    'token': `bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUserDetails(data.data);
            } else {
                console.error('Failed to fetch user details');
            }
        } catch (error) {
            console.error('Connection error:', error);
        }
    };


    return (
        <div className="header">
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <div className="user-avatar">
                <span>{userDetails?.email}</span>
                <FontAwesomeIcon onClick={() => setShowNotifications(!showNotifications)} icon={faBell} style={{ fontSize: '24px', color: 'gray', paddingRight: '10px'}}/>
                <img src={userDetails ? userDetails.information.avatar : 'default-avatar.jpg'} alt="User Avatar"  onClick={() => setShowMenu(!showMenu)}/>
                {showMenu && (
                    <div className="dropdown-menu">
                        <ul>
                            <li>Profile</li>
                            <li>Settings</li>
                            <li onClick={handleLogout}>Logout</li>
                        </ul>
                    </div>
                )}
                {showNotifications && (
                <div className="notification-dropdown">
                    {/* thông báo ở đây */}
                </div>
            )}
            </div>
        </div>
    );
};

export default Header;
