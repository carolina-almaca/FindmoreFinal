const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const produtoController = require('../controllers/produtoController');

router.post('/criar', produtoController.createProduto);
router.get('/lista',middleware.checkToken, produtoController.getAllProdutos);
router.get('/listaStock',middleware.checkToken, produtoController.getAllProdutosComStock);
router.get('/:id', produtoController.getProdutoById);
router.put('/:id', produtoController.updateProduto);
router.post('/novaVersaoP/:id',produtoController.addVersaoP);
router.delete('/:id', produtoController.deleteProduto);


module.exports = router;