import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import NavbarComponent from './components/NavbarComponent';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './components/DashboardHome'; 
import AddExpense from './components/AddExpense';
import ViewExpenses from './components/ViewExpenses';
import Analytics from './components/Analytics';
import BudgetManagement from './components/BudgetManagement';
import PersonalizedAdvice from './components/PersonalizedAdvice';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard/*" element={
            <PrivateRoute>
              <DashboardLayout>
                <Routes>
                  <Route index element={<DashboardHome />} /> {/* Modificato qui */}
                  <Route path="add-expense" element={<AddExpense />} />
                  <Route path="expenses" element={<ViewExpenses />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="/budget" element={<BudgetManagement />} />
                  <Route path="/advice" element={<PersonalizedAdvice />} />
                </Routes>
              </DashboardLayout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default App;


