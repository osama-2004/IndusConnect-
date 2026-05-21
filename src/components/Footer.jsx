import { Link } from 'react-router-dom'
import './Footer.css'
import logo from '../assets/logo.svg';


const Logo = () => (
  <img src={logo} alt="IndusConnect Logo" height="28" />
)
export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-inner">
        {/* Logo + Socials */}
        <div className="footer-brand">
          <Link to="/assets/logo.svg" className="footer__logo" >
            <Logo />
          </Link>
          <div className="footer-socials">
            {/* Instagram */}
            <a href="#" className="social-icon" id="footer-instagram" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            {/* X/Twitter */}
            <a href="#" className="social-icon" id="footer-twitter" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="social-icon" id="footer-linkedin" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Columns */}
        <div className="footer-cols">
          <div className="footer-col">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login" id="footer-login">Log in</Link></li>
              <li><Link to="/signup" id="footer-signup">Sign Up</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Information</h4>
            <ul>
              <li><Link to="/#our-story" id="footer-our-story">Our Story</Link></li>
              <li><a href="#how-it-works" id="footer-how-it-works">How it works</a></li>
              <li><Link to="/rfq" id="footer-rfq-guide">RFQ Guide</Link></li>
              <li><Link to="/privacy-policy" id="footer-privacy-policy">Terms &amp; Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Help</h4>
            <ul>
              <li><a href="mailto:contact@indusconnect.com" id="footer-contact">Contact us</a></li>
              <li><Link to="/rfq" id="footer-rfq">RFQ Guide</Link></li>
              <li><Link to="/complaint" id="footer-complaint">Submit Complaint</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Indusconnect © 2026, All rights reserved.</p>
      </div>
    </footer>
  )
}
