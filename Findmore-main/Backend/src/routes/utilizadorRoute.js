const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const utilizadorController = require('../controllers/utilizadorController');


router.get('/list',middleware.checkToken, utilizadorController.getAllUtilizadores);
router.get('/:id', utilizadorController.getUtilizadorById);
router.put('/:id', utilizadorController.updateUtilizador);
router.delete('/:id', utilizadorController.deleteUtilizador);
router.get('/compradores/count', utilizadorController.getCompradores);
router.get('/vendedores/count', utilizadorController.getVendedores);




module.exports = router;