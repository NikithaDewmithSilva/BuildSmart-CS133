import React, { useState } from 'react';
import axios from 'axios';
import "./InviteCustomerForm.css";

const InviteCustomerForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!email) {
      setMessage('Email is required!');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/invite-customer', {
        email,
        description,
      });

      setMessage(response.data.message || 'Invitation sent successfully!');
      setEmail('');
      setDescription('');
    } catch (error) {
      setMessage('Failed to send invite. Please try again.');
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
            required
            className="invite-input"
          />
          <br></br>
          <label className="invite-label">Description (optional):</label>
          <textarea className='invite-textarea'
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
          <br></br>
          <button className = "invite-btn" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Share'}</button>
          
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default InviteCustomerForm;
