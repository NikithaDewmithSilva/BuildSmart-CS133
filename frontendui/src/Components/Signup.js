import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    number: "+94 ",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
    } else if (!formData.termsAccepted) {
      alert("You must accept the terms and conditions!");
    } else {
      alert("Signup Successful!");
      navigate("/input"); 
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-left">
        <img src="signup1.png" alt="Signup Background" className="signup-image" />
      </div>

      <div className="signup-right">
        <h2>SIGN UP</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <label>
            USER NAME
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            EMAIL
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            CONTACT NUMBER
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            PASSWORD
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            RE-TYPE PASSWORD
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </label>

          <div className="signup-terms">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
            <span>
              HEREBY I AGREE TO THE <a href="#">TERMS AND CONDITIONS</a>
            </span>
          </div>

          <div className="signup-buttons">
            <button type="submit" className="signup-btn">
              SIGN-UP
            </button>
            <button
              type="button"
              className="signup-btn secondary"
              onClick={() => navigate("/login")}
            >
              LOGIN
            </button>
          </div>
        </form>

        <button type="button" className="google-btn">
          <img src="signup1.svg" alt="Google" className="google-btn-img" />
          LOGIN WITH GOOGLE
        </button>
      </div>
    </div>
  );
};

export default Signup;