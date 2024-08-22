import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Alert, Spinner } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../AuthContext';

const COLORS = {
  'Cibo': '#FF6384',
  'Trasporti': '#36A2EB',
  'Svago': '#FFCE56',
  'Hobby': '#4BC0C0',
  'Spesa casa': '#9966FF',
  'Affitto': '#FF9F40',
  'Spese ricorrenti': '#FF6384',
  'Altro': '#C9CBCF'
};

const Analytics = () => {
  const [chartType, setChartType] = useState('mensile');
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { utente } = useAuth();

  useEffect(() => {
    if (utente && utente.token) {
      fetchData();
    }
  }, [chartType, utente]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      let endpoint = `/api/spese/${chartType}`;

      const response = await fetch(`${apiUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${utente.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
      setError('Si è verificato un errore nel caricamento dei dati. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  const getXAxisLabel = () => {
    switch(chartType) {
      case 'mensile': return 'Mese';
      case 'trimestrale': return 'Trimestre';
      case 'annuale': return 'Anno';
      default: return '';
    }
  };

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="_id" label={{ value: getXAxisLabel(), position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Importo (€)', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
        <Legend />
        {Object.keys(chartData[0] || {}).filter(key => key !== '_id').map((key) => (
          <Bar key={key} dataKey={key} fill={COLORS[key] || COLORS['Altro']} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => {
    const pieData = chartData.reduce((acc, item) => {
      Object.entries(item).forEach(([key, value]) => {
        if (key !== '_id') {
          if (!acc[key]) acc[key] = 0;
          acc[key] += value;
        }
      });
      return acc;
    }, {});

    const pieChartData = Object.entries(pieData).map(([name, value]) => ({ name, value }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS['Altro']} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
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

  return (
    <Container fluid>
      <h2 className="mb-4">Analisi Spese</h2>
      <Row className="mb-4">
        <Col xs={12} sm={6} md={4} lg={3}>
          <Form.Group>
            <Form.Label>Tipo di grafico:</Form.Label>
            <Form.Select 
              value={chartType} 
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="mensile">Mensile</option>
              <option value="trimestrale">Trimestrale</option>
              <option value="annuale">Annuale</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={6} className="mb-4">
          <Card>
            <Card.Header>Grafico a Barre</Card.Header>
            <Card.Body>
              {renderBarChart()}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={6} className="mb-4">
          <Card>
            <Card.Header>Grafico a Torta</Card.Header>
            <Card.Body>
              {renderPieChart()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;