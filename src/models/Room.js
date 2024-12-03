const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  localizacao: { type: String, required: true },
  capacidade: { type: Number, required: true }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;