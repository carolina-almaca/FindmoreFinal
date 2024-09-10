const Sequelize = require("sequelize");
const sequelize = require("../database");

const ProdutoOrcamento = sequelize.define('ProdutoOrcamento', {
  idProduto: {
    type: Sequelize.INTEGER,
    references: {
      model: 'produtos',
      key: 'idProduto'
    },
    primaryKey: true
  },
  idOrcamento: {
    type: Sequelize.INTEGER,
    references: {
      model: 'orcamentos',
      key: 'idOrcamento'
    },
    primaryKey: true
  },
  idVersaoP: {
    type: Sequelize.INTEGER,
  }
}, {
  timestamps: false
});

module.exports = ProdutoOrcamento;