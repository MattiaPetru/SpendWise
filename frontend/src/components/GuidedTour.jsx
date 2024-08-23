import React from 'react';
import Joyride, { STATUS, EVENTS } from 'react-joyride';

const GuidedTour = ({ run, setRun }) => {
  const steps = [
    {
      target: '.sidebar',
      content: 'Questa è la barra laterale. Contiene le principali funzionalità dell\'app.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.dashboard-overview',
      content: 'Da qui puoi accedere alla panoramica della tua dashboard.',
      placement: 'bottom',
    },
    {
      target: '.add-expense-button',
      content: 'Puoi aggiungere nuove spese.',
      placement: 'bottom',
    },
    {
      target: '.view-expenses-link',
      content: 'Visualizza tutte le tue spese passate.',
      placement: 'bottom',
    },
    {
      target: '.analytics-link',
      content: 'Analizza le tue abitudini di spesa con grafici dettagliati.',
      placement: 'bottom',
    },
    {
      target: '.budget-management-link',
      content: 'Gestisci i tuoi budget mensili per ogni categoria di spesa.',
      placement: 'bottom',
    },
    {
      target: '.personalized-advice-link',
      content: 'Ricevi consigli personalizzati basati sulle tue abitudini di spesa.',
      placement: 'bottom',
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
      disableOverlay={false}
      spotlightClicks={false}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#007bff',
          backgroundColor: '#fff',
          arrowColor: '#fff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
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
      floaterProps={{
        hideArrow: true,
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default GuidedTour;