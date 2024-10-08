import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  utente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utente',
    required: true
  },
  categoria: {
    type: String,
    required: [true, 'La categoria è obbligatoria']
  },
  importo: {
    type: Number,
    required: [true, 'L\'importo è obbligatorio'],
    min: [0, 'L\'importo non può essere negativo']
  },
  periodo: {
    type: String,
    enum: ['mensile', 'trimestrale', 'annuale'],
    default: 'mensile'
  },
  mese: {
    type: String,
    required: [true, 'Il mese è obbligatorio']
  },
  speso: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;