import React from "react";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom"; 
import "./Navbar.css";

const Navbar = ({ user }) => {

    const navigate = useNavigate(); 
  

  const handleProfileClick = () => {
    navigate('/profile');
  }

  const handleLoginClick = () => {
    navigate('/login');
  }
  return (
    <div className="navbar">
      {/* what to be displayed in the navbar if the user has logged in */}

      <div className="navbar-logo">
        <img src="/logo.png" alt="Logo" className="logo-image" />
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/about" className="nav-link">
          About Us
        </Link>
        <Link to="/services" className="nav-link">
          Services
        </Link>
        <Link to="/contact" className="nav-link">
          Contact Us
        </Link>

        {user ? (
        <div className="navbar-right">
          <button className="nav-member-btn nav-member-icon" onClick={handleProfileClick}><i class="fa-regular fa-user"></i></button>
        </div>
        ) : (
        <div className="navbar-right">
          <button className="nav-member-btn" onClick={handleLoginClick}>Login</button>
        </div>
        )}
      </div> 

      {/* what to be displayed if the user hasn't logged in yet */}
  
    </div>
  );
};



export default Navbar;