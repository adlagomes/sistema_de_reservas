const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Rota de registro
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // Verificar se o usuário já existe
    let user = await User.findOne({ email });
    if(user) {
      return res.status(400).json({ msg: 'Usuário já registrado' });
    }

    // Criptografar a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    user = new User({ nome, email, senha });
    user.senha = await bcrypt.hash(senha, salt);
    
    await user.save();

    // Criar novo usuário
    user = new User({ nome, email, senha });
    await user.save();

    // Gerar token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

// Rota de Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    //Verificar se o usuário já existe
    let user = await User.findOne( { email });
    if (!user) {
      return res.status(400).json({ msg: 'Usuário não cadastrado'});
    }

    // Verificar a senha
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Senha inválida' });
    }

    // Gerar token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;