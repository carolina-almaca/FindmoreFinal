const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/PerfilController');

router.post('/', perfilController.createPerfil);
router.get('/list', perfilController.getAllPerfis);
router.get('/:id', perfilController.getPerfilById);
router.put('/:id', perfilController.updatePerfil);
router.delete('/:id', perfilController.deletePerfil);

module.exports = router;