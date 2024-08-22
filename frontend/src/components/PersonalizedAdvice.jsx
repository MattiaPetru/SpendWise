import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Alert, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../AuthContext';

const PersonalizedAdvice = () => {
  const [advice, setAdvice] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { utente } = useAuth();

  useEffect(() => {
    if (utente && utente.token) {
      fetchAdvice();
    }
  }, [utente]);

  const fetchAdvice = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/advice`, {
        headers: {
          'Authorization': `Bearer ${utente.token}`
        }
      });
      if (!response.ok) {
        throw new Error('Errore nel caricamento dei consigli');
      }
      const data = await response.json();
      setAdvice(data);
    } catch (error) {
      console.error('Errore nel caricamento dei consigli:', error);
      setError('Si è verificato un errore nel caricamento dei consigli. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const highlightChanges = (text) => {
    if (!text) return '';
    const parts = text.split(/(\{.*?\})/);
    return parts.map((part, index) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        const value = part.slice(1, -1);
        return <Badge key={index} bg="warning" text="dark">{value}</Badge>;
      }
      return part;
    });
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

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (advice.length === 0) {
    return <Alert variant="info">Non ci sono consigli personalizzati al momento.</Alert>;
  }

  return (
    <Container fluid>
      <h2 className="mb-4">Consigli Personalizzati</h2>
      <Card>
        <Card.Header>I tuoi consigli per una migliore gestione finanziaria</Card.Header>
        <ListGroup variant="flush">
          {advice.map((item, index) => (
            <ListGroup.Item key={index}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                <div className="mb-2 mb-md-0">
                  <div className="fw-bold">{item.titolo}</div>
                  <div>{highlightChanges(item.descrizione)}</div>
                </div>
                <Badge 
                  bg={item.tipo === 'warning' ? 'danger' : item.tipo === 'success' ? 'success' : 'info'} 
                  className="mt-2 mt-md-0"
                >
                  {item.tipo === 'warning' ? 'Attenzione' : item.tipo === 'success' ? 'Successo' : 'Info'}
                </Badge>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </Container>
  );
};

export default PersonalizedAdvice;