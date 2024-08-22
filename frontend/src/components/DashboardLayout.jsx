import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
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

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setRunTour(true);
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, []);

  const handleStartTour = () => {
    setRunTour(true);
  };

  return (
    <Container fluid className="p-0">
      <GuidedTour run={runTour} setRun={setRunTour} />
      <Row className="g-0">
        <Col md={3} lg={2} className="sidebar-wrapper" style={{ position: 'sticky', top: 0, height: '100vh' }}>
          <Sidebar />
        </Col>
        <Col md={9} lg={10} className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="bg-white shadow-sm rounded p-4" style={{ minHeight: 'calc(100vh - 2rem)' }}>
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={handleStartTour}
              className="mb-3"
            >
              Riavvia Tour Guidato
            </Button>
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
  );
};

export default DashboardLayout;