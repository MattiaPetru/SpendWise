import React from 'react';
import Joyride, { STATUS } from 'react-joyride';

const GuidedTour = ({ run, setRun }) => {
  const steps = [
    {
      target: '.sidebar',
      content: 'Questa è la barra laterale. Passa il mouse sopra o tocca per espanderla.',
      placement: 'right',
    },
    {
      target: '.dashboard-overview',
      content: 'Qui trovi la panoramica della tua dashboard.',
      placement: 'bottom',
    },
    {
      target: '.add-expense-button',
      content: 'Clicca qui per aggiungere una nuova spesa.',
      placement: 'bottom',
    },
    {
      target: '.view-expenses-link',
      content: 'Qui puoi visualizzare tutte le tue spese passate.',
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
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default GuidedTour;