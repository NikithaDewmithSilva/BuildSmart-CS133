import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from '../supabase';
import "./Profile.css";

const Profile = () => { 
  const { user, logout } = useAuth();
  const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
      user_name: "",
      email: "",
      phone_number: "",
    });
  
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')  // Select all fields
            .eq('user_id', user.id)
            .single();
    
          if (error) {
            console.error('Error fetching user profile:', error);
            setError('Failed to load your profile');
          } else {
            setProfile(data);
            setFormData({
              user_name: data.user_name || "",
              email: data.email || "",
              phone_number: data.phone_number || "",
            });
          }
        } catch (err) {
          console.error('Unexpected error:', err);
          setError('An unexpected error occurred');
        } finally {
          setLoading(false);
        }
      }
  
      fetchUserProfile();
    }, [user, navigate]);

    

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // Redirect to login page
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Account</h1>
      </div>

      <div className="profile-container">
        <div className="profile-avatar">
          <div className="avatar-circle">{formData.user_name.charAt(0)}</div>
          <p className="username">{formData.user_name}</p>
        </div>

        <div className="profile-section">
          <h2>My Profile</h2>
          <div className="details-box">
            <div className="details-box-content">
              <div className="details-box-label">
                Name:
              </div>
              <div>
                {formData.user_name}
              </div>
            </div>
            <div className="details-box-content">
              <div className="details-box-label">
                Email:
              </div>
              <div>
                {formData.email}
              </div>
            </div>
            <div className="details-box-content">
              <div className="details-box-label">
                Phone number:
              </div>
              <div>
                {formData.phone_number}
              </div>
            </div>
            <div className="profile-actions">
              <button className="edit-btn">Edit</button>
              <button className="logout-btn" onClick={handleLogout}>Log Out</button>
            </div>
          </div>
        </div>


        <button className="delete-account-btn">Delete Account</button>
      </div>
    </div>
  );
};

export default Profile;