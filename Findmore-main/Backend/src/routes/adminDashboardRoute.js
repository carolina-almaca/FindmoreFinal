const express = require('express');
const router = express.Router();
const estatisticasController = require('../controllers/adminDashboardController');

// Rota para obter estatísticas gerais
router.get('/count', estatisticasController.getEstatisticasGerais);
// Rota para obter a percentagem de produtos por categoria
router.get('/graficoCategorias', estatisticasController.getPercentagemPorCategoria);
// Rota para obter o total de vendas por mês
router.get('/total-vendas-por-mes', estatisticasController.getTotalVendasPorMes);
// Rota para obter as ultimas compras
router.get('/ultimasCompras',estatisticasController.listarComprasMaisRecentes);
router.get('/topVendas',estatisticasController.getTop3ItensMaisComprados);

module.exports = router;