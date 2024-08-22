import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const linkStyle = {
    color: '#333',
    padding: '0.75rem 1rem',
    textDecoration: 'none',
    display: 'block',
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#e9ecef',
  };

  return (
    <div className="h-100 d-flex flex-column">
      <h3 className="text-center py-4">SpendWise</h3>
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
      <div className="mt-auto text-center p-3">
        <small>&copy; 2024 SpendWise</small>
      </div>
    </div>
  );
};

export default Sidebar;