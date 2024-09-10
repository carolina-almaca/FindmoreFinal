const Sequelize = require('sequelize');
const sequelize = require('../database');

const Feedback = sequelize.define('feedback', {
  idFeedback: {
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
  comentario: {
    type: Sequelize.STRING(256),
  },
  avaliacao: {
    type: Sequelize.INTEGER,
  },
},{
  timestamps: false,
});

module.exports = Feedback;