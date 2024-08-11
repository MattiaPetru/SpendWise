import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const spendingData = [
  { month: 'Gen', Alimentari: 300, Trasporti: 150, Intrattenimento: 100 },
  { month: 'Feb', Alimentari: 280, Trasporti: 170, Intrattenimento: 120 },
  { month: 'Mar', Alimentari: 320, Trasporti: 160, Intrattenimento: 90 },
  { month: 'Apr', Alimentari: 290, Trasporti: 140, Intrattenimento: 110 },
];

const AnimatedSection = ({ children, direction }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: direction === 'left' ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

const HomePage = () => {
  const [expense, setExpense] = useState({ description: '', amount: '', category: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpense(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nuova spesa:', expense);
    setExpense({ description: '', amount: '', category: '' });
  };

  return (
    <Container>
      <Row className="my-5">
        <Col>
          <h1 className="text-center mb-4">Benvenuto su SpendWise</h1>
          <p className="text-center lead">
            Prendi il controllo delle tue finanze con SpendWise, la tua soluzione completa per la gestione finanziaria personale.
          </p>
        </Col>
      </Row>

      <Row className="my-5">
        <Col md={8} className="mx-auto">
          <h2 className="text-center mb-4">Cosa offre SpendWise?</h2>
          <ul className="list-unstyled">
            <li className="mb-4">
              <h4>📊 Tracciamento delle Spese</h4>
              <p>Registra facilmente ogni tua spesa, grande o piccola. Categorizza le tue uscite per avere una visione chiara di dove va il tuo denaro.</p>
            </li>
            <li className="mb-4">
              <h4>📈 Analisi Dettagliate</h4>
              <p>Visualizza grafici e report intuitivi che ti mostrano le tue abitudini di spesa nel tempo. Identifica facilmente le aree in cui puoi risparmiare.</p>
            </li>
            <li className="mb-4">
              <h4>🎯 Gestione del Budget</h4>
              <p>Imposta obiettivi di spesa per diverse categorie e monitora i tuoi progressi. SpendWise ti aiuta a rimanere in linea con i tuoi obiettivi finanziari.</p>
            </li>
            <li className="mb-4">
              <h4>💡 Consigli Personalizzati</h4>
              <p>Ricevi suggerimenti su misura basati sulle tue abitudini di spesa per migliorare la tua salute finanziaria.</p>
            </li>
            <li className="mb-4">
              <h4>🔒 Sicurezza e Privacy</h4>
              <p>I tuoi dati finanziari sono al sicuro con noi. Utilizziamo le più recenti tecnologie di crittografia per proteggere le tue informazioni.</p>
            </li>
          </ul>
          <p className="text-center mt-5">
            Scorri verso il basso per iniziare a gestire le tue finanze in modo intelligente con SpendWise!
          </p>
        </Col>
      </Row>

      <Row className="my-5">
        <Col md={6} className="mb-4">
          <AnimatedSection direction="left">
            <Card>
              <Card.Header>Tendenze di Spesa</Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={spendingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      tickFormatter={(value) => `€${value}`}
                      label={{ value: 'Spesa (€)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip formatter={(value) => `€${value}`} />
                    <Legend />
                    <Bar dataKey="Alimentari" fill="#8884d8" />
                    <Bar dataKey="Trasporti" fill="#82ca9d" />
                    <Bar dataKey="Intrattenimento" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </AnimatedSection>
        </Col>
        <Col md={6} className="mb-4">
          <AnimatedSection direction="right">
            <Card>
              <Card.Header>Inserisci Spesa</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Descrizione</Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      value={expense.description}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Importo</Form.Label>
                    <Form.Control
                      type="number"
                      name="amount"
                      value={expense.amount}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Categoria</Form.Label>
                    <Form.Control
                      as="select"
                      name="category"
                      value={expense.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleziona una categoria</option>
                      <option value="Alimentari">Alimentari</option>
                      <option value="Trasporti">Trasporti</option>
                      <option value="Intrattenimento">Intrattenimento</option>
                      <option value="Altro">Altro</option>
                    </Form.Control>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Aggiungi Spesa
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </AnimatedSection>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;