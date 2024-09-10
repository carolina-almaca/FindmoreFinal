const Sequelize = require('sequelize');
const sequelize = require('../database');

const Utilizador = require('./utilizador');
const Perfil = require('./perfil');
const VersaoP = require('./versaoP');
const Produto = require('./produto');
const Pacote = require('./pacote');
const Compra = require('./compra');
const Transacao = require('./transacao');
const Feedback = require('./feedback');
const Orcamento= require ('./orcamento');
const ProdutoPacotes =require('./produtoPacote');
const ProdutoCompras = require('./produtoCompra');
const ProdutoOrcamento= require('./produtoOrcamento');
const UtilizadorPerfis = sequelize.define('UtilizadorPerfis', {}, { timestamps: false });
const PacoteCompras = sequelize.define('PacoteCompra', {}, { timestamps: false });

// Associações de Utilizador com Perfil (Muitos para Muitos)
Utilizador.belongsToMany(Perfil, { through: UtilizadorPerfis, foreignKey: 'idUtilizador', otherKey: 'idPerfil' });
Perfil.belongsToMany(Utilizador, { through: UtilizadorPerfis, foreignKey: 'idPerfil', otherKey: 'idUtilizador' });

// Associações de Utilizador com Produto (Um para Muitos)
Utilizador.hasMany(Produto, { foreignKey: 'idUtilizador' });
Produto.belongsTo(Utilizador, { foreignKey: 'idUtilizador' });

// Associações de Produto com Compra (Muitos para muitos)
Compra.belongsToMany(Produto, { through: ProdutoCompras, foreignKey: 'idCompra', otherKey: 'idProduto' });
Produto.belongsToMany(Compra,  { through: ProdutoCompras, foreignKey: 'idProduto', otherKey: 'idCompra' });

// Associações de Produto com VersaoP (Um para Muitos)
Produto.hasMany(VersaoP, { foreignKey: 'idProduto' });
VersaoP.belongsTo(Produto, { foreignKey: 'idProduto' });

// Associações de Produto com Pacote (Muitos para Muitos)
Produto.belongsToMany(Pacote, { through: ProdutoPacotes, foreignKey: 'idProduto', otherKey: 'idPacote' });
Pacote.belongsToMany(Produto, { through: ProdutoPacotes, foreignKey: 'idPacote', otherKey: 'idProduto' });

// Associações de Produto com Orcamento (Muitos para Muitos)
Produto.belongsToMany(Orcamento, { through: ProdutoOrcamento, foreignKey: 'idProduto', otherKey: 'idOrcamento' });
Orcamento.belongsToMany(Produto, { through: ProdutoOrcamento, foreignKey: 'idOrcamento', otherKey: 'idProduto' });

// Associações de Compra com Pacote (Muitos para muitos)
Compra.belongsToMany(Pacote,{ through: PacoteCompras, foreignKey: 'idCompra', otherKey: 'idPacote' });
Pacote.belongsToMany(Compra, { through: PacoteCompras, foreignKey: 'idPacote', otherKey: 'idCompra' });


// Associações de Compra com Utilizador (Muitos para Um)
Compra.belongsTo(Utilizador, { foreignKey: 'idUtilizador' });
Utilizador.hasMany(Compra, { foreignKey: 'idUtilizador' });

// Associações de Orcamento com Utilizador (Muitos para Um)
Orcamento.belongsTo(Utilizador, { foreignKey: 'idUtilizador' });
Utilizador.hasMany(Orcamento, { foreignKey: 'idUtilizador' });


// Associações de Compra com Transacao (Um para Um)
Compra.belongsTo(Transacao, { foreignKey: 'idTransacao' });
Transacao.hasOne(Compra, { foreignKey: 'idTransacao' });

// Associações de Compra com Feedback (Um para Um)
Compra.belongsTo(Feedback, { foreignKey: 'idFeedback' });
Feedback.hasOne(Compra, { foreignKey: 'idFeedback' });


module.exports = {
  Utilizador,
  Perfil,
  VersaoP,
  Produto,
  Pacote,
  Compra,
  Transacao,
  Feedback,
  Orcamento,
};
