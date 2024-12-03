const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('API do Sistema de Reservas'));

module.exports = router;