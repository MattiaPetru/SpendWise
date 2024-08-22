import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Accordion, ListGroup, Alert, Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../AuthContext';

const DashboardHome = () => {
  const [categorizedExpenses, setCategorizedExpenses] = useState({});
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const { utente } = useAuth();

  const categorie = [
    'Cibo', 'Trasporti', 'Svago', 'Hobby', 'Spesa casa', 'Affitto', 'Spese ricorrenti'
  ];

  useEffect(() => {
    if (utente && utente.token) {
      fetchExpenses();
    }
  }, [utente]);

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
        acc[expense.categoria] = { spese: [], totale: 0 };
      }
      acc[expense.categoria].spese.push(expense);
      acc[expense.categoria].totale += expense.importo;
      return acc;
    }, {});
  };

  const handleEdit = (expense) => {
    setCurrentExpense(expense);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa spesa?')) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const response = await fetch(`${apiUrl}/api/spese/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${utente.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Errore nell\'eliminazione della spesa');
        }

        fetchExpenses();
      } catch (error) {
        console.error('Errore nell\'eliminazione della spesa:', error);
        setError('Si è verificato un errore nell\'eliminazione della spesa. Riprova più tardi.');
      }
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const formData = new FormData(e.target);
      const response = await fetch(`${apiUrl}/api/spese/${currentExpense._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${utente.token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Errore nell\'aggiornamento della spesa');
      }

      setShowEditModal(false);
      fetchExpenses();
    } catch (error) {
      console.error('Errore nell\'aggiornamento della spesa:', error);
      setError('Si è verificato un errore nell\'aggiornamento della spesa. Riprova più tardi.');
    }
  };

  if (!utente) {
    return <Alert variant="info">Caricamento dati utente...</Alert>;
  }

  return (
    <Container fluid className="dashboard-overview">
      <h2 className="mb-4">Benvenuto nella tua dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col>
          <Accordion defaultActiveKey="0">
            {Object.entries(categorizedExpenses).map(([category, { spese, totale }], index) => (
              <Accordion.Item eventKey={index.toString()} key={category}>
                <Accordion.Header>{category} - Totale: €{totale.toFixed(2)}</Accordion.Header>
                <Accordion.Body>
                  <ListGroup>
                    {spese.map((expense) => (
                      <ListGroup.Item key={expense._id}>
                        <Row className="align-items-center">
                          <Col xs={12} sm={6}>
                            <div>{expense.descrizione}</div>
                            <small className="text-muted">
                              {new Date(expense.data).toLocaleDateString()}
                            </small>
                          </Col>
                          <Col xs={12} sm={3} className="text-sm-end">
                            €{expense.importo.toFixed(2)}
                          </Col>
                          <Col xs={12} sm={3} className="mt-2 mt-sm-0">
                            <Button variant="outline-primary" size="sm" onClick={() => handleEdit(expense)} className="me-2">
                              Modifica
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(expense._id)}>
                              Elimina
                            </Button>
                          </Col>
                        </Row>
                        {expense.urlRicevuta && (
                          <div className="mt-2">
                            <a href={expense.urlRicevuta} target="_blank" rel="noopener noreferrer">
                              Visualizza Ricevuta
                            </a>
                          </div>
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Spesa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveEdit}>
            <Form.Group className="mb-3">
              <Form.Label>Importo</Form.Label>
              <Form.Control 
                type="number" 
                name="importo" 
                defaultValue={currentExpense?.importo} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Select
                name="categoria"
                defaultValue={currentExpense?.categoria}
                required
              >
                {categorie.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control 
                type="date" 
                name="data" 
                defaultValue={currentExpense?.data.split('T')[0]} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control 
                as="textarea" 
                name="descrizione" 
                defaultValue={currentExpense?.descrizione} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ricevuta</Form.Label>
              <Form.Control 
                type="file" 
                name="ricevuta" 
              />
            </Form.Group>
            {currentExpense?.urlRicevuta && (
              <Form.Group className="mb-3">
                <Form.Label>Ricevuta attuale</Form.Label>
                <div>
                  <a href={currentExpense.urlRicevuta} target="_blank" rel="noopener noreferrer">
                    Visualizza Ricevuta
                  </a>
                </div>
              </Form.Group>
            )}
            <Button variant="primary" type="submit">
              Salva Modifiche
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DashboardHome;