import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
  
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
      </div>

     
      <div className="navbar-right">
        <button className="nav-member-btn">Member</button>
      </div>
    </div>
  );
};

export default Navbar;