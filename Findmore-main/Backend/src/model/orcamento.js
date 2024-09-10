const Sequelize = require('sequelize');
const sequelize = require('../database');

const Orcamento = sequelize.define('orcamento', {
  idOrcamento: {
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
  nomeO: {
    type: Sequelize.STRING(256),
  },
  quantidade: {
    type: Sequelize.INTEGER,
  },
  estado: {
    type: Sequelize.STRING(256),
  },
  justificacao: {
    type: Sequelize.STRING(256),
  },
  preco: {
    type: Sequelize.FLOAT,
  },
  dataValidade: {
    type: Sequelize.DATE,
  },
},{
timestamps: false,
});


module.exports = Orcamento;

