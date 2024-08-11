import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const utenteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Il nome è obbligatorio']
  },
  cognome: {
    type: String,
    required: [true, 'Il cognome è obbligatorio']
  },
  email: {
    type: String,
    required: [true, 'L\'email è obbligatoria'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} non è un indirizzo email valido!`
    }
  },
  password: {
    type: String,
    required: function () { return !this.googleId; }
  },
  googleId: {
    type: String
  },
}, {
  timestamps: true,
  collection: "utenti"
});

utenteSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Metodo pre-save per hashare la password
utenteSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

utenteSchema.index({ email: 1 }, { unique: true });

const Utente = mongoose.model("Utente", utenteSchema);

// Gestione degli errori duplicati
Utente.on('index', function (error) {
  if (error) {
    console.error('Errore di indicizzazione del modello Utente:', error);
  }
});

export default Utente;