import "./Footer.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faLinkedin, faGithub} from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

export default function Footer(){
    return(
        <footer className="footer">
            <div className="footer-content">
                    <ul>
                        <li className="footer-icon"><a href="https://www.instagram.com/buildsmart.lk?igsh=MXI0bjdhN214eXR4dQ=="><FontAwesomeIcon icon={faInstagram} /></a></li>
                        <li className="footer-icon"><a href="https://www.linkedin.com/in/build-smart-724795352/"><FontAwesomeIcon icon={faLinkedin} /></a></li>
                        <li className="footer-icon"><a href="https://github.com/NikithaDewmithSilva/BuildSmart-CS133"><FontAwesomeIcon icon={faGithub} /></a></li>
                        <li className="footer-icon"><a href="https://buildsmart9.odoo.com/"><FontAwesomeIcon icon={faGlobe} /></a></li>
                    </ul>
            </div>

            <div className="footer-copyright">
                &copy; 2024 BuildSmart. All rights reserved
            </div>
        </footer>
    )

}