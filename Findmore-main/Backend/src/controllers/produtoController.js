const Produto = require("../model/produto");
const VersaoP = require("../model/versaoP");
const sequelize = require('../database');
const { Op } = require('sequelize');

// Criar novo produto
exports.createProduto = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    // Cria o produto dentro de uma transação
    const produto = await Produto.create(req.body, { transaction: t });

    // Cria a primeira versão do produto
    const versaoP = await VersaoP.create({
      idProduto: produto.idProduto,
      nomeVersaoP: req.body.versaoP, 
      data: req.body.versaoData || new Date()  
    }, { transaction: t });

    // Confirma a transação
    await t.commit();

    res.status(201).json({ produto, versaoP });
  } catch (error) {
    // Em caso de erro, desfaz a transação
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Obter todos os produtos
exports.getAllProdutos = async (req, res) => {
  try {
    const produtos = await Produto.findAll({
      include: [{
        model: VersaoP,
      }]
    });
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter todos os produtos com stock maior que zero para o comprador ver os que pode comprar
exports.getAllProdutosComStock = async (req, res) => {
  try {
    const produtos = await Produto.findAll({
      where: {
        stock: {
          [Op.gt]: 0 // Utiliza operador greater than (>) para encontrar stock maior que zero
        }
      },
      include: [{
        model: VersaoP,
      }]
    });
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter um produto por ID
exports.getProdutoById = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id, {
      include: [{
        model: VersaoP,
      }]
    });
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um produto por ID
exports.updateProduto = async (req, res) => {
  const { id } = req.params;
  console.log("req.params", req.params);
 
  try {
    // Atualizar o produto
    const [updated] = await Produto.update(req.body, {
      where: { idProduto: req.params.id},
    });

    if (!updated) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// adicionar nova versão ao produto
exports.addVersaoP = async (req, res) => {
 
  try {
    // Cria uma nova versão do produto
    const versaoP = await VersaoP.create({
      idProduto: req.body.idProduto,
      nomeVersaoP: req.body.versaoP, 
      data: req.body.versaoData || new Date()  
    });
    res.status(201).json({ versaoP });
  } catch (error) {
  
    res.status(500).json({ error: error.message });
  }
};
// Excluir um produto por ID
exports.deleteProduto = async (req, res) => {
  const { id } = req.params;
  const idProduto = id;

  let transaction;
  try {
    // Inicia uma transação
    transaction = await sequelize.transaction();

    // Verifica se o produto existe
    const produto = await Produto.findByPk(idProduto, { transaction });

    if (!produto) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Produto não foi encontrado' });
    }

    // Verifica se o produto está associado a algum pacote na tabela ProdutoPacotes
    const produtoPacotes = await sequelize.models.ProdutoPacotes.findOne({
      where: { idProduto },
      transaction
    });

    if (produtoPacotes) {
      await transaction.rollback();
      console.log(`Produto ${idProduto} está associado a um ou mais pacotes`);
      return res.status(400).json({ error: 'Produto não pode ser removido porque está associado a um ou mais pacotes' });
    }

    // Verifica se o produto está associado a alguma compra na tabela ProdutoCompras
    const produtoCompras = await sequelize.models.ProdutoCompras.findOne({
      where: { idProduto },
      transaction
    });

    if (produtoCompras) {
      await transaction.rollback();
      console.log(`Produto ${idProduto} foi comprado e não pode ser removido`);
      return res.status(400).json({ error: 'Produto não pode ser removido porque foi comprado' });
    }

    // Remove todas as versões associadas ao produto
    await VersaoP.destroy({
      where: { idProduto },
      transaction
    });
    console.log(`Versões do produto ${idProduto} removidas com sucesso`);

    // Remove o produto
    await produto.destroy({ transaction });
    console.log(`Produto ${idProduto} removido com sucesso`);

    // Comita a transação
    await transaction.commit();

    res.status(200).json({ message: 'Produto e suas versões removidos com sucesso' });
  } catch (error) {
    // Dá rollback na transação em caso de erro
    if (transaction) {
      console.log('Erro ocorrido, dando rollback na transação');
      await transaction.rollback();
    }

    console.error('Erro ao remover o produto:', error);
    res.status(500).json({ error: error.message });
    console.log('Erro enviado na resposta:', res);
  }
};







