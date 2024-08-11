import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import authRoutes from "./routes/authRoutes.js";
import speseRoutes from "./routes/speseRoutes.js";
import utenteRoutes from "./routes/utenteRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import adviceRoutes from "./routes/adviceRoutes.js";
import session from "express-session";
import passport from "./config/passportConfig.js";

import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./middlewares/errorHandlers.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    const whiteList = [
      "http://localhost:5173",
      //"https://spendwise.vercel.app",
      //"https://spendwise.onrender.com"
    ]

    if (process.env.NODE_ENV === "development") {
      callback(null, true)
    } else if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error("Errore generico CORS - Cors(server backend)"))
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connesso"))
  .catch((err) => console.error("Errore di connessione MongoDB:", err));

app.use("/api/auth", authRoutes);
app.use("/api/spese", speseRoutes);
app.use("/api/utenti", utenteRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/advice", adviceRoutes);

const PORT = process.env.PORT || 5001;

app.use(badRequestHandler);
app.use(unauthorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);

  console.log("Rotte disponibili:");
  console.table(
    listEndpoints(app).map((route) => ({
      percorso: route.path,
      metodi: route.methods.join(", "),
    }))
  );
});