import React from 'react';
import Joyride, { STATUS } from 'react-joyride';

const GuidedTour = ({ run, setRun }) => {
  const steps = [
    {
      target: '.sidebar',
      content: 'Questa è la barra laterale. Su desktop, passa il mouse sopra per espanderla. Su mobile, clicca sull\'icona del menu per aprirla.',
      placement: 'right',
    },
    {
      target: '.dashboard-overview',
      content: 'Qui trovi la panoramica della tua dashboard.',
      placement: 'right',
    },
    {
      target: '.add-expense-button',
      content: 'Clicca qui per aggiungere una nuova spesa.',
      placement: 'right',
    },
    {
      target: '.view-expenses-link',
      content: 'Qui puoi visualizzare tutte le tue spese passate.',
      placement: 'right',
    },
    {
      target: '.analytics-link',
      content: 'Analizza le tue abitudini di spesa con grafici dettagliati.',
      placement: 'right',
    },
    {
      target: '.budget-management-link',
      content: 'Gestisci i tuoi budget mensili per ogni categoria di spesa.',
      placement: 'right',
    },
    {
      target: '.personalized-advice-link',
      content: 'Ricevi consigli personalizzati basati sulle tue abitudini di spesa.',
      placement: 'right',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#007bff',
        },
        tooltip: {
          fontSize: '14px',
          padding: '10px',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#007bff',
          fontSize: '14px',
          padding: '8px 15px',
        },
        buttonBack: {
          color: '#007bff',
          fontSize: '14px',
          padding: '8px 15px',
        },
        buttonSkip: {
          color: '#6c757d',
          fontSize: '14px',
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default GuidedTour;