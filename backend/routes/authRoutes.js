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
    const isMatch = await utente.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    const payload = { id: utente._id };
    console.log('Payload per il token:', payload);
    const token = await generateJWT(payload);
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
router.post('/reset-password', async (req, res) => {
  console.log('1. Richiesta di reset password ricevuta');
  try {
    console.log('2. Corpo della richiesta:', req.body);
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      console.log('3. Email o password mancanti');
      return res.status(400).json({ message: 'Email e nuova password sono richieste' });
    }

    console.log('4. Cercando utente con email:', email);
    const utente = await Utente.findOne({ email });

    if (!utente) {
      console.log('5. Utente non trovato');
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    console.log('6. Utente trovato, generazione salt');
    const salt = await bcrypt.genSalt(10);
    console.log('7. Salt generato, hashing password');
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    console.log('8. Password hashata, aggiornamento utente');
    utente.password = hashedPassword;
    await utente.save();

    console.log('9. Utente aggiornato con successo');
    res.status(200).json({ message: 'Password aggiornata con successo' });
  } catch (error) {
    console.error('10. Errore durante il reset della password:', error);
    res.status(500).json({
      message: 'Si è verificato un errore durante il reset della password',
      error: error.message,
      stack: error.stack
    });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  const utenteData = req.user.toObject();
  delete utenteData.password;
  res.json(utenteData);
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=auth_failed' }),
  async (req, res) => {
    try {
      const token = await generateJWT({ id: req.user._id });
      res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
    } catch (error) {
      console.error('Errore nella generazione del token:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
    }
  }
);

export default router;