import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../AuthContext';

const AddExpense = () => {
  const [importo, setImporto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [data, setData] = useState(''); // Nuovo stato per la data
  const [ricevuta, setRicevuta] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { utente } = useAuth();

  const categorie = [
    'Cibo',
    'Trasporti',
    'Svago',
    'Hobby',
    'Spesa casa',
    'Affitto',
    'Spese ricorrenti'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const formData = new FormData();
    formData.append('importo', importo);
    formData.append('categoria', categoria);
    formData.append('descrizione', descrizione);
    formData.append('data', data); // Aggiungiamo la data al FormData
    if (ricevuta) {
      formData.append('ricevuta', ricevuta);
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/spese`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${utente.token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Errore nel salvataggio della spesa');
      }

      setSuccess(true);
      setImporto('');
      setCategoria('');
      setDescrizione('');
      setData('');
      setRicevuta(null);
    } catch (error) {
      console.error('Errore nel salvataggio della spesa:', error);
      setError('Si è verificato un errore nel salvataggio della spesa. Riprova più tardi.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Aggiungi una nuova spesa</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Spesa aggiunta con successo!</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Importo</Form.Label>
        <Form.Control 
          type="number" 
          value={importo} 
          onChange={(e) => setImporto(e.target.value)} 
          required 
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Categoria</Form.Label>
        <Form.Select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        >
          <option value="">Seleziona una categoria</option>
          {categorie.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Data</Form.Label>
        <Form.Control 
          type="date" 
          value={data} 
          onChange={(e) => setData(e.target.value)} 
          required 
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Descrizione</Form.Label>
        <Form.Control 
          as="textarea" 
          rows={3} 
          value={descrizione} 
          onChange={(e) => setDescrizione(e.target.value)} 
          required 
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Ricevuta (opzionale)</Form.Label>
        <Form.Control 
          type="file" 
          onChange={(e) => setRicevuta(e.target.files[0])} 
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Aggiungi Spesa
      </Button>
    </Form>
  );
};

export default AddExpense;