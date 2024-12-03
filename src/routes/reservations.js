const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation.js');
const User = require('../models/User.js');
const authenticate = require('../middleware/authenticate.js');

// Listar todas as reservas
router.get('/', authenticate, async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('usuario_id sala_id');
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

// Listar reservas do usuário autenticado
router.get('/my', authenticate, async (req, res) => {
  try {
    const reservations = await Reservation.find({ usuario_id: req.user }).populate('sala_id');
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

// Criar uma nova reserva com validação de disponibilidade
router.post('/', authenticate, async (req, res) => {
  const { sala_id, inicio, fim } = req.body;
  const usuario_id = req.user; // Pega o ID do usuário do middleware de autenticação

  try {
    // Verificar se a sala está disponível no intervalo de tempo especificado
    const conflictingReservation = await Reservation.findOne({
      sala_id,
      $or: [
        { inicio: { $lt: fim, $gte: inicio } },
        { fim: { $gt: inicio, $lte: fim } },
        { inicio: { $lte: inicio }, fim: { $gte: fim } }
      ],
      status: { $ne: 'cancelado' }
    });

    if (conflictingReservation) {
      return res.status(400).json({ msg: 'Sala já reservada para o período especificado' });
    }
    // Criando nova reserva
    const reservation = new Reservation({ usuario_id, sala_id, inicio, fim });
    await reservation.save();

    // Registrar atividade de reserva criada
    const user = await User.findById(usuario_id);
    user.historico.push({
      tipo: 'reserva_criada',
      descricao:  `Reserva criada para a sala ${sala_id} de ${inicio} a ${fim}`
    });
    await user.save();

    res.status(201).json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

// Cancelar reserva
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const canceledReservation = await Reservation.findByIdAndUpdate(
      id,
      {status: 'cancelado'},
      {new: true}
    );
    if (!canceledReservation) {
      return res.status(404).send('Reserva não encontrada');
    }

    // Registrar atividade de reserva cancelada
    const user = await User.findById(canceledReservation.usuario_id);
    user.historico.push({
      tipo: 'reserva cancelada',
      descricao: `Reserva cancelada para a sala ${canceledReservation.sala_id} de ${canceledReservation.inicio} a ${canceledReservation.fim}`
    });
    await user.save();

    res.json(canceledReservation);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

// Adicionar créditos ao usuário
router.post('/credits', authenticate, async (req, res) => {
  const usuario_id = req.user;
  const { creditos } = req.body;

  try {
    const user = await User.findById(usuario_id);
    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }
    user.creditos += creditos;

    // Registrar atividade de adição de créditos
    user.historico.push({
      tipo: 'credito_adicionado',
      descricao: `Créditos adicionados: ${creditos}`
    });
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

// Verificar créditos do usuário
router.get('/credits', authenticate, async (req, res) => {
  const usuario_id = req.user;

  try {
    const user = await User.findById(usuario_id);
    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.json({ creditos: user.creditos });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;