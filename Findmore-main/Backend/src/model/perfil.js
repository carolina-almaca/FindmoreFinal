const Sequelize = require("sequelize");
const sequelize = require("../database");

const Perfil = sequelize.define("perfil", {
  idPerfil: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  admin: Sequelize.BOOLEAN,
  comprador: Sequelize.BOOLEAN,
  gestorProduct: Sequelize.BOOLEAN,
}, {
  timestamps: false,
});

module.exports = Perfil;