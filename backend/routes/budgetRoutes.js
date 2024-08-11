import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import Budget from '../models/Budget.js';
import Spesa from '../models/Spesa.js';

const router = express.Router();

router.use(authMiddleware);

// GET /api/budgets
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find({ utente: req.user._id });

    const budgetsWithSpending = await Promise.all(budgets.map(async (budget) => {
      const speseTotali = await Spesa.aggregate([
        { $match: { utente: req.user._id, categoria: budget.categoria } },
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
    res.status(500).json({ messaggio: error.message });
  }
});

// POST /api/budgets
router.post('/', async (req, res) => {
  try {
    const { categoria, importo } = req.body;

    if (!categoria || !importo) {
      return res.status(400).json({ messaggio: 'Categoria e importo sono obbligatori' });
    }

    const newBudget = new Budget({
      utente: req.user._id,
      categoria,
      importo: Number(importo)
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

// DELETE /api/budgets/:id
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, utente: req.user._id });
    if (!budget) {
      return res.status(404).json({ messaggio: 'Budget non trovato' });
    }
    res.json({ messaggio: 'Budget eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione del budget:', error);
    res.status(500).json({ messaggio: error.message });
  }
});

export default router;