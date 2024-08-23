import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaPlus, FaList, FaChartBar, FaPiggyBank, FaLightbulb, FaBars } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isTourActive }) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome, className: 'dashboard-overview' },
    { path: '/dashboard/add-expense', label: 'Aggiungi Spesa', icon: FaPlus, className: 'add-expense-button' },
    { path: '/dashboard/expenses', label: 'Visualizza Spese', icon: FaList, className: 'view-expenses-link' },
    { path: '/dashboard/analytics', label: 'Analisi', icon: FaChartBar, className: 'analytics-link' },
    { path: '/dashboard/budget', label: 'Gestione Budget', icon: FaPiggyBank, className: 'budget-management-link' },
    { path: '/dashboard/advice', label: 'Consigli Personalizzati', icon: FaLightbulb, className: 'personalized-advice-link' },
  ];

  const handleClick = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      setExpanded(false);
    }
  };

  const toggleExpanded = (e) => {
    if (!isTourActive) {
      e.stopPropagation();
      setExpanded(!expanded);
    }
  };

  useEffect(() => {
    setExpanded(false);
  }, [location, isTourActive]);

  return (
    <div 
      className={`sidebar ${expanded && !isTourActive ? 'expanded' : ''}`} 
      onMouseEnter={() => !isTourActive && window.innerWidth > 768 && setExpanded(true)}
      onMouseLeave={() => !isTourActive && window.innerWidth > 768 && setExpanded(false)}
    >
      <div className="sidebar-toggle" onClick={toggleExpanded}>
        <FaBars />
      </div>
      <Nav className="flex-column">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={item.path}
            onClick={(e) => {
              e.preventDefault();
              handleClick(item.path);
            }}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''} ${item.className}`}
          >
            <item.icon className="sidebar-icon" />
            <span className="sidebar-label">{item.label}</span>
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;