import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, ProgressBar, Spinner } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useAuth } from '../AuthContext';

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ categoria: '', importo: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const { utente } = useAuth();

  const categoriePredefinite = [
    'Cibo', 'Trasporti', 'Svago', 'Hobby', 'Spesa casa', 'Affitto', 'Spese ricorrenti', 'Altro'
  ];

  useEffect(() => {
    if (utente && utente.token) {
      fetchBudgets();
    }
  }, [utente]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
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
    } catch (error) {
      console.error('Errore nel caricamento dei budget:', error);
      setError('Si è verificato un errore nel caricamento dei budget. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${utente.token}`
        },
        body: JSON.stringify(newBudget)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.messaggio || 'Errore nella creazione del budget');
      }
      setSuccess('Budget creato con successo!');
      fetchBudgets();
      setNewBudget({ categoria: '', importo: '' });
    } catch (error) {
      console.error('Errore nella creazione del budget:', error);
      setError(error.message || 'Si è verificato un errore nella creazione del budget. Riprova più tardi.');
    }
  };

  const handleDelete = async (budgetId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
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

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{height: '300px'}}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid>
      <h2 className="mb-4">Gestione Budget</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Row>
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
                <Button variant="primary" type="submit">
                  Aggiungi Budget
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card>
            <Card.Header>Budget Attuali</Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      <th>Budget</th>
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
                        <td>€{budget.speso ? budget.speso.toFixed(2) : '0.00'}</td>
                        <td>
                          <ProgressBar 
                            now={budget.speso ? (budget.speso / budget.importo) * 100 : 0} 
                            label={`${budget.speso ? ((budget.speso / budget.importo) * 100).toFixed(2) : 0}%`}
                            variant={budget.speso > budget.importo ? "danger" : "primary"}
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