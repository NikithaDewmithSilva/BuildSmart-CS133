import React, { useState } from 'react';
import axios from 'axios';
import "./InviteCustomerForm.css";

const InviteCustomerForm = ({ onClose, projectId }) => {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Basic validation
    if (!email) {
      setMessage('Email is required!');
      setLoading(false);
      return;
    }

    try {
      // Sending POST request to Flask endpoint
      const response = await axios.post('http://localhost:5000/send-invite', {
        invitee_email: email,
        project_id: projectId || '123e4567-e89b-12d3-a456-426614174000', // Use the actual project ID from props
        invited_by: localStorage.getItem('userId') || '123e4567-e89b-12d3-a456-426614174000', // Get user ID from localStorage
        description: description // Include the optional description
      });

      // Display success message
      setMessage(response.data.message || 'Invitation sent successfully!');
      setEmail('');
      setDescription('');
      
      // Close the form after 3 seconds on success
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setMessage(error.response?.data?.error || 'Failed to send invite. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invite-modal">
      <div className="invite-form-container">
        <div className='invite-form-heading'>
          <h2>Share this BOQ</h2>
          <button type="button" onClick={onClose} className="close-btn">X</button>
        </div>
        <form onSubmit={handleSubmit} className="invite-form">
          <label className="invite-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter recipient's email"
            required
            className="invite-input"
          />
          <br />
          <label className="invite-label">Description (optional):</label>
          <textarea
            className='invite-textarea'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a personal message"
          />
          <br />
          <button className="invite-btn" type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Share'}
          </button>
        </form>

        {/* Display success or error message */}
        {message && <p className={loading ? 'loading-message' : 'message'}>{message}</p>}
      </div>
    </div>
  );
};

export default InviteCustomerForm;