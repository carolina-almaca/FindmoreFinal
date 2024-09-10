const Orcamento = require("../model/orcamento");
const Utilizador = require("../model/utilizador");
const Produto = require("../model/produto");
const VersaoP = require("../model/versaoP");
const sequelize = require('../database');
const { Op } = require('sequelize');

// Criar um novo orçamento
exports.createOrcamento = async (req, res) => {
    const { idUtilizador, nomeO, quantidade, estado, justificacao, preco, dataValidade, produtos } = req.body;
    console.log("dados do body:", req.body);
    console.log("dados dos produtos que vêm no orçamento", produtos);
    let transaction;
    try {
        // Inicia uma transação
        transaction = await sequelize.transaction();

        // Verifica se o utilizador existe
        const utilizador = await Utilizador.findByPk(idUtilizador, { transaction });
        if (!utilizador) {
            throw new Error(`Utilizador com ID ${idUtilizador} não encontrado.`);
        }

        // Cria o orçamento
        const orcamento = await Orcamento.create({
            idUtilizador,
            nomeO,
            quantidade,
            estado: 'analise',
        }, { transaction });
        console.log("orçamento:", orcamento);
        // Associar produtos ao orcamento 
        for (const { idProduto, idVersaoP } of produtos) {

            // Associar o produto ao orcamento
            await sequelize.models.ProdutoOrcamento.create({
                idOrcamento: orcamento.idOrcamento,
                idProduto,
                idVersaoP
            }, { transaction });

            console.log(`Produto ${idProduto} com versão ${idVersaoP} adicionado ao pacote ${orcamento.idOrcamento}`);
        }

        // Comita a transação
        await transaction.commit();

        res.status(201).json(orcamento);
    } catch (error) {
        // Rollback na transação em caso de erro
        if (transaction) await transaction.rollback();

        console.error('Erro ao criar o orçamento:', error);
        res.status(500).json({ error: `Erro ao criar o orçamento: ${error.message}` });
    }
};

// Listar todos os orçamentos de um comprador
exports.listaOrcamentosByComprador = async (req, res) => {
    const { idUtilizador } = req.params; // O ID do utilizador será passado como parâmetro da URL

    try {
        

        // Buscar orçamentos associados ao idUtilizador
        const orcamentos = await Orcamento.findAll({
            where: {
                idUtilizador: idUtilizador, // Busca todos os orçamentos com o id do utilizador
            },
            include: [
                {
                  model: Produto,
                  through: {
                    attributes: ['idVersaoP'] // Inclui o idVersaoP na tabela de junção ProdutoPacotes
                  },
                  include: [
                    {
                      model: VersaoP,
                      attributes: ['idVersaoP', 'nomeVersaoP', 'data'], // Seleciona os atributos desejados da versão
                      where: {
                        idVersaoP: {
                          [Op.eq]: sequelize.col('produtos.ProdutoOrcamento.idVersaoP') // Garante que a comparação seja feita corretamente
                        }
                      },
                      required: false // Inclui o produto mesmo se não houver versão associada
                    }
                  ]
                }
              ]
        });

        // Verifica se existem orçamentos
        if (orcamentos.length === 0) {
            return res.status(200).json([]);
        }

        // Retorna a lista de orçamentos
        res.status(200).json(orcamentos);
    } catch (error) {
        console.error('Erro ao listar os orçamentos:', error);
        res.status(500).json({ error: `Erro ao listar os orçamentos: ${error.message}` });
    }
};

// Listar todos os orçamentos que contêm produtos de um utilizador
exports.getOrcamentosDoVendedor = async (req, res) => {
    const { idUtilizador } = req.params;
  
    try {
      // vai buscar todos os produtos do utilizador
      const produtos = await Produto.findAll({
        where: { idUtilizador },
        attributes: ['idProduto'],
      });
  
      if (!produtos || produtos.length === 0) {
        return res.status(404).json({ error: 'Nenhum produto encontrado para este utilizador' });
      }
  
      //Lista os ids dos produtos
      const produtoIds = produtos.map(produto => produto.idProduto);
  
      // Vai buscar os pacotes que contêm esses produtos
      const orcamentos = await Orcamento.findAll({
        include: [
          {
            model: Produto,
            where: { idProduto: produtoIds },
            through: {
                attributes: [], 
              },
              include: [
                {
                  model: VersaoP,
                  attributes: ['idVersaoP', 'nomeVersaoP', 'data'], // Seleciona os atributos desejados da versão
                  where: {
                    idVersaoP: {
                      [Op.eq]: sequelize.col('produtos.ProdutoOrcamento.idVersaoP') // Garante que a comparação seja feita corretamente
                    }
                  },
                  required: false // Inclui o produto mesmo se não houver versão associada
                }
              ]
          },
        ],
      });
  
      if (!orcamentos || orcamentos.length === 0) {
        return res.status(404).json({ error: 'Nenhum orçamento encontrado com produtos deste utilizador' });
      }
  
      res.status(200).json(orcamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Listar todos os orçamentos
exports.getAllOrcamentos = async (req, res) => {
  try {
    const orcamentos = await Orcamento.findAll({
      include: [
        { model: Utilizador , attributes: ['nomeU']}, // Inclui o nome do comprador
        {
          model: Produto,
          through: {
            attributes: []
          },
          include: [
            {
              model: VersaoP,
              attributes: ['idVersaoP', 'nomeVersaoP', 'data'],
              where: {
                idVersaoP: {
                  [Op.eq]: sequelize.col('produtos.ProdutoOrcamento.idVersaoP')
                }
              },
              required: false
            },
            { model: Utilizador, attributes: ['nomeU'] } // Inclui o nome do vendedor
          ]
        }
      ]
    });

    if (!orcamentos || orcamentos.length === 0) {
      return res.status(200).json([]);
    }

    // Manipulação dos dados para renomear as chaves antes de enviar a resposta
    const respostaOrcamentos = orcamentos.map(orcamento => {
      const { utilizador: comprador, produtos, ...orcamentoRest } = orcamento.toJSON(); // Converte a resposta para JSON e renomeia as propriedades
      const produtosModificados = produtos.map(produto => {
        const { utilizador: vendedor, ...produtoRest } = produto; // Renomeia ⁠ utilizador ⁠ para ⁠ vendedor ⁠
        return {
          ...produtoRest,
          vendedor // Adiciona ⁠ vendedor ⁠ no produto
        };
      });
      return {
        ...orcamentoRest,
        comprador, // Renomeia ⁠ utilizador ⁠ para ⁠ comprador ⁠
        produtos: produtosModificados // Atualiza os produtos com a chave ⁠ vendedor ⁠
      };
    });

    res.status(200).json(respostaOrcamentos);
  } catch (error) {
    console.error('Erro ao listar os orçamentos:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obter um orçamento por ID
exports.getOrcamentoById = async (req, res) => {
    try {
        const orcamento = await Orcamento.findByPk(req.params.id, {
            include: [{ model: Utilizador, attributes: ['nomeU'] }]
        });

        if (!orcamento) {
            return res.status(404).json({ error: 'Orçamento não encontrado' });
        }

        res.status(200).json(orcamento);
    } catch (error) {
        console.error('Erro ao obter o orçamento:', error);
        res.status(500).json({ error: error.message });
    }
};

// Atualizar um orçamento
exports.updateOrcamento = async (req, res) => {
    const { id } = req.params;
    const { nomeO, quantidade, estado, justificacao, preco, dataValidade } = req.body;

    let transaction;
    try {
        // Inicia uma transação
        transaction = await sequelize.transaction();

        // Encontra o orçamento pelo ID
        const orcamento = await Orcamento.findByPk(id, { transaction });

        if (!orcamento) {
            return res.status(404).json({ error: 'Orçamento não encontrado' });
        }

        // Atualiza o orçamento
        await orcamento.update({
            nomeO,
            quantidade,
            estado,
            justificacao,
            preco,
            dataValidade
        }, { transaction });

        // Comita a transação
        await transaction.commit();

        res.status(200).json(orcamento);
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Erro ao atualizar o orçamento:', error);
        res.status(500).json({ error: error.message });
    }
};

// Excluir um orçamento por ID
exports.deleteOrcamento = async (req, res) => {
    const { id } = req.params;

    let transaction;
    try {
        // Inicia uma transação
        transaction = await sequelize.transaction();

        // Verifica se o orçamento existe
        const orcamento = await Orcamento.findByPk(id, { transaction });

        if (!orcamento) {
            return res.status(404).json({ error: 'Orçamento não encontrado' });
        }

        // Remove o orçamento
        await orcamento.destroy({ transaction });

        // Comita a transação
        await transaction.commit();

        res.status(200).json({ message: 'Orçamento removido com sucesso' });
    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Erro ao remover o orçamento:', error);
        res.status(500).json({ error: error.message });
    }
};
