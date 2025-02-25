import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = ({ user }) => {
  const navigate = useNavigate();

  return (
    
    <div className="home-container">
      <div>
        <h1>Take Your First Step To Build Your Dream House With Us</h1>

        {!user && (
          <div>
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
                <img src="coverpage-photo.png" alt="Construction Worker" />
              </div>
            </div>
          </div>
        )}
      </div> 
    </div>
  );
};

export default Home;