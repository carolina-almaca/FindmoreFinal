const express = require('express');
const router = express.Router();
const compraController = require("../controllers/compraController");

//compra de produto
router.post('/', compraController.createCompra);
//compra de pacote
router.post('/pacote', compraController.createCompraPacote);
// Rota para listar todas as compras
router.get('/lista', compraController.getAllCompras);
// Rota para listar todas as compras de produtos feitas pelo comprador
router.get('/produtos/:idUtilizador', compraController.getComprasByComprador);
// Rota para listar todas as compras de pacotes feitas pelo comprador
router.get('/pacotes/:idUtilizador',compraController.getComprasDePacotesByComprador);
// Rota para listar compras com produtos do vendedor
router.get('/produtosVendidos/:idUtilizador', compraController.getComprasByVendedor);
// Rota para listar todas as compras que têm pacotes com produtos do vendedor
router.get('/pacotesVendidos/:idUtilizador', compraController.getComprasPacotesByVendedor);
router.get('/:id', compraController.getCompraById);
router.get('/', compraController.getAllCompras);
router.put('/:id', compraController.updateCompra);
router.delete('/:id', compraController.deleteCompra);


module.exports = router;