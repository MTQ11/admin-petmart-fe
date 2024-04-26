import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/AuthContext';
import baseURL from '../../utils/api';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setCurrentUser } = useAuth();

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseURL}/user/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: username, password })
            });

            if (response.ok) {
                const data = await response.json();

                const token = data.newRequest.access_token;

                localStorage.setItem('token', token);
                const decodedToken = jwtDecode(token);

                if (decodedToken.role === 'admin' || decodedToken.role == 'member') {
                    setCurrentUser(decodedToken);
                    navigate('/');
                } else {
                    alert("Tài khoản không có quyền quản trị")
                }
            } else {
                alert("Sai tài khoản hoặc mật khẩu")
            }
        } catch (error) {
            console.error('Connection error:', error);
        }
    };

    return (
        <div className="login-container">
            <h2 className='title'>MANAGE PETMART</h2>
            <form onSubmit={handleSubmitLogin}>
                <div className="form-group">
                    <label htmlFor="username">Tài khoản:</label>
                    <input
                        className='input-login'
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Nhập tài khoản"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mật khẩu:</label>
                    <input
                        className='input-login'
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className='button-submit' type="submit">Đăng nhập</button>
            </form>
            <div className="forgot-password">
                <a href="#">Quên mật khẩu?</a>
            </div>
        </div>
    );
}

export default Login;
