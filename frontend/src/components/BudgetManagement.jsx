import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, ProgressBar, Modal } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useAuth } from '../AuthContext';

const BudgetManagement = () => {
  const [incomes, setIncomes] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [newIncome, setNewIncome] = useState(0);
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ categoria: '', importo: '', periodo: 'mensile' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [totalSpent, setTotalSpent] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const { utente } = useAuth();

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const categoriePredefinite = [
    'Cibo', 'Trasporti', 'Svago', 'Hobby', 'Spesa casa', 'Affitto', 'Spese ricorrenti', 'Altro'
  ];

  const fetchIncomes = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/budgets/income`, {
        headers: { 'Authorization': `Bearer ${utente.token}` }
      });
      if (!response.ok) throw new Error('Errore nel caricamento delle entrate');
      const data = await response.json();
      setIncomes(data);
      const currentMonthIncome = data.find(inc => inc.mese === selectedMonth)?.importo || 0;
      setNewIncome(currentMonthIncome);
    } catch (error) {
      setError('Errore nel caricamento delle entrate: ' + error.message);
    }
  }, [apiUrl, utente.token, selectedMonth]);

  const fetchBudgets = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/budgets?mese=${selectedMonth}`, {
        headers: { 'Authorization': `Bearer ${utente.token}` }
      });
      if (!response.ok) throw new Error('Errore nel caricamento dei budget');
      const data = await response.json();
      setBudgets(data);
      calculateTotalSpent(data);
    } catch (error) {
      setError('Errore nel caricamento dei budget: ' + error.message);
    }
  }, [apiUrl, utente.token, selectedMonth]);

  useEffect(() => {
    if (utente && utente.token) {
      fetchIncomes();
      fetchBudgets();
    }
  }, [utente, selectedMonth, fetchIncomes, fetchBudgets]);

  const calculateTotalSpent = (budgetsData) => {
    const total = budgetsData.reduce((acc, budget) => acc + (budget.speso || 0), 0);
    setTotalSpent(total);
  };

  const handleInputChange = (e, setFunction) => {
    const { name, value } = e.target;
    setFunction(prev => ({ ...prev, [name]: value }));
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
        body: JSON.stringify({ importo: newIncome, mese: selectedMonth })
      });
      if (!response.ok) throw new Error('Errore nell\'aggiornamento dell\'entrata');
      setSuccess('Entrata mensile aggiornata con successo!');
      fetchIncomes();
    } catch (error) {
      setError('Errore nell\'aggiornamento dell\'entrata: ' + error.message);
    }
  };

  const handleBudgetSubmit = async (e, budget, isNew = true) => {
    e.preventDefault();
    try {
      const url = isNew ? `${apiUrl}/api/budgets` : `${apiUrl}/api/budgets/${budget._id}`;
      const method = isNew ? 'POST' : 'PUT';
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${utente.token}`
        },
        body: JSON.stringify({ ...budget, mese: selectedMonth })
      });
      if (!response.ok) throw new Error(isNew ? 'Errore nella creazione del budget' : 'Errore nell\'aggiornamento del budget');
      setSuccess(isNew ? 'Budget creato con successo!' : 'Budget aggiornato con successo!');
      fetchBudgets();
      if (!isNew) setShowEditModal(false);
    } catch (error) {
      setError(`Errore ${isNew ? 'nella creazione' : 'nell\'aggiornamento'} del budget: ${error.message}`);
    }
  };

  const handleDelete = async (budgetId) => {
    try {
      const response = await fetch(`${apiUrl}/api/budgets/${budgetId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${utente.token}` }
      });
      if (!response.ok) throw new Error('Errore nell\'eliminazione del budget');
      setSuccess('Budget eliminato con successo!');
      fetchBudgets();
    } catch (error) {
      setError('Errore nell\'eliminazione del budget: ' + error.message);
    }
  };

  const calculateProgress = (budget) => {
    const spentPercentage = (budget.speso / budget.importo) * 100;
    return spentPercentage;
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
                  <Form.Label>Seleziona Mese</Form.Label>
                  <Form.Control
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      fetchIncomes();
                      fetchBudgets();
                    }}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Importo Entrata Mensile</Form.Label>
                  <Form.Control
                    type="number"
                    value={newIncome}
                    onChange={(e) => setNewIncome(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">Aggiorna Entrata</Button>
              </Form>
            </Card.Body>
          </Card>
          <Card className="mt-4">
            <Card.Header>Riepilogo Spese</Card.Header>
            <Card.Body>
              <p>Entrata Mensile: €{newIncome.toFixed(2)}</p>
              <p>Totale Speso: €{totalSpent.toFixed(2)}</p>
              <p>Rimanente: €{(newIncome - totalSpent).toFixed(2)}</p>
              <ProgressBar 
                now={(totalSpent / newIncome) * 100} 
                label={`${((totalSpent / newIncome) * 100).toFixed(2)}%`}
                variant={(totalSpent / newIncome) > 1 ? "danger" : "success"}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={6} className="mb-4">
          <Card>
            <Card.Header>Aggiungi Nuovo Budget per {new Date(selectedMonth).toLocaleString('it-IT', { month: 'long', year: 'numeric' })}</Card.Header>
            <Card.Body>
              <Form onSubmit={(e) => handleBudgetSubmit(e, newBudget)}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Select
                    name="categoria"
                    value={newBudget.categoria}
                    onChange={(e) => handleInputChange(e, setNewBudget)}
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
                    onChange={(e) => handleInputChange(e, setNewBudget)}
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
                    onChange={(e) => handleInputChange(e, setNewBudget)}
                    required
                  >
                    <option value="mensile">Mensile</option>
                    <option value="trimestrale">Trimestrale</option>
                    <option value="annuale">Annuale</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit">Aggiungi Budget</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Header>Riepilogo Budget</Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Mese</th>
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
                        <td>{new Date(budget.mese).toLocaleString('it-IT', { month: 'long', year: 'numeric' })}</td>
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
                          {calculateProgress(budget) > 100 && (
                            <small className="text-danger">
                              Superato del {(calculateProgress(budget) - 100).toFixed(2)}%
                            </small>
                          )}
                        </td>
                        <td>
                          <Button variant="primary" size="sm" onClick={() => { setEditingBudget(budget); setShowEditModal(true); }} className="me-2">
                            <FaEdit />
                          </Button>
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
  
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingBudget && (
            <Form onSubmit={(e) => handleBudgetSubmit(e, editingBudget, false)}>
              <Form.Group className="mb-3">
                <Form.Label>Categoria</Form.Label>
                <Form.Select
                  name="categoria"
                  value={editingBudget.categoria}
                  onChange={(e) => handleInputChange(e, setEditingBudget)}
                  required
                >
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
                  value={editingBudget.importo}
                  onChange={(e) => handleInputChange(e, setEditingBudget)}
                  required
                  min="0"
                  step="0.01"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Periodo</Form.Label>
                <Form.Select
                  name="periodo"
                  value={editingBudget.periodo}
                  onChange={(e) => handleInputChange(e, setEditingBudget)}
                  required
                >
                  <option value="mensile">Mensile</option>
                  <option value="trimestrale">Trimestrale</option>
                  <option value="annuale">Annuale</option>
                </Form.Select>
              </Form.Group>
              <Button variant="primary" type="submit">
                Salva Modifiche
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default BudgetManagement;