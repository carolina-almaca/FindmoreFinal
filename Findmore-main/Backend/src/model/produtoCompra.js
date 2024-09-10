const Sequelize = require("sequelize");
const sequelize = require("../database");

const ProdutoCompras = sequelize.define('ProdutoCompras', {
  idProduto: {
    type: Sequelize.INTEGER,
    references: {
      model: 'produtos',
      key: 'idProduto'
    },
    primaryKey: true
  },
  idCompra: {
    type: Sequelize.INTEGER,
    references: {
      model: 'compras',
      key: 'idCompra'
    },
    primaryKey: true
  },
  idVersaoP: {
    type: Sequelize.INTEGER,
  }
}, {
  timestamps: false
});

module.exports = ProdutoCompras;
