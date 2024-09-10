const express = require('express');
const router = express.Router();
const transacaoController = require('../controllers/transacaoController');

router.post('/', transacaoController.createTransacao);
router.get('/', transacaoController.getAllTransacoes);
router.get('/:id', transacaoController.getTransacaoById);
router.put('/:id', transacaoController.updateTransacao);
router.delete('/:id', transacaoController.deleteTransacao);

module.exports = router;