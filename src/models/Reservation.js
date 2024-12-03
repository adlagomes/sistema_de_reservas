const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sala_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  inicio: { type: Date, required: true },
  fim: { type: Date, required: true },
  status: { type: String, default: 'reservado' } // Status padrão como 'reservado'
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;