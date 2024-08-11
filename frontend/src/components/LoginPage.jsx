import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    if (token) {
      handleGoogleLoginSuccess(token);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Si è verificato un errore durante il login. Riprova.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  const handleGoogleLoginSuccess = async (token) => {
    try {
      const result = await login(null, null, token);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Errore durante l\'accesso con Google');
      }
    } catch (error) {
      setError('Si è verificato un errore durante l\'accesso con Google. Riprova.');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}
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
                <Form.Group id="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button className="w-100" type="submit">
                  Login
                </Button>
              </Form>
              <div className="w-100 text-center mt-3">
                <Link to="/forgot-password">Password dimenticata?</Link>
              </div>
              <hr />
              <Button 
                variant="danger" 
                className="w-100" 
                onClick={handleGoogleLogin}
              >
                Accedi con Google
              </Button>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            Non hai un account? <Link to="/signup">Registrati</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;