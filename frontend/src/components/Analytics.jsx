import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Form, Card, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [chartType, setChartType] = useState('mensile');
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState('');
  const { utente } = useAuth();
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const categoryColors = useMemo(() => ({
    Alimentari: 'rgba(255, 99, 132, 0.6)',
    Trasporti: 'rgba(54, 162, 235, 0.6)',
    Intrattenimento: 'rgba(255, 206, 86, 0.6)',
    Salute: 'rgba(75, 192, 192, 0.6)',
    Casa: 'rgba(153, 102, 255, 0.6)',
    Abbigliamento: 'rgba(255, 159, 64, 0.6)',
    Istruzione: 'rgba(199, 199, 199, 0.6)',
    Altro: 'rgba(83, 102, 255, 0.6)',
  }), []);

  useEffect(() => {
    if (utente && utente.token) {
      fetchData();
    }
  }, [chartType, utente]);

  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

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
      prepareChartData(data);
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
      setError('Si è verificato un errore nel caricamento dei dati. Riprova più tardi.');
    }
  };

  const prepareChartData = (data) => {
    if (chartType === 'categoria') {
      setChartData({
        labels: data.map(item => item._id),
        datasets: [{
          data: data.map(item => item.totale),
          backgroundColor: data.map(item => categoryColors[item._id] || getRandomColor()),
        }],
      });
    } else {
      const categories = [...new Set(data.flatMap(Object.keys).filter(key => key !== '_id' && key !== 'totale'))];
      const datasets = categories.map(category => ({
        label: category,
        data: data.map(item => item[category] || 0),
        backgroundColor: categoryColors[category] || getRandomColor(),
      }));

      setChartData({
        labels: data.map(item => item._id),
        datasets,
      });
    }
  };

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Spese ${chartType.charAt(0).toUpperCase() + chartType.slice(1)}`,
        font: {
          size: 18,
          weight: 'bold',
        },
      },
    },
    scales: chartType !== 'categoria' ? {
      x: {
        stacked: true,
        title: {
          display: true,
          text: getXAxisLabel(),
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Importo (€)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
          },
        },
      }
    } : {}
  };

  function getXAxisLabel() {
    switch(chartType) {
      case 'mensile':
        return 'Mese';
      case 'trimestrale':
        return 'Trimestre';
      case 'annuale':
        return 'Anno';
      case 'categoria':
        return 'Categoria';
      default:
        return '';
    }
  }

  const renderChart = () => {
    if (!chartData) return null;

    const ChartComponent = chartType === 'categoria' ? Pie : Bar;

    return (
      <ChartComponent
        data={chartData}
        options={options}
        ref={(chart) => {
          chartRef.current = chart;
          if (chart) {
            chartInstanceRef.current = chart.chartInstance;
          }
        }}
      />
    );
  };

  if (!utente) {
    return <Alert variant="info">Caricamento dati utente...</Alert>;
  }

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title className="mb-4">Analisi Spese</Card.Title>
        <Row className="align-items-center mb-4">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Form.Group>
              <Form.Label>Tipo di grafico:</Form.Label>
              <Form.Select 
                size="sm"
                value={chartType} 
                onChange={(e) => {
                  if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                  }
                  setChartType(e.target.value);
                }}
              >
                <option value="mensile">Mensile</option>
                <option value="trimestrale">Trimestrale</option>
                <option value="annuale">Annuale</option>
                <option value="categoria">Per Categoria</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        <div style={{ height: '60vh', position: 'relative' }}>
          {renderChart()}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Analytics;