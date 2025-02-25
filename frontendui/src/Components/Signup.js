import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { supabase } from '../supabase';
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, number, password, confirmPassword, termsAccepted } = formData;

    // Check if password matches with the re-entered password
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }else if (!formData.termsAccepted) {
      alert("You must accept the terms and conditions!");
    }

    // Use Supabase's signUp method to create a new user
    const { user, error } = await supabase.auth.signUp({
      email: email,
      number: number,
      password: password,
      termsAccepted: termsAccepted
    });

    if (error) {
      alert(error.message); // Show error message if signup fails
    } else {
      console.log("User signed up successfully!", user);
      navigate('/signup') // Handle success
      // You can redirect the user to the login page or log them in automatically
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (formData.password !== formData.confirmPassword) {
  //     alert("Passwords do not match!");
  //   } else if (!formData.termsAccepted) {
  //     alert("You must accept the terms and conditions!");
  //   } else {
  //     alert("Signup Successful!");
  //     navigate("/input"); 
  //   }
  // };

  return (
    <div className="signup-page">
      <div className="signup-left">
        <img src="signup1.png" alt="Signup Background" className="signup-image" />
      </div>

      <div className="signup-right">
        <h2>SIGN UP</h2>
        <form onSubmit={handleSubmit} className="signup-form">

          <label>
            Email
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Contact Number
            <input
              type="text"
              name="number"
              value={formData.number}
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

          <label>
            Re-enter the password
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
              Hereby I agree to the <a href="#">Terms & Conditions</a>
            </span>
          </div>

          <div className="already-member">
            <span>
              Already a member ? <a href="/login">Login</a>
            </span>
          </div>

          <div className="signup-buttons">
            <button type="submit" className="signup-btn">
              SIGN-UP
            </button>
          </div>
        </form>

        <div className="signup-or">or</div>

        <button type="button" className="google-btn">
          <img src="signup1.svg" alt="Google" className="google-btn-img" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Signup;