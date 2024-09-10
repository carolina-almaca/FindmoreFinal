const Sequelize = require("sequelize");
const sequelize = require("../database");

const ProdutoPacotes = sequelize.define('ProdutoPacotes', {
  idProduto: {
    type: Sequelize.INTEGER,
    references: {
      model: 'produtos',
      key: 'idProduto'
    },
    primaryKey: true
  },
  idPacote: {
    type: Sequelize.INTEGER,
    references: {
      model: 'pacotes',
      key: 'idPacote'
    },
    primaryKey: true
  },
  idVersaoP: {
    type: Sequelize.INTEGER,
  }
}, {
  timestamps: false
});

module.exports = ProdutoPacotes;
