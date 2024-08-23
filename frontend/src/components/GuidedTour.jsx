import React, { useState, useEffect } from 'react';
import Joyride from 'react-joyride';

const GuidedTour = () => {
  const [isTourActive, setIsTourActive] = useState(false);

  useEffect(() => {
    if (isTourActive) {
      // Aggiunge una classe al body per applicare stili specifici durante il tour
      document.body.classList.add('joyride-tour-active');
    } else {
      // Rimuove la classe dal body quando il tour è terminato
      document.body.classList.remove('joyride-tour-active');
    }

    return () => {
      // Pulizia della classe quando il componente è smontato o il tour è terminato
      document.body.classList.remove('joyride-tour-active');
    };
  }, [isTourActive]);

  const handleTourStart = () => {
    setIsTourActive(true);
    // Disabilita l'espansione della sidebar all'inizio del tour
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.remove('expanded');
    }
  };

  const handleTourEnd = () => {
    setIsTourActive(false);
    // Se necessario, puoi ripristinare lo stato della sidebar qui
    // const sidebar = document.querySelector('.sidebar');
    // if (sidebar) {
    //   sidebar.classList.add('expanded'); // Ripristina l'espansione se desiderato
    // }
  };

  return (
    <Joyride
      steps={[
        {
          target: '.dashboard-icon-1',
          content: 'Questa è la prima icona. Qui puoi accedere alla dashboard principale.',
        },
        {
          target: '.dashboard-icon-2',
          content: 'Questa è la seconda icona. Utilizzala per vedere le statistiche.',
        },
        {
          target: '.dashboard-icon-3',
          content: 'Questa è la terza icona. Qui puoi accedere alle impostazioni.',
        },
        {
          target: '.dashboard-icon-4',
          content: 'Questa è la quarta icona. Usala per gestire i tuoi progetti.',
        },
        {
          target: '.dashboard-icon-5',
          content: 'Questa è la quinta icona. Ti porta alla sezione delle notifiche.',
        },
        {
          target: '.dashboard-icon-6',
          content: 'Questa è la sesta icona. Da qui puoi accedere ai report.',
        },
        {
          target: '.sidebar-toggle',
          content: 'Questo è il toggle della sidebar. Usalo per espandere o ridurre la sidebar.',
        },
        {
          target: '.user-profile',
          content: 'Questo è il tuo profilo utente. Clicca qui per vedere e modificare le tue informazioni.',
        }
      ]}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          zIndex: 10000, // Assicura che il tour sia sempre in primo piano
        },
      }}
      callback={(data) => {
        const { status, type } = data;
        if (type === 'tour:start') {
          handleTourStart();
        } else if (status === 'finished' || status === 'skipped') {
          handleTourEnd();
        }
      }}
    />
  );
};

export default GuidedTour;