import React, { useState, useEffect } from "react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);        // Toggle delete account form
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    phone_number: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [deletePassword, setDeletePassword] = useState("");     // Password to delete the account

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
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
    };

    fetchUserProfile();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          user_name: formData.user_name,
          email: formData.email,
          phone_number: formData.phone_number,
        })
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        setError('Failed to update profile');
      } else {
        setProfile(data);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmNewPassword } = passwordData;

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (authError) {
        console.error('Error reauthenticating:', authError);
        setError("Current password is incorrect.");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error('Error updating password:', updateError);
        setError("Failed to update password.");
      } else {
        setError(null);
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        alert("Password updated successfully!");
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError("Please enter your password to delete your account.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Reauthenticate the user
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: deletePassword,
      });

      if (authError) {
        console.error('Error reauthenticating:', authError);
        setError("Incorrect password.");
        return;
      }

      // Delete the user account
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

      if (deleteError) {
        console.error('Error deleting account:', deleteError);
        setError("Failed to delete account.");
      } else {
        await logout();
        navigate("/login");
        alert("Your account has been deleted.");
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Account Details</h1>
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
              <div className="details-box-label">Name:</div>
              {isEditing ? (
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : (
                <div>{formData.user_name}</div>
              )}
            </div>
            <div className="details-box-content">
              <div className="details-box-label">Email:</div>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : (
                <div>{formData.email}</div>
              )}
            </div>
            <div className="details-box-content">
              <div className="details-box-label">Phone number:</div>
              {isEditing ? (
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : (
                <div>{formData.phone_number}</div>
              )}
            </div>
            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button className="save-btn" onClick={handleSave}>
                    Save
                  </button>
                </>
              ) : (
                <button className="edit-btn" onClick={handleEdit}>
                  Edit
                </button>
              )}
              <button className="logout-btn" onClick={handleLogout}>Log Out</button>
            </div>
          </div>
        </div>

        {/* The section to change the password */}
        <div className="password-change-section">
          <button
            className="change-password-btn"
            onClick={() => setIsChangingPassword(!isChangingPassword)}
          >
            {isChangingPassword ? "Close Password Change" : "Change Password"}
          </button>

          {isChangingPassword && (
            <div className="password-change-form">
              <div className="details-box-content">
                <div className="details-box-label">Current Password:</div>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="edit-input"
                />
              </div>
              <div className="details-box-content">
                <div className="details-box-label">New Password:</div>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="edit-input"
                />
              </div>
              <div className="details-box-content">
                <div className="details-box-label">Confirm New Password:</div>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className="edit-input"
                />
              </div>
              <button className="save-btn" onClick={handleChangePassword}>
                Update Password
              </button>
              {error && <p className="error-message">{error}</p>}
            </div>
          )}
        </div>

        {/* The section to delete the accounts */}
        <div className="delete-account-section">
          <button
            className="delete-account-btn"
            onClick={() => setIsDeletingAccount(!isDeletingAccount)}
          >
            {isDeletingAccount ? "Cancel Delete Account" : "Delete Account"}
          </button>

          {isDeletingAccount && (
            <div className="delete-account-form">
              <div className="details-box-content">
                <div className="details-box-label">Enter Password to Confirm:</div>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="edit-input"
                  placeholder="Enter your password"
                />
              </div>
              <button className="delete-account-confirm-btn" onClick={handleDeleteAccount}>
                Confirm Delete Account
              </button>
              {error && <p className="error-message">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;