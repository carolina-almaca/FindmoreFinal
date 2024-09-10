const Sequelize = require('sequelize');
const sequelize = require('../database');
const bcrypt = require('bcrypt'); //encripta a pass a guardar

const Utilizador = sequelize.define('utilizador', {
  idUtilizador: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nomeU: {
    type: Sequelize.STRING(256),
  },
  email: {
    type: Sequelize.STRING(256),
  },
  password: {
    type: Sequelize.STRING(256),
  },
  ativo: {
    type: Sequelize.BOOLEAN,
  },
 
},{
timestamps: false,
});
Utilizador.beforeCreate((utilizador, options) => {
  return bcrypt.hash(utilizador.password, 10)
  .then(hash => {
      utilizador.password = hash;
  })
  .catch(err => {
      throw new Error();
  });
});

module.exports = Utilizador;

