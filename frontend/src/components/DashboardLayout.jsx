import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import AddExpense from './AddExpense';
import ViewExpenses from './ViewExpenses';
import Analytics from './Analytics';
import BudgetManagement from './BudgetManagement';
import PersonalizedAdvice from './PersonalizedAdvice';
import GuidedTour from './GuidedTour';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [runTour, setRunTour] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setRunTour(true);
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, []);

  useEffect(() => {
    if (runTour) {
      document.body.classList.add('joyride-tour-active');
    } else {
      document.body.classList.remove('joyride-tour-active');
    }
  }, [runTour]);

  const handleStartTour = () => {
    setRunTour(true);
  };

  return (
    <div className="dashboard-layout">
      <GuidedTour run={runTour} setRun={setRunTour} />
      <Sidebar />
      <div className="dashboard-content">
        <Container fluid className="py-3">
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={handleStartTour}
            className="mb-3"
          >
            Riavvia Tour Guidato
          </Button>
          <div className="bg-white shadow-sm rounded p-3">
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