import React from "react";
import "./Services.css";

const Services = () => {
  return (
    <div className="services">
      <img src="/logo.png" alt="Logo" className="logo-image" />
      
       <br />

      <h2 className="services-subtitle">WHAT WE CAN DO FOR YOU</h2> 
      
      <br />
      <br />

      <div className="services-container">

        {/* 1st service Square */}
        <div className="service-card1">
          <div className="service-icon">
            <img src="services1.svg" alt="CAD Design" className="icon-svg" />
          </div>
          <p className="service-text"><br />
            ANALYZE YOUR CAD DESIGN AND GENERATE A QUICK AND ACCURATE BOQ
          </p>
        </div>

        {/* 2nd service Square */}
        <div className="service-card2">
          <div className="service-icon">
            <img src="services2.svg" alt="Estimation" className="icon-svg" />
          </div>
          <p className="service-text"><br />
            GIVES THE USER A TOTAL MATERIAL, COST, AND TIME ESTIMATION WITH A
            TRACKABILITY FEATURE
          </p>
        </div>

        {/* 3rd service Square */}
        <div className="service-card3">
          <div className="service-icon">
            <img src="services3.svg" alt="Customization" className="icon-svg" />
          </div>
          <p className="service-text"><br />
            ALLOWS THE USER TO CUSTOMIZE THE PRICE ACCORDING TO THE LIKING OF
            THE TYPE OF MATERIALS
          </p>
        </div>
      </div><br /><br /><br /><br />
    </div>
  );
};

export default Services;