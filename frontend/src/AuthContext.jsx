import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [utente, setUtente] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUtente(token);
    }
  }, []);

  const fetchUtente = async (token) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/utenti/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const utenteData = await response.json();
        setUtente({ ...utenteData, token });
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Errore nel recupero dei dati utente:', error);
      localStorage.removeItem('token');
    }
  };

  const login = async (email, password, token = null) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      
      if (token) {
        // Login con Google
        await fetchUtente(token);
        return { success: true };
      } else {
        // Login normale
        const response = await fetch(`${apiUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login fallito');
        }
  
        const data = await response.json();
        localStorage.setItem('token', data.token);
        await fetchUtente(data.token);
        return { success: true };
      }
    } catch (error) {
      console.error('Errore nel login:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUtente(null);
  };

  return (
    <AuthContext.Provider value={{ utente, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);