import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom"; 
import { supabase } from '../supabase';
import "./Login.css";

const Login = ({setSession}) => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    //using Supabase for login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    
    if (error) {
      alert(error.message);
    } else {
      // Handle successful login, store session, etc.
      console.log(data);
      navigate('/');
    }
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
            Email
            <input
              type="text"
              name="email"
              value={formData.email}
              placeholder="Enter your registered email"
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password
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
              Login
            </button>
            <button
              type="button"
              className="login-btn secondary"
            >
              Sign-up
            </button>
          </div>
          <button type="button" className="google-btn">
            <img src="signup1.svg" alt="Google" className="google-btn-img" />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;