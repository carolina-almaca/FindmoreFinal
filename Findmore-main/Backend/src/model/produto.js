const Sequelize = require('sequelize');
const sequelize = require('../database');

const Produto = sequelize.define('produto', {
  idProduto: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idUtilizador: {
    type: Sequelize.INTEGER,
    references: {
      model: 'utilizadors',
      key: 'idUtilizador',
    },
  },
  nomeP: {
    type: Sequelize.STRING(256),
  },
  preco: {
    type: Sequelize.FLOAT,
  },
  imagem: {
    type: Sequelize.TEXT('long'),
  },
  descricao: {
    type: Sequelize.STRING(256),
  },
  categoria: {
    type: Sequelize.STRING(256),
  },
  miniDescricao: {
    type: Sequelize.STRING(256),
  },
  licenca: {
    type: Sequelize.STRING(256),
  },
  stock: {
    type: Sequelize.INTEGER,
  },
},{
  timestamps: false,
});

module.exports = Produto;