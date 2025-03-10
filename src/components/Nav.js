import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../navbar.css';

/**
 * NavigationBar Component
 * 
 * A reusable navigation bar component using React-Bootstrap.
 * It contains a brand logo and a navigation link, with a callback function 
 * to handle navigation events.
 * 
 * @param {Function} onNavClick - Callback function to handle navigation clicks
 */
function NavigationBar({ onNavClick }) {
  return (
    <Navbar id="navBar" className="dynamic-navbar" data-bs-theme="dark">
      {/* Container div for structuring navbar content */}
      <div className="navbar-container">
        
        {/* Brand logo with a click event to navigate to the upload page */}
        <Navbar.Brand href="#home" onClick={() => onNavClick("upload")}>
          <img
            src="/ASP_logo.png" // Path to the logo image
            width="90"
            height="50"
            className="d-inline-block align-top"
            alt="ReadEase Logo"
          />
        </Navbar.Brand>

        {/* Navigation links */}
        <Nav>
          {/* Feedback link triggers onNavClick with "feedback" as parameter */}
          <Nav.Link
            href="#feedback"
            id="navBar-link"
            className="navbar-feedback"
            onClick={() => onNavClick("feedback")}
          >
            Feedback
          </Nav.Link>
        </Nav>

      </div>
    </Navbar>
  );
}

export default NavigationBar;
