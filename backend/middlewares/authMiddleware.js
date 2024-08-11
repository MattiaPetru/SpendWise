import { verifyJWT } from '../utils/jwt.js';
import Utente from '../models/Utente.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Token ricevuto nel middleware:', token);

    if (!token) {
      return res.status(401).json({ messaggio: 'Token di accesso mancante' });
    }

    try {
      const decoded = await verifyJWT(token);
      console.log('Token decodificato:', decoded);

      const utente = await Utente.findById(decoded.id).select('-password');
      console.log('Utente trovato:', utente);

      if (!utente) {
        return res.status(401).json({ messaggio: 'Utente non trovato' });
      }

      req.user = utente;
      next();
    } catch (error) {
      console.error('Errore nella verifica del token:', error);
      res.status(401).json({ messaggio: 'Token di accesso non valido' });
    }
  } catch (error) {
    console.error('Errore nel middleware di autenticazione:', error);
    res.status(500).json({ messaggio: 'Errore interno del server' });
  }
};