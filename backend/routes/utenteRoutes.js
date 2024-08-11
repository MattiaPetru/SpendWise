import express from "express";
import Utente from "../models/Utente.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Utente non autenticato' });
    }
    const utente = await Utente.findById(req.user._id).select("-password");
    if (!utente) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    res.json(utente);
  } catch (err) {
    console.error('Errore nel recupero dei dati utente:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/me/budget", async (req, res) => {
  try {
    const utente = await Utente.findById(req.user._id);
    utente.budget = req.body.budget;
    await utente.save();
    res.json(utente.budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;