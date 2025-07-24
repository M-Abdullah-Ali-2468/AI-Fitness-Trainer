import "./Footer.css";
import navLogo from '../../assets/navLogo.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo-box">
            <img src={navLogo} alt="Logo" className="footer-logo-img" />
            <h2 className="footer-logo glow-text">AlphaFit AI</h2>
          </div>
          <p>
            Your intelligent fitness companion. Track, train, and transform
            using the power of Artificial Intelligence.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/onboarding">Onboarding</a></li>
            <li><a href="/generate-program">Generate Plan</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h4>Connect With Us</h4>
          <div className="social-icons">
            <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#"><i className="fa-brands fa-instagram"></i></a>
            <a href="#"><i className="fa-brands fa-twitter"></i></a>
            <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AlphaFit AI. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
