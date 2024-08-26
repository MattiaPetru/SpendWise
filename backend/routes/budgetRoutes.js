import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import Budget from '../models/Budget.js';
import Spesa from '../models/Spesa.js';
import Income from '../models/Income.js';

const router = express.Router();

// Applica il middleware di autenticazione a tutte le rotte
router.use(authMiddleware);

// GET /api/budgets - Recupera tutti i budget dell'utente
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find({ utente: req.user._id });

    const budgetsWithSpending = await Promise.all(budgets.map(async (budget) => {
      const speseTotali = await Spesa.aggregate([
        {
          $match: {
            utente: req.user._id,
            categoria: budget.categoria,
            data: {
              $gte: new Date(budget.mese),
              $lt: new Date(new Date(budget.mese).setMonth(new Date(budget.mese).getMonth() + 1))
            }
          }
        },
        { $group: { _id: null, totale: { $sum: "$importo" } } }
      ]);

      const speso = speseTotali.length > 0 ? speseTotali[0].totale : 0;

      return {
        ...budget.toObject(),
        speso
      };
    }));

    res.json(budgetsWithSpending);
  } catch (error) {
    console.error('Errore nel recupero dei budget:', error);
    res.status(500).json({ messaggio: 'Errore interno del server durante il recupero dei budget' });
  }
});

// POST /api/budgets - Crea un nuovo budget
router.post('/', async (req, res) => {
  try {
    const { categoria, importo, periodo, mese } = req.body;

    if (!categoria || !importo || !periodo || !mese) {
      return res.status(400).json({ messaggio: 'Categoria, importo, periodo e mese sono obbligatori' });
    }

    const newBudget = new Budget({
      utente: req.user._id,
      categoria,
      importo: Number(importo),
      periodo,
      mese
    });

    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    console.error('Errore nella creazione del budget:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ messaggio: error.message });
    }
    res.status(500).json({ messaggio: 'Errore interno del server durante la creazione del budget' });
  }
});

// PUT /api/budgets/:id - Aggiorna un budget esistente
router.put('/:id', async (req, res) => {
  try {
    const { categoria, importo, periodo, mese } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, utente: req.user._id },
      { categoria, importo, periodo, mese },
      { new: true, runValidators: true }
    );
    if (!budget) {
      return res.status(404).json({ messaggio: 'Budget non trovato' });
    }
    res.json(budget);
  } catch (error) {
    console.error('Errore nell\'aggiornamento del budget:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ messaggio: error.message });
    }
    res.status(500).json({ messaggio: 'Errore interno del server durante l\'aggiornamento del budget' });
  }
});

// DELETE /api/budgets/:id - Elimina un budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, utente: req.user._id });
    if (!budget) {
      return res.status(404).json({ messaggio: 'Budget non trovato' });
    }
    res.json({ messaggio: 'Budget eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione del budget:', error);
    res.status(500).json({ messaggio: 'Errore interno del server durante l\'eliminazione del budget' });
  }
});

// GET /api/budgets/income - Recupera tutte le entrate dell'utente
router.get('/income', async (req, res) => {
  try {
    const incomes = await Income.find({ utente: req.user._id });
    res.json(incomes);
  } catch (error) {
    console.error('Errore nel recupero delle entrate:', error);
    res.status(500).json({ messaggio: 'Errore interno del server durante il recupero delle entrate' });
  }
});

// POST /api/budgets/income - Crea o aggiorna un'entrata
router.post('/income', async (req, res) => {
  try {
    const { importo, mese } = req.body;
    if (importo === undefined || !mese) {
      return res.status(400).json({ messaggio: 'L\'importo e il mese sono obbligatori' });
    }
    let income = await Income.findOne({ utente: req.user._id, mese });
    if (income) {
      income.importo = Number(importo);
    } else {
      income = new Income({
        utente: req.user._id,
        importo: Number(importo),
        mese
      });
    }
    await income.save();
    res.json({ messaggio: 'Entrata aggiornata con successo', income });
  } catch (error) {
    console.error('Errore nell\'aggiornamento dell\'entrata:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ messaggio: error.message });
    }
    res.status(500).json({ messaggio: 'Errore interno del server durante l\'aggiornamento dell\'entrata' });
  }
});

export default router;