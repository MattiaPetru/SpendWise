import jwt from 'jsonwebtoken';

// Funzione per generare un token JWT
export const generateJWT = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
        algorithm: 'HS256' // algoritmo di firma
      },
      (err, token) => {
        if (err) {
          console.error('Errore nella generazione del token JWT:', err);
          reject(new Error('Errore nella generazione del token'));
        } else {
          resolve(token);
        }
      }
    );
  });
};

// Funzione per verificare un token JWT
export const verifyJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ['HS256'] // algoritmo di verifica
      },
      (err, decoded) => {
        if (err) {
          console.error('Errore nella verifica del token JWT:', err);
          reject(new Error('Token non valido'));
        } else {
          resolve(decoded);
        }
      }
    );
  });
};

// Funzione helper per gestire errori di token
export const handleJWTError = (error) => {
  console.error('Errore JWT:', error);
  if (error.name === 'TokenExpiredError') {
    return { message: 'Il token è scaduto' };
  }
  if (error.name === 'JsonWebTokenError') {
    return { message: 'Token non valido' };
  }
  return { message: 'Errore di autenticazione' };
};