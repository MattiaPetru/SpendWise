import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaPlus, FaList, FaChartBar, FaPiggyBank, FaLightbulb } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const linkStyle = {
    color: '#ffffff',
    padding: '0.75rem 1rem',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#1a1e21',
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome, className: 'dashboard-overview' },
    { path: '/dashboard/add-expense', label: 'Aggiungi Spesa', icon: FaPlus, className: 'add-expense-button' },
    { path: '/dashboard/expenses', label: 'Visualizza Spese', icon: FaList, className: 'view-expenses-link' },
    { path: '/dashboard/analytics', label: 'Analisi', icon: FaChartBar, className: 'analytics-link' },
    { path: '/dashboard/budget', label: 'Gestione Budget', icon: FaPiggyBank, className: 'budget-management-link' },
    { path: '/dashboard/advice', label: 'Consigli Personalizzati', icon: FaLightbulb, className: 'personalized-advice-link' },
  ];

  return (
    <div className="h-100 d-flex flex-column">
      <h3 className="text-center py-4 text-light">SpendWise</h3>
      <Nav className="flex-column">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={item.path}
            style={location.pathname === item.path ? activeLinkStyle : linkStyle}
            className={`${item.className}`}
          >
            <item.icon className="me-2" />
            {item.label}
          </Nav.Link>
        ))}
      </Nav>
      <div className="mt-auto text-center p-3 text-light">
        <small>&copy; 2024 SpendWise</small>
      </div>
    </div>
  );
};

export default Sidebar;