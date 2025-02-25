import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
 
  return (
    <div className="home-container">
      <div>
        {user ? (
          <div>
            {/* Content for logged-in users */}
            <h1>Welcome back, {user.email}!</h1>
            
            <div>
              <button className="home-btn">Create a New Project</button>
              <button className="home-btn">View My Projects</button>
            </div>
          </div>
          
          
        ) : (
          // Content for non-logged-in users

            <div className="home-content">
              <div className="home-text">
                <h1>Take Your First Step To Build Your Dream House With Us</h1>

                <div className="home-buttons">

                  <button className="home-btn">Let's Talk</button>

                  <button className="home-btn" onClick={() => navigate("/signup")}>
                    Let's Begin
                  </button>

                </div>
              </div>
              
              <div className="home-image">
                <img src="coverpage-photo.jpg" alt="Construction Worker" />
              </div>
            </div>

        )}
      </div>
    </div>
  );
};

export default Home;