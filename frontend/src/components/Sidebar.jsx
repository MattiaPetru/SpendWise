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
    display: 'flex',
    flexDirection: 'column',
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
  };

  return (
    <div style={sidebarStyle}>
      <div>
        <h3 className="text-light text-center mb-4">SpendWise</h3>
        <Nav className="flex-column">
          {[
            { path: '/dashboard', label: 'Dashboard', className: 'dashboard-overview' },
            { path: '/dashboard/add-expense', label: 'Aggiungi Spesa', className: 'add-expense-button' },
            { path: '/dashboard/expenses', label: 'Visualizza Spese', className: 'view-expenses-link' },
            { path: '/dashboard/analytics', label: 'Analisi', className: 'analytics-link' },
            { path: '/dashboard/budget', label: 'Gestione Budget', className: 'budget-management-link' },
            { path: '/dashboard/advice', label: 'Consigli Personalizzati', className: 'personalized-advice-link' },
          ].map((item) => (
            <Nav.Link
              key={item.path}
              as={Link}
              to={item.path}
              style={location.pathname === item.path ? activeLinkStyle : linkStyle}
              className={`${item.className}`}
            >
              {item.label}
            </Nav.Link>
          ))}
        </Nav>
      </div>
      <div className="mt-auto text-center text-light">
        <small>&copy; 2024 SpendWise</small>
      </div>
    </div>
  );
};

export default Sidebar;