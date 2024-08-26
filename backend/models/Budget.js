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
  dataInizio: {
    type: Date,
    default: Date.now
  },
  dataFine: {
    type: Date,
    default: function () {
      let date = new Date();
      switch (this.periodo) {
        case 'trimestrale':
          return new Date(date.getFullYear(), date.getMonth() + 3, 0);
        case 'annuale':
          return new Date(date.getFullYear() + 1, date.getMonth(), 0);
        default: // mensile
          return new Date(date.getFullYear(), date.getMonth() + 1, 0);
      }
    }
  }
}, {
  timestamps: true
});

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;