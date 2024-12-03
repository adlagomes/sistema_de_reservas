const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Listar todas as salas
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

// Adicionar nova sala
router.post('/', async (req, res) => {
  const { nome, localizacao, capacidade } = req.body;

  try {
    const newRoom = new Room({ nome, localizacao, capacidade });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

// Editar sala
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, localizacao, capacidade } = req.body;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { nome, localizacao, capacidade },
      { new: true }
    );
    if (!updatedRoom) {
      return res.status(404).send('Sala não encontrada');
    }
    res.json(updatedRoom);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

// Remover sala
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRoom = await Room.findByIdAndDelete(id);
    if (!deletedRoom) {
      return res.status(404).send('Sala não encontrada');
    }
    res.json({ msg: 'Sala removida com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;
