import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Process.css";

const Process = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("./output");
    }, 5000);
                                                         // temporarily set to 5 seconds
    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div className="process-page">
      <div className="process-header">
        <span className="process-logo">
          BUILD<span className="process-highlight">SMART</span>
        </span>
        <button className="process-profile-btn">PROFILE</button>
      </div>

      <div className="process-content">
        <p className="loading-text">
          Please wait a while we customize your <br /> Bill of Quantities
        </p>

        <div className="coffee-icon">
          <img src="/process1.png" alt="Coffee Break" />
        </div>

        <p className="break-text">Have a coffee <br /> and take a break</p>

        <div className="loading-spinner"></div>
      </div>
    </div>
  );
};

export default Process;