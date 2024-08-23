import React, { useState, useEffect } from 'react';
import Joyride, { STATUS, EVENTS } from 'react-joyride';

const GuidedTour = ({ run, setRun }) => {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    const updateSteps = () => {
      const isDesktop = window.innerWidth > 1024;
      const newSteps = [
        {
          target: '.sidebar',
          content: isDesktop ? 'Questa è la barra laterale con le principali funzionalità.' : 'Clicca sull\'icona del menu per espandere la barra laterale.',
          placement: 'right',
          disableBeacon: true,
        },
        {
          target: isDesktop ? '.dashboard-overview .sidebar-label' : '.dashboard-overview .sidebar-icon',
          content: 'Qui trovi la panoramica della tua dashboard.',
          placement: 'right',
        },
        {
          target: isDesktop ? '.add-expense-button .sidebar-label' : '.add-expense-button .sidebar-icon',
          content: 'Clicca qui per aggiungere una nuova spesa.',
          placement: 'right',
        },
        {
          target: isDesktop ? '.view-expenses-link .sidebar-label' : '.view-expenses-link .sidebar-icon',
          content: 'Qui puoi visualizzare tutte le tue spese passate.',
          placement: 'right',
        },
        {
          target: isDesktop ? '.analytics-link .sidebar-label' : '.analytics-link .sidebar-icon',
          content: 'Analizza le tue abitudini di spesa con grafici dettagliati.',
          placement: 'right',
        },
        {
          target: isDesktop ? '.budget-management-link .sidebar-label' : '.budget-management-link .sidebar-icon',
          content: 'Gestisci i tuoi budget mensili per ogni categoria di spesa.',
          placement: 'right',
        },
        {
          target: isDesktop ? '.personalized-advice-link .sidebar-label' : '.personalized-advice-link .sidebar-icon',
          content: 'Ricevi consigli personalizzati basati sulle tue abitudini di spesa.',
          placement: 'right',
        },
      ];
      setSteps(newSteps);
    };

    updateSteps();
    window.addEventListener('resize', updateSteps);
    return () => window.removeEventListener('resize', updateSteps);
  }, []);

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