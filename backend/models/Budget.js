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
  dataInizio: {
    type: Date,
    default: Date.now
  },
  dataFine: {
    type: Date,
    default: function () {
      let date = new Date();
      return new Date(date.getFullYear(), date.getMonth() + 1, 0); // Ultimo giorno del mese corrente
    }
  }
}, {
  timestamps: true
});

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;