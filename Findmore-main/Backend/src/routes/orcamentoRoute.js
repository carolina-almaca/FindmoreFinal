const express = require('express');
const router = express.Router();
const orcamentoController = require('../controllers/orcamentoController');

// Criar um novo orçamento
router.post('/', orcamentoController.createOrcamento);
// Listar orçamentos de um comprador
router.get('/utilizador/:idUtilizador', orcamentoController.listaOrcamentosByComprador);

// Listar orçamentos com produtos de um vendedor
router.get('/vendedor/:idUtilizador', orcamentoController.getOrcamentosDoVendedor);

// Listar todos os orçamentos
router.get('/', orcamentoController.getAllOrcamentos);

// Obter um orçamento por ID
router.get('/:id', orcamentoController.getOrcamentoById);

// Atualizar um orçamento por ID
router.put('/:id', orcamentoController.updateOrcamento);

// Excluir um orçamento por ID
router.delete('/:id', orcamentoController.deleteOrcamento);

module.exports = router;
