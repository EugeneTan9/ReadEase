import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavigationBar() 
{
  return(
    <Navbar style={{backgroundColor: '#0C090A'}} data-bs-theme="dark" className="ps-4">
    <div className="navbar-container">
      <Navbar.Brand href="#home">
        <img
          src="/ASP_logo.png"
          width="120"
          height="60"
          className="d-inline-block align-top"
          alt="ReadEase Logo"
        />
      </Navbar.Brand>
      <Nav>
      < Nav.Link href="#feedback" className="navbar-feedback">
          Feedback
        </Nav.Link>
      </Nav>
    </div>
  </Navbar>
  );
}

export default NavigationBar;
