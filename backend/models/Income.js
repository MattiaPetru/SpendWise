import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  utente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utente',
    required: true
  },
  importo: {
    type: Number,
    required: [true, 'L\'importo è obbligatorio'],
    min: [0, 'L\'importo non può essere negativo']
  },
  mese: {
    type: String,
    required: [true, 'Il mese è obbligatorio']
  }
}, {
  timestamps: true
});

const Income = mongoose.model('Income', incomeSchema);

export default Income;