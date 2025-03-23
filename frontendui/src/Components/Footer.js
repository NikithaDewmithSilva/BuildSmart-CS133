import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <ul className="social-links">
          <li className="footer-icon">
            <a href="https://www.instagram.com/buildsmart.lk?igsh=MXI0bjdhN214eXR4dQ==" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </li>
          <li className="footer-icon">
            <a href="https://www.linkedin.com/in/build-smart-724795352/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </li>
          <li className="footer-icon">
            <a href="https://github.com/NikithaDewmithSilva/BuildSmart-CS133" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </li>
          <li className="footer-icon">
            <a href="https://buildsmart9.odoo.com/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGlobe} />
            </a>
          </li>
        </ul>
      </div>

      <div className="footer-copyright">
        &copy; 2025 <span className="brand-name">BUILD</span><span className="brand-name1">SMART</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
