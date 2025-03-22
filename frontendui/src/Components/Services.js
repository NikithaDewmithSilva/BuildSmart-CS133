import React from "react";
import "./Services.css";

const Services = () => {
  return (
    <div className="services">
      
      <video autoPlay loop muted className="background-video">
        <source src="/Servicesv1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Made the background dark / easy access to read*/}
      <div className="services-overlay"></div>

      <div className="services-content">
        <img src="/logo.png" alt="Logo" className="logo-image" />
        <h2 className="services-subtitle">WHAT WE CAN DO FOR YOU</h2>

        <div className="services-container">
          {/* 1st Service Card */}
          <div className="service-card">
            <div className="service-icon">
              <img src="services1.svg" alt="CAD Design" className="icon-svg" />
            </div>
            <h3 className="service-title">CAD Design Analysis</h3>
            <p className="service-text">
              Analyze your CAD design and generate a quick and accurate BOQ.
            </p>
          </div>

          {/* 2nd Service Card */}
          <div className="service-card">
            <div className="service-icon">
              <img src="services2.svg" alt="Estimation" className="icon-svg" />
            </div>
            <h3 className="service-title">Material & Cost Estimation</h3>
            <p className="service-text">
              Get total material, cost, and time estimation with trackability.
            </p>
          </div>

          {/* 3rd Service Card */}
          <div className="service-card">
            <div className="service-icon">
              <img src="services3.svg" alt="Customization" className="icon-svg" />
            </div>
            <h3 className="service-title">Customization</h3>
            <p className="service-text">
              Customize prices based on your preferred materials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;