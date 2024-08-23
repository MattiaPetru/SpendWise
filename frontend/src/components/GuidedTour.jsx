import React from 'react';
import Joyride, { STATUS, EVENTS } from 'react-joyride';

const GuidedTour = ({ run, setRun }) => {
  const steps = [
    {
      target: '.sidebar',
      content: 'Questa è la barra laterale. Contiene le principali funzionalità dell\'app.',
      placement: 'right',
      disableBeacon: true,
    },
    {
      target: '.sidebar',
      content: 'Da qui puoi accedere alla panoramica della tua dashboard.',
      placement: 'right',
    },
    {
      target: '.sidebar',
      content: 'Puoi aggiungere nuove spese.',
      placement: 'right',
    },
    {
      target: '.sidebar',
      content: 'Visualizza tutte le tue spese passate.',
      placement: 'right',
    },
    {
      target: '.sidebar',
      content: 'Analizza le tue abitudini di spesa con grafici dettagliati.',
      placement: 'right',
    },
    {
      target: '.sidebar',
      content: 'Gestisci i tuoi budget mensili per ogni categoria di spesa.',
      placement: 'right',
    },
    {
      target: '.sidebar',
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
      callback={handleJoyrideCallback}
    />
  );
};

export default GuidedTour;