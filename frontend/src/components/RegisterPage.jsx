import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const RegisterPage = () => {
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register(nome, cognome, email, password);
    if (result.success) {
      navigate('/login');
    } else {
      if (result.error === 'Email già registrata') {
        setError('Questa email è già stata registrata. Prova ad accedere o usa un altra email.');
      } else {
        setError(result.error || 'Registrazione fallita. Riprova.');
      }
    }
  };


  return (
    <Form onSubmit={handleSubmit}>
      <h2>Registrazione</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group>
        <Form.Label>Nome</Form.Label>
        <Form.Control
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Cognome</Form.Label>
        <Form.Control
          type="text"
          value={cognome}
          onChange={(e) => setCognome(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Registrati
      </Button>
    </Form>
  );
};

export default RegisterPage;