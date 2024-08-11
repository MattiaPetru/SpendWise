import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import Spesa from '../models/Spesa.js';
import Budget from '../models/Budget.js';

const router = express.Router();

router.use(authMiddleware);

// GET /api/advice
router.get('/', async (req, res) => {
  try {
    const spese = await Spesa.find({ utente: req.user._id });
    const budgets = await Budget.find({ utente: req.user._id });

    const consigli = generateAdvice(spese, budgets);

    res.json(consigli);
  } catch (error) {
    console.error('Errore nel recupero dei consigli:', error);
    res.status(500).json({ messaggio: error.message });
  }
});

function generateAdvice(spese, budgets) {
  const consigli = [];

  // Calcola le spese totali per ogni categoria
  const spesePerCategoria = spese.reduce((acc, spesa) => {
    acc[spesa.categoria] = (acc[spesa.categoria] || 0) + spesa.importo;
    return acc;
  }, {});

  // Genera consigli basati sui budget e sulle spese
  budgets.forEach(budget => {
    const spesaAttuale = spesePerCategoria[budget.categoria] || 0;
    const percentualeUtilizzata = (spesaAttuale / budget.importo) * 100;

    if (percentualeUtilizzata > 90) {
      consigli.push({
        titolo: `Attenzione al budget ${budget.categoria}`,
        descrizione: `Hai utilizzato il {${percentualeUtilizzata.toFixed(2)}%} del tuo budget per ${budget.categoria}. Considera di ridurre le spese in questa categoria.`,
        tipo: 'warning'
      });
    } else if (percentualeUtilizzata < 50 && spesaAttuale > 0) {
      consigli.push({
        titolo: `Risparmio nel budget ${budget.categoria}`,
        descrizione: `Stai spendendo meno del previsto in ${budget.categoria}. Hai utilizzato solo il {${percentualeUtilizzata.toFixed(2)}%} del budget. Potresti considerare di risparmiare la differenza.`,
        tipo: 'success'
      });
    }
  });

  // Aggiungi consigli generali
  consigli.push({
    titolo: 'Tracciamento spese',
    descrizione: 'Ricorda di registrare tutte le tue spese, anche quelle piccole. Questo ti aiuterà a mantenere una visione accurata delle tue finanze.',
    tipo: 'info'
  });

  consigli.push({
    titolo: 'Obiettivi di risparmio',
    descrizione: 'Considera di impostare un obiettivo di risparmio mensile. Anche piccole somme possono accumularsi nel tempo.',
    tipo: 'info'
  });

  return consigli;
}

export default router;