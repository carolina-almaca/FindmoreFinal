const Sequelize = require('sequelize');
const sequelize = require('../database');

const Compra = sequelize.define('compra', {
  idCompra: {
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
  idTransacao: {
    type: Sequelize.INTEGER,
    references: {
      model: 'transacaos',
      key: 'idTransacao',
    },
  },
  idFeedback: {
    type: Sequelize.INTEGER,
    references: {
      model: 'feedbacks',
      key: 'idFeedback',
    },
  },
  valorTotal: {
    type: Sequelize.FLOAT,
  },
  descricao: {
    type: Sequelize.STRING(256),
  },
  dataCompra: {
    type: Sequelize.DATE,
  },
  quantidade: {
    type: Sequelize.INTEGER,
  },
  orcamento: {
    type: Sequelize.BOOLEAN,
  },
},{
  timestamps: false,
});

module.exports = Compra;
