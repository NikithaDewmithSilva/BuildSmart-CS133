import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {                           //Temporary
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Account</h1>
      </div>

      <div className="profile-container">
        <div className="profile-avatar">
          <div className="avatar-circle">A</div>
          <p className="username">athas</p>
        </div>

        <div className="profile-section">
          <h2>Account Details</h2>
          <div className="details-box">
            <p>Email: yusathas@gmail.com</p>
            <p>Username: yusathas787</p>
            <p>Password: ********</p>
            <div className="profile-actions">
              <button className="edit-btn">Edit</button>
              <button className="logout-btn" onClick={() => navigate("/login")}>Log Out</button>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Subscription</h2>
          <div className="details-box">
            <p>Premium (Annual)</p>
          </div>
        </div>

        <div className="profile-section">
          <h2>Settings</h2>
          <div className="details-box">
            <p>To manage parental controls, visit Edit Profiles and select a Profile.</p>
          </div>
        </div>

        <button className="delete-account-btn">Delete Account</button>
      </div>
    </div>
  );
};

export default Profile;