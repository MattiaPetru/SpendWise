import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
         credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reimpostata con successo. Verrai reindirizzato alla pagina di login.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Si è verificato un errore. Riprova più tardi.');
      }
    } catch (error) {
      console.error('Errore nella richiesta di reset password:', error);
      setError('Si è verificato un errore di rete. Riprova più tardi.');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Reimposta Password</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group id="new-password" className="mb-3">
                  <Form.Label>Nuova Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button className="w-100" type="submit">
                  Reimposta Password
                </Button>
              </Form>
              <div className="w-100 text-center mt-3">
                <Link to="/login">Torna al Login</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPasswordPage;