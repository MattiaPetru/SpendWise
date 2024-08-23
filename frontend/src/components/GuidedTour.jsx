import React from 'react';
import Joyride, { STATUS, EVENTS } from 'react-joyride';

const GuidedTour = ({ run, setRun }) => {
  const steps = [
    {
      target: '.sidebar-toggle',
      content: 'Questa è la barra laterale. Clicca qui per espanderla.',
      placement: 'right',
      disableBeacon: true,
    },
    {
      target: '.dashboard-overview .sidebar-icon',
      content: 'Qui trovi la panoramica della tua dashboard.',
      placement: 'right',
    },
    {
      target: '.add-expense-button .sidebar-icon',
      content: 'Clicca qui per aggiungere una nuova spesa.',
      placement: 'right',
    },
    {
      target: '.view-expenses-link .sidebar-icon',
      content: 'Qui puoi visualizzare tutte le tue spese passate.',
      placement: 'right',
    },
    {
      target: '.analytics-link .sidebar-icon',
      content: 'Analizza le tue abitudini di spesa con grafici dettagliati.',
      placement: 'right',
    },
    {
      target: '.budget-management-link .sidebar-icon',
      content: 'Gestisci i tuoi budget mensili per ogni categoria di spesa.',
      placement: 'right',
    },
    {
      target: '.personalized-advice-link .sidebar-icon',
      content: 'Ricevi consigli personalizzati basati sulle tue abitudini di spesa.',
      placement: 'right',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status) || type === EVENTS.TOUR_END) {
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
      disableOverlayClose={true}
      disableOverlay={true}
      spotlightClicks={true}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#007bff',
          backgroundColor: '#fff',
          arrowColor: '#fff',
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
        spotlight: {
          backgroundColor: 'transparent',
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default GuidedTour;