import React from "react";
import "./Aboutus.css";

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <div className="aboutus-content">
        <h2 className="aboutus-title">ABOUT US</h2>
        <p>
          At <span className="highlight">BuildSmart</span>, we are revolutionizing the construction 
          and design process by seamlessly integrating design, procurement, and execution. 
          Our advanced platform transforms CAD designs into accurate Bills of Quantities (BOQs), 
          ensuring precise cost estimation while eliminating manual calculations.
        </p>
        <p>
          For project managers, our system provides <span className="highlight">real-time material tracking</span>, 
          offering complete visibility into inventory levels, procurement status, and resource 
          allocation. By reducing waste, preventing shortages, and optimizing efficiency, 
          our platform empowers collaboration between architects, contractors, and clients.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
