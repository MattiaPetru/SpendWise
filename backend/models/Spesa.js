import mongoose from "mongoose";

const spesaSchema = new mongoose.Schema({
  utente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utente',
    required: true
  },
  importo: {
    type: Number,
    required: [true, 'L\'importo è obbligatorio']
  },
  categoria: {
    type: String,
    required: [true, 'La categoria è obbligatoria']
  },
  data: {
    type: Date,
    default: Date.now
  },
  descrizione: {
    type: String,
    required: [true, 'La descrizione è obbligatoria']
  },
  urlRicevuta: {
    type: String
  }
}, {
  timestamps: true
});

const Spesa = mongoose.model('Spesa', spesaSchema);

export default Spesa;