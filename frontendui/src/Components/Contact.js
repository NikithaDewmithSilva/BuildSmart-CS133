import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-container"><br /><br /><br />
      <h2 className="contact-title">REACH OUT TO US</h2>
      <form className="contact-form">
        <p className="contact-form1">Enter your name </p>
        <input
          type="text"
          placeholder="Enter your name"
          className="contact-input"
          required
        />
        <p className="contact-form1">Enter your E-mail </p>
        <input
          type="email"
          placeholder="Enter your e-mail"
          className="contact-input"
          required
        />
        <p className="contact-form1">Your Contact Details </p>
        <input
          type="text"
          placeholder="Your contact details"
          className="contact-input"
        />
        <p className="contact-form1">Tell us About your problem </p>
        <textarea
          placeholder="Tell us about your problem"
          className="contact-textarea"
          required
        ></textarea>
        <div className="contact-buttons">
          <button type="reset" className="contact-clear">
            Clear Form
          </button>
          <button type="submit" className="contact-submit">
            Submit
          </button>
        </div>
      </form><br /><br /><br />
    </div>
  );
};

export default Contact;