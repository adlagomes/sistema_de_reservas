const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  creditos: { type: Number, default: 100 },
  historico: [
    {
      tipo: { type: String, required: true },
      descricao: { type: String, required: true },
      data: { type: Data, default: Date.now }
    }
  ]
});

// Função para hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;