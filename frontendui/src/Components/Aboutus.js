import React from 'react';
import './Aboutus.css';

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <div className="aboutus-image">
        <img
          src="aboutus1.png" alt="Discussion"/>
      </div>
      <div className="aboutus-content">
        <h2 className="aboutus-title">ABOUT US</h2><br />
        <p>
          At <strong>BuildSmart</strong>, we are revolutionizing the way construction planning is done.
          our platfore is designed to help you plan your construction projects with ease.
          We provide you with all the tools you need to plan your construction projects.
          Our website simplifies the <strong>estimation of raw materials, project timelines, and total expenses</strong>
          by analyzing your CAD house plan.  
        </p>
        <p>
        Whether you're an architect, contractor, or homeowner, <strong>BuildSmart</strong> helps you make 
        <em>informed decisions</em> with precise <strong>BOQ (Bill of Quantities) generation</strong>.
        </p>
        <h3>Why Choose BuildSmart?</h3>
        <ul>
            <li><strong>Accurate Material Estimation</strong> – Get precise calculations for bricks, cement, steel, and other materials.</li>
            <li><strong>Time & Cost Efficiency</strong> – Reduce guesswork and streamline project planning.</li>
            <li><strong>Seamless CAD Integration</strong> – Upload your <strong>DXF house plans</strong> and receive a detailed breakdown in minutes.</li>
            <li><strong>User-Friendly Interface</strong> – No technical expertise needed—just upload, analyze, and build smarter!</li>
        </ul>
        <p>
          <strong>BuildSmart</strong> is your one-stop solution for all your construction planning needs. 
          Join us today and start building smarter!
        </p>
        <p>📩 Have any doubts? 
          Feel free to Contact us at buildsmartlk@gmail.com</p>
      </div>
    </div>
  );
};

export default AboutUs;