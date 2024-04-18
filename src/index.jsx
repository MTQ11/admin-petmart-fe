import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard/dashboard';
import Product from './pages/Product/product';
import TypeProduct from './pages/TypeProduct/typeproduct';
import User from './pages/User/user';
import Promotion from './pages/Promotion/promotion';
import Blog from './pages/Blog/blog';
import Login from './pages/Login/login';
import PrivateRoutes from './utils/PrivateRoute';
import Order from './pages/Order/order';
import Receipt from './pages/Receipt/receipt';
import Customer from './pages/Customer/customer';
import NotFound from './pages/Notfound/notfound';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<App />}>
            <Route element={<PrivateRoutes />}>
              <Route path='/' element={<Dashboard />} />
              <Route path='product' element={<Product />} />
              <Route path='type-product' element={<TypeProduct />} />
              <Route path='user' element={<User />} />
              <Route path='customer' element={<Customer />} />
              <Route path='order' element={<Order />} />
              <Route path='receipt' element={<Receipt />} />
              <Route path='promotion' element={<Promotion />} />
              <Route path='blog' element={<Blog />} />
              <Route path='*' element={<NotFound />} />
            </Route>
          </Route>
          <Route path='login' element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
