
import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Accordion } from 'react-bootstrap';
import { useAuth } from '../AuthContext';

const CategoryExpenses = () => {
  const [categorizedExpenses, setCategorizedExpenses] = useState({});
  const [error, setError] = useState('');
  const { utente } = useAuth();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/spese`, {
        headers: {
          'Authorization': `Bearer ${utente.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Errore nel caricamento delle spese');
      }

      const data = await response.json();
      const grouped = groupExpensesByCategory(data);
      setCategorizedExpenses(grouped);
    } catch (error) {
      console.error('Errore nel caricamento delle spese:', error);
      setError('Si è verificato un errore nel caricamento delle spese. Riprova più tardi.');
    }
  };

  const groupExpensesByCategory = (expenses) => {
    return expenses.reduce((acc, expense) => {
      if (!acc[expense.categoria]) {
        acc[expense.categoria] = [];
      }
      acc[expense.categoria].push(expense);
      return acc;
    }, {});
  };

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Accordion defaultActiveKey="0">
      {Object.entries(categorizedExpenses).map(([category, expenses], index) => (
        <Accordion.Item eventKey={index.toString()} key={category}>
          <Accordion.Header>{category}</Accordion.Header>
          <Accordion.Body>
            <ListGroup>
              {expenses.map((expense) => (
                <ListGroup.Item key={expense._id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{expense.descrizione}</span>
                    <span>€{expense.importo.toFixed(2)}</span>
                  </div>
                  <small className="text-muted">
                    {new Date(expense.data).toLocaleDateString()}
                  </small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default CategoryExpenses;