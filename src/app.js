const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const indexRoutes = require('./routes/index.js');
const authRoutes = require('./routes/auth.js');
const roomRoutes = require('./routes/rooms.js');
const reservationRoutes = require('./routes/reservations.js');
const authenticate = require('./middleware/authenticate.js');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/sistemaReservas', {useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

  // Usando rotas
  app.use('/', indexRoutes);
  app.use('/auth', authRoutes);
  app.use('/rooms', roomRoutes);
  app.use('/reservations', authenticate, reservationRoutes); // Aplique o middleware nas rotas de reservas
  

  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));