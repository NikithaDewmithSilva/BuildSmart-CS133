import React from 'react';
import './Aboutus.css';

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <div className="aboutus-image">
      </div>
      <div className="aboutus-content">
        <h2 className="aboutus-title">ABOUT US</h2><br />
        <p>
        At BuildSmart, we are revolutionizing the construction and design process by seamlessly 
        integrating design, procurement, and execution. Our advanced platform transforms CAD designs into 
        accurate Bills of Quantities (BOQs), eliminating manual calculations and ensuring precise cost estimation. 
        Beyond automation, we empower customers with real-time customization, allowing them to personalize materials, 
        finishes, and design elements before construction begins. This interactive approach not only enhances customer 
        satisfaction but also reduces costly revisions and last-minute changes.
        </p>
        <p>
        
        For project managers, our system provides real-time material tracking, offering complete visibility into 
        inventory levels, procurement status, and resource allocation. By preventing shortages, reducing waste, and 
        keeping costs under control, our platform optimizes project efficiency. With automation, customization, and 
        live tracking combined, we create a collaborative space where architects, contractors, and clients can work in sync. 
        Our mission is to eliminate inefficiencies, enhance transparency, and streamline communication, ensuring that every 
        project is executed with accuracy, speed, and ease.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;