import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleProfileClick = () => navigate("/profile");
  const handleLoginClick = () => navigate("/login");

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.png" alt="Logo" className="logo-image" />
      </div>

      {/* The mobile vision when the screen gets small */}
      <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <i className={`fa ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
      </button>

      {/*Links */}
      <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About Us</Link>
        <Link to="/services" className="nav-link">Services</Link>
        <Link to="/contact" className="nav-link">Contact Us</Link>
      </div>

      {/* Profile/Login Button */}
      <div className="navbar-right">
        {user ? (
          <button className="nav-member-btn nav-member-icon" onClick={handleProfileClick}>
            <i className="fa-regular fa-user"></i>
          </button>
        ) : (
          <button className="nav-member-btn" onClick={handleLoginClick}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
