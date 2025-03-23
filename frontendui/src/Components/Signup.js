import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { supabase } from '../supabase';
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate(); 
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
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
    setIsLoading(true);

    const { name, email, number, password, confirmPassword, termsAccepted } = formData;

    // Validate password match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setIsLoading(false);
      return;
    }
    
    // Validate terms acceptance
    if (!termsAccepted) {
      alert("You must accept the terms and conditions!");
      setIsLoading(false);
      return;
    }

    try {
      // Create user with metadata that will be used by the database trigger
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_name: name,
            phone_number: number
          }
        }
      });

      if (error) throw error;

      const user = data.user;

      if (user) {
        alert("Signup successful! Please check your email to verify your account.");
        navigate('/login'); // Navigate to the login page
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message); // Show any error messages
    } finally {
      setIsLoading(false);
    }
  };
    
  //Form filling Part
  return (
    <div className="signup-page">
      <div className="signup-left">
        <img src="signup1.png" alt="Signup Background" className="signup-image" />
      </div>

      <div className="signup-right">
        <h2>SIGN UP</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="abc@gmail.com"
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
              minLength="6"
              placeholder="Abc@123"
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
              placeholder="Retype your password"
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
              Already a member? <a href="/login">Login</a>
            </span>
          </div>

          <div className="signup-buttons">
            <button type="submit" className="signup-btn" disabled={isLoading}>
              {isLoading ? "SIGNING UP..." : "SIGN-UP"}
            </button>
          </div>
        </form>

        <div className="signup-or">or</div>

        <button type="button" className="google-btn" disabled={isLoading}>
          <img src="signup1.svg" alt="Google" className="google-btn-img" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Signup;

