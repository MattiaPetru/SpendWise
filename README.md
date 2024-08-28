# SpendWise: Applicazione di Gestione Finanziaria Personale

## Descrizione

SpendWise è un'applicazione web full-stack progettata per aiutare gli utenti a gestire e analizzare le proprie finanze personali. Offre una soluzione intuitiva per tracciare le spese quotidiane, visualizzare tendenze di spesa e gestire budget, il tutto in un'interfaccia user-friendly e interattiva.

### Caratteristiche Principali

- Tracciamento delle spese quotidiane
- Gestione dei budget personalizzati
- Visualizzazione delle tendenze di spesa
- Analisi dettagliate delle finanze personali
- Interfaccia intuitiva e reattiva

## Tecnologie Utilizzate

### Frontend
- React
- Bootstrap
- Recharts (per la visualizzazione dei dati)

### Backend
- Node.js
- Express
- MongoDB
- Mongoose

### Autenticazione
- JSON Web Tokens (JWT)

## Installazione

Per installare e eseguire SpendWise localmente, segui questi passaggi:

1. Clona il repository:
   ```
   git clone https://github.com/MattiaPetru/SpendWise.git
   cd spendwise
   ```

2. Installa le dipendenze per il backend e il frontend:
   ```
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Configura le variabili d'ambiente:
   - Crea un file `.env` nella cartella `backend` e aggiungi le seguenti variabili:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5001
     ```
   - Crea un file `.env` nella cartella `frontend` e aggiungi:
     ```
     REACT_APP_API_URL=http://localhost:5001
     ```

4. Avvia il server backend:
   ```
   cd backend
   npm start
   ```

5. In un nuovo terminale, avvia l'applicazione frontend:
   ```
   cd frontend
   npm start
   ```

6. Apri il browser e visita `http://localhost:3000` per utilizzare l'applicazione.

## Utilizzo

Dopo aver effettuato l'accesso, potrai:

1. Aggiungere nuove spese e categorizzarle
2. Creare e gestire budget mensili
3. Visualizzare grafici e analisi delle tue spese
4. Monitorare il tuo progresso finanziario nel tempo

## Contribuire

Siamo aperti a contributi! Se desideri contribuire a SpendWise, segui questi passaggi:

1. Fai un fork del repository
2. Crea un nuovo branch (`git checkout -b feature/AmazingFeature`)
3. Committa le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Pusha il branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## Licenza

Copyright © 2024 SpendWise

Questo progetto è attualmente in fase di sviluppo e la licenza non è ancora stata determinata. Tutti i diritti sono riservati al momento. Per ulteriori informazioni sull'utilizzo, la modifica o la distribuzione di questo software, si prega di contattare gli sviluppatori.

Per informazioni sulle opzioni di licenza per il software open source, si può consultare [choosealicense.com](https://choosealicense.com/).

## Contatti

Nome del Creatore - [mattiapetru93@gmail.com]

Link del Progetto: [https://github.com/MattiaPetru/SpendWise]

## Ringraziamenti

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Recharts](https://recharts.org/)