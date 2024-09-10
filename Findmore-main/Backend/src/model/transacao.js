const Sequelize = require('sequelize');
const sequelize = require('../database');

const Transacao = sequelize.define('transacao', {
  idTransacao: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idCompra: {
    type: Sequelize.INTEGER,
    references: {
      model: 'compras',
      key: 'idCompra',
    },
  },
  nomeCartao: {
    type: Sequelize.STRING(256),
  },
  numeroCartao: {
    type: Sequelize.STRING(256),
  },
  validadeCartao: {
    type: Sequelize.STRING(256),
  },
  CVV: {
    type: Sequelize.STRING(256),
  },
},{
  timestamps: false,
});

module.exports = Transacao;