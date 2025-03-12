import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from '../supabase';
import ProjectModal from './ProjectModal';
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('user_profiles')
          .select('user_name')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to load user profile');
        } else {
          setUserName(data?.user_name || 'User');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, [user]);

  const handleViewProjects = () => navigate('./MyProjects');
  const handleContactUs = () => navigate('./Contact');
  const handleGetStarted = () => navigate('/signup');

  return (
    <div className="home-container">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div>
          {user ? (
            <div className="loggedin-home">
              <div className="logged-in-content">
                <h1>Welcome back, {userName}!</h1>
                <div className="home-buttons logged-in">
                  <button className="home-btn" onClick={openModal}>
                    Create a New Project
                  </button>
                  <button className="home-btn" onClick={handleViewProjects}>
                    View My Projects
                  </button>
                </div>
              </div>
              <ProjectModal isOpen={isModalOpen} closeModal={closeModal} />
            </div>
          ) : (
            <div className="home-content">
              <div className="home-text">
                <h1>Take Your First Step To Build Your Dream House With Us</h1>
                <div className="home-buttons">
                  <button className="home-btn" onClick={handleContactUs}>
                    Let's Talk
                  </button>
                  <button className="home-btn" onClick={handleGetStarted}>
                    Let's Begin
                  </button>
                </div>
              </div>
              <div className="home-video">
                <video autoPlay loop muted playsInline>
                  <source src="Homev1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;