const express = require('express');
const router = express.Router();
const { findPerfisByUtilizadorId } = require('../controllers/utilizadorPerfisController');


router.get('/:idUtilizador', findPerfisByUtilizadorId);

module.exports = router;
