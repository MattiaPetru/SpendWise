import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Alert } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useAuth } from '../AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const Analytics = () => {
  const [chartType, setChartType] = useState('mensile');
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState('');
  const { utente } = useAuth();

  useEffect(() => {
    if (utente && utente.token) {
      fetchData();
    }
  }, [chartType, utente]);

  const fetchData = async () => {
    try {
      setError('');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      let endpoint;
      
      switch(chartType) {
        case 'mensile':
          endpoint = '/api/spese/mensili-dettagliate';
          break;
        case 'trimestrale':
          endpoint = '/api/spese/trimestrali';
          break;
        case 'annuale':
          endpoint = '/api/spese/annuali';
          break;
        case 'categoria':
          endpoint = '/api/spese/per-categoria';
          break;
        default:
          endpoint = '/api/spese/mensili-dettagliate';
      }

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
    }
  };

  const getXAxisLabel = () => {
    switch(chartType) {
      case 'mensile':
        return 'Mese';
      case 'trimestrale':
        return 'Trimestre';
      case 'annuale':
        return 'Anno';
      default:
        return '';
    }
  };

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="_id" label={{ value: getXAxisLabel(), position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Importo (€)', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
        <Legend />
        {Object.keys(chartData[0] || {}).filter(key => key !== '_id').map((key, index) => (
          <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="totale"
          nameKey="_id"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="_id" label={{ value: getXAxisLabel(), position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Importo (€)', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
        <Legend />
        {Object.keys(chartData[0] || {}).filter(key => key !== '_id').map((key, index) => (
          <Line key={key} type="monotone" dataKey={key} stroke={COLORS[index % COLORS.length]} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  if (!utente) {
    return <Alert variant="info">Caricamento dati utente...</Alert>;
  }

  return (
    <Container fluid>
      <h2 className="mb-4">Analisi Spese</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="mb-4">
        <Col xs={12} md={6} lg={4}>
          <Form.Group>
            <Form.Label>Tipo di grafico:</Form.Label>
            <Form.Select 
              value={chartType} 
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="mensile">Mensile</option>
              <option value="trimestrale">Trimestrale</option>
              <option value="annuale">Annuale</option>
              <option value="categoria">Per Categoria</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={6} className="mb-4">
          <Card>
            <Card.Header>Grafico a Barre</Card.Header>
            <Card.Body>
              {renderBarChart()}
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} lg={6} className="mb-4">
          <Card>
            <Card.Header>Grafico a Torta</Card.Header>
            <Card.Body>
              {chartType === 'categoria' ? renderPieChart() : renderBarChart()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>Grafico a Linee</Card.Header>
            <Card.Body>
              {chartType !== 'categoria' ? renderLineChart() : renderBarChart()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;