import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../navbar.css';  // Import the CSS file

function NavigationBar({ onNavClick }) {
  return (
    <Navbar id="navBar" className="dynamic-navbar" data-bs-theme="dark">
      <div className="navbar-container">
        <Navbar.Brand href="#home" onClick={() => onNavClick("upload")}>
          <img
            src="/ASP_logo.png"
            width="90"
            height="50"
            className="d-inline-block align-top"
            alt="ReadEase Logo"
          />
        </Navbar.Brand>
        <Nav>
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
