const Sequelize = require('sequelize');
const sequelize = require('../database');

const VersaoP = sequelize.define('versaoP', {
  idVersaoP: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idProduto: {
    type: Sequelize.INTEGER,
    references: {
      model: 'produtos',
      key: 'idProduto',
    },
  },
  nomeVersaoP: {
    type: Sequelize.STRING(256),
  },
  data: {
    type: Sequelize.DATE,
  },
},{
  timestamps: false,
});

module.exports = VersaoP;