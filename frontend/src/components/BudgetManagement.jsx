import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, ProgressBar } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useAuth } from '../AuthContext';

const BudgetManagement = () => {
  const [income, setIncome] = useState(0);
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ categoria: '', importo: '', periodo: 'mensile' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [totalSpent, setTotalSpent] = useState(0);
  const { utente } = useAuth();

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const categoriePredefinite = [
    'Cibo', 'Trasporti', 'Svago', 'Hobby', 'Spesa casa', 'Affitto', 'Spese ricorrenti', 'Altro'
  ];

  useEffect(() => {
    if (utente && utente.token) {
      fetchIncome();
      fetchBudgets();
    }
  }, [utente]);

  const fetchIncome = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/budgets/income`, {
        headers: {
          'Authorization': `Bearer ${utente.token}`
        }
      });
      if (!response.ok) {
        throw new Error('Errore nel caricamento dell\'entrata');
      }
      const data = await response.json();
      setIncome(data.income);
    } catch (error) {
      console.error('Errore nel caricamento dell\'entrata:', error);
      setError('Si è verificato un errore nel caricamento dell\'entrata. Riprova più tardi.');
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/budgets`, {
        headers: {
          'Authorization': `Bearer ${utente.token}`
        }
      });
      if (!response.ok) {
        throw new Error('Errore nel caricamento dei budget');
      }
      const data = await response.json();
      setBudgets(data);
      calculateTotalSpent(data);
    } catch (error) {
      console.error('Errore nel caricamento dei budget:', error);
      setError('Si è verificato un errore nel caricamento dei budget. Riprova più tardi.');
    }
  };

  const calculateTotalSpent = (budgetsData) => {
    const total = budgetsData.reduce((acc, budget) => acc + (budget.speso || 0), 0);
    setTotalSpent(total);
  };

  const createBudget = async (budgetData) => {
    try {
      const response = await fetch(`${apiUrl}/api/budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${utente.token}`
        },
        body: JSON.stringify(budgetData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.messaggio || 'Errore nella creazione del budget');
      }
      const data = await response.json();
      setSuccess('Budget creato con successo!');
      fetchBudgets();
    } catch (error) {
      console.error('Errore nella creazione del budget:', error);
      setError(error.message || 'Si è verificato un errore nella creazione del budget. Riprova più tardi.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget(prev => ({ ...prev, [name]: value }));
  };

  const handleIncomeChange = (e) => {
    setIncome(Number(e.target.value));
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/budgets/income`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${utente.token}`
        },
        body: JSON.stringify({ income })
      });
      if (!response.ok) {
        throw new Error('Errore nell\'aggiornamento dell\'entrata');
      }
      setSuccess('Entrata mensile aggiornata con successo!');
      fetchIncome();
    } catch (error) {
      console.error('Errore nell\'aggiornamento dell\'entrata:', error);
      setError('Si è verificato un errore nell\'aggiornamento dell\'entrata. Riprova più tardi.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    await createBudget(newBudget);
    setNewBudget({ categoria: '', importo: '', periodo: 'mensile' });
  };

  const handleDelete = async (budgetId) => {
    try {
      const response = await fetch(`${apiUrl}/api/budgets/${budgetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${utente.token}`
        }
      });
      if (!response.ok) {
        throw new Error('Errore nell\'eliminazione del budget');
      }
      setSuccess('Budget eliminato con successo!');
      fetchBudgets();
    } catch (error) {
      console.error('Errore nell\'eliminazione del budget:', error);
      setError('Si è verificato un errore nell\'eliminazione del budget. Riprova più tardi.');
    }
  };

  const calculateProgress = (budget) => {
    const spentPercentage = (budget.speso / budget.importo) * 100;
    return Math.min(spentPercentage, 100);
  };

  return (
    <Container fluid>
      <h2 className="mb-4">Gestione Budget</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Row>
        <Col xs={12} lg={6} className="mb-4">
          <Card>
            <Card.Header>Entrata Mensile</Card.Header>
            <Card.Body>
              <Form onSubmit={handleIncomeSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Importo Entrata Mensile</Form.Label>
                  <Form.Control
                    type="number"
                    value={income}
                    onChange={handleIncomeChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Aggiorna Entrata
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <Card className="mt-4">
            <Card.Header>Riepilogo Spese</Card.Header>
            <Card.Body>
              <p>Entrata Mensile: €{income.toFixed(2)}</p>
              <p>Totale Speso: €{totalSpent.toFixed(2)}</p>
              <p>Rimanente: €{(income - totalSpent).toFixed(2)}</p>
              <ProgressBar 
                now={(totalSpent / income) * 100} 
                label={`${((totalSpent / income) * 100).toFixed(2)}%`}
                variant={(totalSpent / income) > 1 ? "danger" : "success"}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={6} className="mb-4">
          <Card>
            <Card.Header>Aggiungi Nuovo Budget</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Select
                    name="categoria"
                    value={newBudget.categoria}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleziona una categoria</option>
                    {categoriePredefinite.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Importo</Form.Label>
                  <Form.Control
                    type="number"
                    name="importo"
                    value={newBudget.importo}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Periodo</Form.Label>
                  <Form.Select
                    name="periodo"
                    value={newBudget.periodo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="mensile">Mensile</option>
                    <option value="trimestrale">Trimestrale</option>
                    <option value="annuale">Annuale</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Aggiungi Budget
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Header>Budget Attuali</Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      <th>Budget</th>
                      <th>Periodo</th>
                      <th>Speso</th>
                      <th>Progresso</th>
                      <th>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgets.map((budget) => (
                      <tr key={budget._id}>
                        <td>{budget.categoria}</td>
                        <td>€{budget.importo.toFixed(2)}</td>
                        <td>{budget.periodo}</td>
                        <td>€{budget.speso ? budget.speso.toFixed(2) : '0.00'}</td>
                        <td>
                          <ProgressBar 
                            now={calculateProgress(budget)} 
                            label={`${calculateProgress(budget).toFixed(2)}%`}
                            variant={calculateProgress(budget) > 100 ? "danger" : "primary"}
                          />
                        </td>
                        <td>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(budget._id)}>
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BudgetManagement;