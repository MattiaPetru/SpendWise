import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../AuthContext';

const ViewExpenses = () => {
  const [spese, setSpese] = useState([]);
  const [filteredSpese, setFilteredSpese] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { utente } = useAuth();

  const [filters, setFilters] = useState({
    data: '',
    categoria: '',
    importoMin: '',
    importoMax: '',
    descrizione: ''
  });

  useEffect(() => {
    fetchSpese();
  }, []);

  const fetchSpese = async () => {
    try {
      setLoading(true);
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
      setSpese(data);
      setFilteredSpese(data);
    } catch (error) {
      console.error('Errore nel caricamento delle spese:', error);
      setError('Si è verificato un errore nel caricamento delle spese. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let filtered = spese;

    if (filters.data) {
      filtered = filtered.filter(spesa => spesa.data.startsWith(filters.data));
    }
    if (filters.categoria) {
      filtered = filtered.filter(spesa => spesa.categoria === filters.categoria);
    }
    if (filters.importoMin) {
      filtered = filtered.filter(spesa => spesa.importo >= parseFloat(filters.importoMin));
    }
    if (filters.importoMax) {
      filtered = filtered.filter(spesa => spesa.importo <= parseFloat(filters.importoMax));
    }
    if (filters.descrizione) {
      filtered = filtered.filter(spesa => 
        spesa.descrizione.toLowerCase().includes(filters.descrizione.toLowerCase())
      );
    }

    setFilteredSpese(filtered);
  };

  const resetFilters = () => {
    setFilters({
      data: '',
      categoria: '',
      importoMin: '',
      importoMax: '',
      descrizione: ''
    });
    setFilteredSpese(spese);
  };

  if (loading) {
    return <Alert variant="info">Caricamento spese in corso...</Alert>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container fluid>
      <h2 className="mb-4">Visualizza Spese</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row>
              <Col xs={12} sm={6} md={4} lg={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Data</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="data"
                    value={filters.data} 
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={4} lg={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Categoria</Form.Label>
                  <Form.Select 
                    name="categoria"
                    value={filters.categoria} 
                    onChange={handleFilterChange}
                  >
                    <option value="">Tutte le categorie</option>
                    <option value="Cibo">Cibo</option>
                    <option value="Trasporti">Trasporti</option>
                    <option value="Svago">Svago</option>
                    <option value="Hobby">Hobby</option>
                    <option value="Spesa casa">Spesa casa</option>
                    <option value="Affitto">Affitto</option>
                    <option value="Spese ricorrenti">Spese ricorrenti</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={4} lg={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Importo Min</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="importoMin"
                    value={filters.importoMin} 
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={4} lg={2} className="mb-3">
                <Form.Group>
                  <Form.Label>Importo Max</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="importoMax"
                    value={filters.importoMax} 
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={8} lg={4} className="mb-3">
                <Form.Group>
                  <Form.Label>Descrizione</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="descrizione"
                    value={filters.descrizione} 
                    onChange={handleFilterChange}
                    placeholder="Cerca nella descrizione"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-end">
                <Button variant="primary" onClick={applyFilters} className="me-2">Applica Filtri</Button>
                <Button variant="secondary" onClick={resetFilters}>Resetta Filtri</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Data</th>
              <th>Categoria</th>
              <th>Importo</th>
              <th>Descrizione</th>
            </tr>
          </thead>
          <tbody>
            {filteredSpese.map(spesa => (
              <tr key={spesa._id}>
                <td>{new Date(spesa.data).toLocaleDateString()}</td>
                <td>{spesa.categoria}</td>
                <td>€{spesa.importo.toFixed(2)}</td>
                <td>{spesa.descrizione}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default ViewExpenses;