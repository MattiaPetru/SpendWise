import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const sidebarStyle = {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    height: '100%',
    padding: '1rem',
  };

  const linkStyle = {
    color: '#ffffff',
    padding: '0.75rem 1rem',
    marginBottom: '0.5rem',
    borderRadius: '0.25rem',
    transition: 'all 0.3s ease',
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#3a3a3a',
    position: 'relative',
  };

  const getActiveLinkBefore = (isActive) => {
    return isActive ? {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      width: '4px',
      backgroundColor: '#007bff',
      borderTopLeftRadius: '0.25rem',
      borderBottomLeftRadius: '0.25rem',
    } : {};
  };

  return (
    <div style={sidebarStyle} className="d-flex flex-column justify-content-between">
      <div>
        <h3 className="text-light text-center mb-4">SpendWise</h3>
        <Nav className="flex-column">
          {[
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/dashboard/add-expense', label: 'Aggiungi Spesa' },
            { path: '/dashboard/expenses', label: 'Visualizza Spese' },
            { path: '/dashboard/analytics', label: 'Analisi' },
            { path: '/dashboard/budget', label: 'Gestione Budget' }, // Nuova voce
            { path: '/dashboard/advice', label: 'Consigli Personalizzati' }, // Nuova voce
          ].map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                style={isActive ? activeLinkStyle : linkStyle}
                className="position-relative"
              >
                {item.label}
                <div style={getActiveLinkBefore(isActive)} />
              </Nav.Link>
            );
          })}
        </Nav>
      </div>
      <div className="text-center text-light">
        <small>&copy; 2024 SpendWise</small>
      </div>
    </div>
  );
};

export default Sidebar;