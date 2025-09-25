const express = require('express');
const router = express.Router();

const {
  renderizarDashboard,
  listarEventos
} = require('../controllers/dashboardController');

router.get('/', renderizarDashboard);
router.get('/data', listarEventos); // importante para el dashboard.js

module.exports = router;
