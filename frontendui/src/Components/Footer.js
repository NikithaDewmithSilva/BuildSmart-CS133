import "./Footer.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faLinkedin, faWhatsapp, faGithub} from '@fortawesome/free-brands-svg-icons'

export default function Footer(){
    return(
        <footer className="footer">
            <div className="footer-content">
                    <ul>
                        <li className="footer-icon"><a href="https://www.instagram.com/"><FontAwesomeIcon icon={faInstagram} /></a></li>
                        <li className="footer-icon"><a href="https://www.facebook.com/Meta"><FontAwesomeIcon icon={faLinkedin} /></a></li>
                        <li className="footer-icon"><a href="https://x.com/?lang=en"><FontAwesomeIcon icon={faGithub} /></a></li>
                        <li className="footer-icon"><a href="https://web.whatsapp.com/"><FontAwesomeIcon icon={faWhatsapp} /></a></li>
                    </ul>
            </div>

            <div className="footer-copyright">
                &copy; 2024 BuildSmart. All rights reserved
            </div>
        </footer>
    )

}