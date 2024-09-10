const express = require('express');
const router = express.Router();
const pacoteController = require('../controllers/pacoteController');

router.post('/', pacoteController.createPacote);
//rota para criar um pacote pedido num orçamento
router.post('/pacoteOrcamento', pacoteController.createPacoteOrcamento);
// Rota para listar todos os pacotes e os seus produtos 
router.get('/lista', pacoteController.getAllPacotesWithProdutos);
router.get('/:id', pacoteController.getPacoteById);
router.put('/:id', pacoteController.updatePacote);
router.delete('/:id', pacoteController.deletePacote);
// Rota para listar os produtos de um pacote pelo ID do pacote
router.get('/:idPacote/produtos', pacoteController.getPacoteProdutos);
// Rota para listar todos os pacotes que contêm produtos de um utilizador
router.get('/:idUtilizador/pacotes',pacoteController.getPacotesByUtilizador);

module.exports = router;