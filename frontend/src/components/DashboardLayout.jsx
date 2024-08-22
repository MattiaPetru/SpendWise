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
    <div className="d-flex flex-column flex-md-row">
      <GuidedTour run={runTour} setRun={setRunTour} />
      <div className={`sidebar-wrapper ${showSidebar ? 'd-block' : 'd-none d-md-block'}`} style={{ width: '250px', position: 'fixed', top: '56px', bottom: 0, left: 0, overflowY: 'auto', backgroundColor: '#212529', zIndex: 1000 }}>
        <Sidebar />
      </div>
      <div style={{ marginLeft: 0, marginTop: '56px', width: '100%', transition: 'margin-left 0.3s' }} className="flex-grow-1 p-3 p-md-4">
        <Container fluid>
          <Row className="mb-3">
            <Col>
              <Button 
                variant="primary" 
                className="d-md-none me-2"
                onClick={toggleSidebar}
              >
                {showSidebar ? 'Nascondi Menu' : 'Mostra Menu'}
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={handleStartTour}
              >
                Riavvia Tour Guidato
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="bg-white shadow-sm rounded p-3 p-md-4">
                <Routes>
                  <Route path="/" element={<DashboardHome />} />
                  <Route path="/add-expense" element={<AddExpense />} />
                  <Route path="/expenses" element={<ViewExpenses />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/budget" element={<BudgetManagement />} />
                  <Route path="/advice" element={<PersonalizedAdvice />} />
                </Routes>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default DashboardLayout;