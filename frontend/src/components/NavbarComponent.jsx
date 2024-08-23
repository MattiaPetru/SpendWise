import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const NavbarComponent = () => {
  const { utente, logout } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!utente);
  }, [utente]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  const navContent = (
    <>
      <Nav.Link as={Link} to="/" onClick={handleClose}>Home</Nav.Link>
      {isAuthenticated ? (
        <>
          <Nav.Link as={Link} to="/dashboard" onClick={handleClose}>Dashboard</Nav.Link>
          <Nav.Link onClick={() => { handleClose(); handleLogout(); }}>Logout</Nav.Link>
        </>
      ) : (
        <>
          <Nav.Link as={Link} to="/login" onClick={handleClose}>Login</Nav.Link>
          <Nav.Link as={Link} to="/register" onClick={handleClose}>Registrati</Nav.Link>
        </>
      )}
    </>
  );

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">SpendWise</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleShow} className="d-lg-none" />
        <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
          <Nav className="ms-auto">
            {navContent}
          </Nav>
        </Navbar.Collapse>
        <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end" className="d-lg-none bg-dark text-light">
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              {navContent}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;