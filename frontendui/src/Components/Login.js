import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Login.css";

const Login = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login Successful!");
    navigate("/input");
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src="login1.png" alt="Login Background" className="login-image" />
      </div>
      <div className="login-right">
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit} className="login-form">
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
            PASSWORD
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <div className="login-buttons">
            <button type="submit" className="login-btn">
              LOGIN
            </button>
            <button
              type="button"
              className="login-btn secondary"
              onClick={() => navigate("/signup")}
            >
              SIGN-UP
            </button>
          </div>
          <button type="button" className="google-btn">
            <img src="signup1.svg" alt="Google" className="google-btn-img" />
            LOGIN WITH GOOGLE
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;