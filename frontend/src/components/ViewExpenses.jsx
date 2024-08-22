import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../AuthContext';

const ViewExpenses = () => {
  const [spese, setSpese] = useState([]);
  const [filteredSpese, setFilteredSpese] = useState([]);
  const [error, setError] = useState('');
  const { utente } = useAuth();

  // Stati per i filtri
  const [dataFilter, setDataFilter] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [importoMinFilter, setImportoMinFilter] = useState('');
  const [importoMaxFilter, setImportoMaxFilter] = useState('');
  const [descrizioneFilter, setDescrizioneFilter] = useState('');

  useEffect(() => {
    fetchSpese();
  }, []);

  const fetchSpese = async () => {
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
      setSpese(data);
      setFilteredSpese(data);
    } catch (error) {
      console.error('Errore nel caricamento delle spese:', error);
      setError('Si è verificato un errore nel caricamento delle spese. Riprova più tardi.');
    }
  };

  const applyFilters = () => {
    let filtered = spese;

    if (dataFilter) {
      filtered = filtered.filter(spesa => spesa.data.startsWith(dataFilter));
    }

    if (categoriaFilter) {
      filtered = filtered.filter(spesa => spesa.categoria === categoriaFilter);
    }

    if (importoMinFilter) {
      filtered = filtered.filter(spesa => spesa.importo >= parseFloat(importoMinFilter));
    }

    if (importoMaxFilter) {
      filtered = filtered.filter(spesa => spesa.importo <= parseFloat(importoMaxFilter));
    }

    if (descrizioneFilter) {
      filtered = filtered.filter(spesa => 
        spesa.descrizione.toLowerCase().includes(descrizioneFilter.toLowerCase())
      );
    }

    setFilteredSpese(filtered);
  };

  const resetFilters = () => {
    setDataFilter('');
    setCategoriaFilter('');
    setImportoMinFilter('');
    setImportoMaxFilter('');
    setDescrizioneFilter('');
    setFilteredSpese(spese);
  };

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container fluid>
      <h2 className="mb-4">Visualizza Spese</h2>
      
      <Form className="mb-4">
        <Row>
          <Col xs={12} sm={6} md={4} lg={3} className="mb-3">
            <Form.Group>
              <Form.Label>Data</Form.Label>
              <Form.Control 
                type="date" 
                value={dataFilter} 
                onChange={(e) => setDataFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3} className="mb-3">
            <Form.Group>
              <Form.Label>Categoria</Form.Label>
              <Form.Select 
                value={categoriaFilter} 
                onChange={(e) => setCategoriaFilter(e.target.value)}
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
          <Col xs={12} sm={6} md={4} lg={3} className="mb-3">
            <Form.Group>
              <Form.Label>Importo Min</Form.Label>
              <Form.Control 
                type="number" 
                value={importoMinFilter} 
                onChange={(e) => setImportoMinFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3} className="mb-3">
            <Form.Group>
              <Form.Label>Importo Max</Form.Label>
              <Form.Control 
                type="number" 
                value={importoMaxFilter} 
                onChange={(e) => setImportoMaxFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Descrizione</Form.Label>
              <Form.Control 
                type="text" 
                value={descrizioneFilter} 
                onChange={(e) => setDescrizioneFilter(e.target.value)}
                placeholder="Cerca nella descrizione"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6} className="d-flex align-items-end mb-3">
            <Button variant="primary" onClick={applyFilters} className="me-2">Applica Filtri</Button>
            <Button variant="secondary" onClick={resetFilters}>Resetta Filtri</Button>
          </Col>
        </Row>
      </Form>

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