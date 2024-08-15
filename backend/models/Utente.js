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


// Metodo pre-save per hashare la password
utenteSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      console.log('Password hashata con successo durante il salvataggio');
    } catch (error) {
      console.error('Errore durante l\'hashing della password:', error);
      return next(error);
    }
  }
  next();
});

utenteSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    console.error('Errore durante il confronto delle password:', error);
    throw error;
  }
};

utenteSchema.index({ email: 1 }, { unique: true });

const Utente = mongoose.model("Utente", utenteSchema);

// Gestione degli errori duplicati
Utente.on('index', function (error) {
  if (error) {
    console.error('Errore di indicizzazione del modello Utente:', error);
  }
});

export default Utente;