import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const errorParam = urlParams.get('error');

    if (token) {
      handleGoogleLoginSuccess(token);
    } else if (errorParam) {
      handleGoogleLoginError(errorParam);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login fallito. Riprova.');
      }
    } catch (error) {
      console.error('Errore durante il login:', error);
      setError('Si è verificato un errore durante il login. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  const handleGoogleLoginSuccess = async (token) => {
    setLoading(true);
    try {
      const result = await login(null, null, token);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Errore durante l\'accesso con Google');
      }
    } catch (error) {
      console.error('Errore durante l\'accesso con Google:', error);
      setError('Si è verificato un errore durante l\'accesso con Google. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = (errorParam) => {
    switch (errorParam) {
      case 'auth_failed':
        setError('Autenticazione Google fallita. Riprova.');
        break;
      case 'token_generation_failed':
        setError('Errore nella generazione del token. Riprova.');
        break;
      default:
        setError('Si è verificato un errore durante l\'accesso con Google. Riprova.');
    }
  };

  return (
    <Container fluid className="py-5 bg-light">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="shadow">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4">Accedi a SpendWise</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <InputGroup>
                    <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Inserisci la tua email"
                      required
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-4">
                  <InputGroup>
                    <InputGroup.Text><FaLock /></InputGroup.Text>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Inserisci la tua password"
                      required
                    />
                  </InputGroup>
                </Form.Group>
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Accesso in corso...' : 'Accedi'}
                </Button>
              </Form>
              <div className="text-center mb-3">
                <small>oppure</small>
              </div>
              <Button 
                variant="outline-danger" 
                className="w-100 mb-3"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <FaGoogle className="me-2" />
                Accedi con Google
              </Button>
              <div className="text-center mt-3">
                <p className="mb-0">Non hai un account?</p>
                <Link to="/register">Registrati qui</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;