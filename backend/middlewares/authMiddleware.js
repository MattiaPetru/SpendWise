import { verifyJWT, handleJWTError } from '../utils/jwt.js';
import Utente from '../models/Utente.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token ricevuto:', token);

    if (!token) {
      console.log('Nessun token fornito');
      return res.status(401).json({ messaggio: 'Token di accesso mancante' });
    }

    try {
      const decoded = await verifyJWT(token);
      console.log('Token decodificato:', decoded);

      const utente = await Utente.findById(decoded.id).select('-password');
      if (!utente) {
        console.log('Utente non trovato');
        return res.status(401).json({ messaggio: 'Utente non trovato' });
      }

      console.log('Utente autenticato:', utente._id);
      req.user = utente;
      next();
    } catch (error) {
      console.error('Errore nella verifica del token:', error);
      const jwtError = handleJWTError(error);
      res.status(401).json({ messaggio: jwtError.message });
    }
  } catch (error) {
    console.error('Errore nel middleware di autenticazione:', error);
    res.status(500).json({ messaggio: 'Errore interno del server' });
  }
};