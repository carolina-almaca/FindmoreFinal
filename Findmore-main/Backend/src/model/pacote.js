const Sequelize = require("sequelize");
const sequelize = require("../database");

const Pacote = sequelize.define('pacote', {
  idPacote: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
 
  valor: {
    type: Sequelize.FLOAT,
  },
  nomePacote: {
    type: Sequelize.STRING(256),
  },
  quantidadePacote: {
    type: Sequelize.INTEGER,
  },  
  orcamento: {
    type: Sequelize.BOOLEAN,
  },
  idOrcamento: {
    type: Sequelize.INTEGER,
  }, 
},{
  timestamps: false,
  
});

module.exports = Pacote;
