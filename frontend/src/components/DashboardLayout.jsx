import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import AddExpense from './AddExpense';
import ViewExpenses from './ViewExpenses';
import Analytics from './Analytics';
import BudgetManagement from './BudgetManagement';
import PersonalizedAdvice from './PersonalizedAdvice';
import GuidedTour from './GuidedTour';

const DashboardLayout = () => {
  const [runTour, setRunTour] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setRunTour(true);
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, []);

  useEffect(() => {
    setShowSidebar(false);
  }, [location]);

  const handleStartTour = () => {
    setRunTour(true);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="d-flex">
      <GuidedTour run={runTour} setRun={setRunTour} />
      <div className={`sidebar-wrapper ${showSidebar ? 'd-block' : 'd-none d-md-block'}`} style={{ width: '250px', position: 'fixed', top: '56px', bottom: 0, left: 0, overflowY: 'auto', backgroundColor: '#343a40', zIndex: 1000 }}>
        <Sidebar />
      </div>
      <div style={{ marginLeft: '250px', width: 'calc(100% - 250px)', paddingTop: '56px' }}>
        <Container fluid className="p-4">
          <Button 
            variant="primary" 
            className="d-md-none mb-3" 
            onClick={toggleSidebar}
          >
            {showSidebar ? 'Nascondi Menu' : 'Mostra Menu'}
          </Button>
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={handleStartTour}
            className="mb-3 ms-2"
          >
            Riavvia Tour Guidato
          </Button>
          <div className="bg-white shadow-sm rounded p-4 dashboard-overview">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/add-expense" element={<AddExpense />} />
              <Route path="/expenses" element={<ViewExpenses />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/budget" element={<BudgetManagement />} />
              <Route path="/advice" element={<PersonalizedAdvice />} />
            </Routes>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default DashboardLayout;