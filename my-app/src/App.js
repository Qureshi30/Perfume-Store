import React from 'react';
import './App.css';
import Home from './Component/Home';
import Navbar from "./Component/Navbar";
import Footer from './Component/Footer';
import About from './Component/About';
import Contact from './Component/Contact';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Products from './Component/Products';
import ProductDescription from './Component/ProductDescription';
import Cart from './Component/Cart';
import AddProduct from './Component/AddProduct';
import { SignUp as Signup } from '@clerk/clerk-react';
import Login from './Component/Login';
import AdminDashboard from './Component/AdminDashboard';
import UserDashboard from './Component/UserDashboard';
// import AdminRegistration from './Component/AdminRegistration';
import { UserRoute, AdminRoute, RoleBasedRedirect, UnauthorizedPage } from './Component/RouteProtection';

function App() {
  return (
    <div>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
          <Route path="/product/:id" element={<ProductDescription />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          {/* <Route path="/admin/register" element={<AdminRoute><AdminRegistration /></AdminRoute>} /> */}
          <Route path="/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />

          {/* User routes */}
          <Route path="/user/dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />

          {/* Role-based redirect */}
          <Route path="/dashboard" element={<RoleBasedRedirect />} />

          {/* Unauthorized access */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
