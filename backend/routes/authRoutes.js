import express from 'express';
import Utente from '../models/Utente.js';
import { generateJWT } from '../utils/jwt.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import passport from '../config/passportConfig.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const utente = await Utente.findOne({ email });
    if (!utente) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    const isMatch = await bcrypt.compare(password, utente.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    const token = generateJWT({ id: utente._id });
    res.json({ token, message: "Login effettuato con successo" });
  } catch (error) {
    console.error('Errore nel login:', error);
    res.status(500).json({ message: 'Errore del server' });
  }
});


router.post('/register', async (req, res) => {
  try {
    const { nome, cognome, email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email è obbligatoria' });
    }

    const existingUtente = await Utente.findOne({ email });
    if (existingUtente) {
      return res.status(400).json({ message: 'Email già registrata' });
    }

    const newUtente = new Utente({ nome, cognome, email, password });
    await newUtente.save();

    res.status(201).json({ message: "Registrazione effettuata con successo" });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email già registrata' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Errore del server', error: error.message });
  }
});

// Rotta per il reset della password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const utente = await Utente.findOne({ email });

    if (!utente) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // Hashare la nuova password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    utente.password = hashedPassword;
    utente.resetPasswordToken = undefined;
    utente.resetPasswordExpires = undefined;

    await utente.save();

    res.status(200).json({ message: 'Password aggiornata con successo' });
  } catch (error) {
    console.error('Errore nel reset della password:', error);
    res.status(500).json({ message: 'Si è verificato un errore durante il reset della password' });
  }
});


router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const utente = await Utente.findOne({ email });

    if (!utente) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    utente.resetPasswordToken = resetToken;
    utente.resetPasswordExpires = Date.now() + 3600000; // 1 ora

    await utente.save();

    res.json({ message: 'Istruzioni per il reset della password inviate', resetToken });
  } catch (error) {
    console.error('Errore nella richiesta di reset password:', error);
    res.status(500).json({ message: 'Si è verificato un errore durante la richiesta di reset password' });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  const utenteData = req.user.toObject();
  delete utenteData.password;
  res.json(utenteData);
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const token = generateJWT({ id: req.user._id });
      res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
    } catch (error) {
      console.error('Errore nella generazione del token:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);


export default router;