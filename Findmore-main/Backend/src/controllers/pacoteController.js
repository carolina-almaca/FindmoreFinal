const Pacote = require("../model/pacote");
const Produto = require("../model/produto");
const Utilizador = require("../model/utilizador");
const VersaoP = require("../model/versaoP");
const sequelize = require('../database');
const { Op } = require('sequelize');

// Criar um novo pacote com produtos associados
exports.createPacote = async (req, res) => {
  const { valor, nomePacote, quantidadePacote, produtos } = req.body;
  console.log("dados dos produtos que vêm no pacote", produtos);

  let transaction;
  try {
    // Iniciar uma transação
    transaction = await sequelize.transaction();

    // Verificar se os produtos existem e têm stock suficiente
    for (const { idProduto } of produtos) {
      const produto = await Produto.findByPk(idProduto, { transaction });

      if (!produto) {
        throw new Error(`Produto com ID ${idProduto} não encontrado.`);
      }

      // Verificar se o stock é suficiente
      if (produto.stock < quantidadePacote) {
        throw new Error(`Stock insuficiente para o produto ${produto.nomeP}. Quantidade disponível: ${produto.stock}, Quantidade necessária: ${quantidadePacote}`);
      }
    }

    // Criar o pacote
    const pacote = await Pacote.create({
      valor,
      nomePacote,
      quantidadePacote,
      orcamento : false,
    }, { transaction });

    // Associar produtos ao pacote e atualizar o stock
    for (const { idProduto, idVersaoP } of produtos) {
      const produto = await Produto.findByPk(idProduto, { transaction });

      // Atualizar o stock do produto
      produto.stock -= quantidadePacote;
      await produto.save({ transaction });

      // Associar o produto ao pacote
      await sequelize.models.ProdutoPacotes.create({
        idPacote: pacote.idPacote,
        idProduto,
        idVersaoP
      }, { transaction });

      console.log(`Produto ${idProduto} com versão ${idVersaoP} adicionado ao pacote ${pacote.idPacote}`);
    }

    // Comitar a transação
    await transaction.commit();

    res.status(201).json(pacote);
    console.log('Pacote criado com sucesso:', pacote);
  } catch (error) {
    // Dar rollback na transação em caso de erro
    if (transaction) await transaction.rollback();

    console.error('Erro ao criar o pacote:', error);
    res.status(500).json({ error:`Erro ao criar o pacote: ${error.message}` });
  }
};



// Criar um novo pacote pedido num orçamento
exports.createPacoteOrcamento = async (req, res) => {
  const { valor, nomePacote, quantidadePacote,idOrcamento, produtos } = req.body;
  console.log("dados dos produtos que vêm no pacote", produtos);

  let transaction;
  try {
    // Iniciar uma transação
    transaction = await sequelize.transaction();

   
    // Criar o pacote
    const pacote = await Pacote.create({
      valor,
      nomePacote,
      quantidadePacote,
      orcamento : true,
      idOrcamento,
    }, { transaction });

    // Associar produtos ao pacote
    for (const { idProduto, idVersaoP } of produtos) {
     
      // Associar o produto ao pacote
      await sequelize.models.ProdutoPacotes.create({
        idPacote: pacote.idPacote,
        idProduto,
        idVersaoP
      }, { transaction });

      console.log(`Produto ${idProduto} com versão ${idVersaoP} adicionado ao pacote ${pacote.idPacote}`);
    }

    // Comitar a transação
    await transaction.commit();

    res.status(201).json(pacote);
    console.log('Pacote pedido no orçamento criado com sucesso:', pacote);
  } catch (error) {
    // Dar rollback na transação em caso de erro
    if (transaction) await transaction.rollback();

    console.error('Erro ao criar o pacote pedido no orçamento :', error);
    res.status(500).json({ error:`Erro ao criar o pacote pedido no orçamento : ${error.message}` });
  }
};


// Listar os produtos de um pacote com todas as informações e a versão correta
exports.getPacoteProdutos = async (req, res) => {
  const { idPacote } = req.params;

  try {
    // Busca o pacote pelo ID e inclui os produtos associados com o idVersaoP
    const pacote = await Pacote.findByPk(idPacote, {
      include: [
        {
          model: Produto,
          through: {
            attributes: ['idVersaoP'] // Inclui o idVersaoP na tabela de junção ProdutoPacotes
          }
        }
      ]
    });

    // Verifica se o pacote existe
    if (!pacote) {
      return res.status(404).json({ error: 'Pacote não encontrado' });
    }

    // Vai buscar os produtos associados ao pacote com suas versões
    const produtosComVersoes = await Promise.all(
      pacote.produtos.map(async (produto) => {
        // Buscar a versão correta usando o idVersaoP da tabela ProdutoPacotes
        const versao = await VersaoP.findByPk(produto.ProdutoPacotes.idVersaoP);

        // Retorna todos os detalhes do produto e da versão associada
        return {
          ...produto.toJSON(), // Inclui todos os detalhes do produto
          versaoPs: versao ? versao.toJSON() : null // Inclui os detalhes da versão (ou null se não encontrada)
        };
      })
    );

    // Devolve a lista de produtos com todas as informações e suas versões como resposta
    res.status(200).json(produtosComVersoes);
  } catch (error) {
    // Devolve um erro na resposta
    res.status(500).json({ error: error.message });
  }
};


// Listar todos os pacotes que contêm produtos de um utilizador
exports.getPacotesByUtilizador = async (req, res) => {
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
    const pacotes = await Pacote.findAll({
      include: [
        {
          model: Produto,
          where: { idProduto: produtoIds },
          through: { attributes: [] },
        },
      ],
    });

    if (!pacotes || pacotes.length === 0) {
      return res.status(404).json({ error: 'Nenhum pacote encontrado com produtos deste utilizador' });
    }

    res.status(200).json(pacotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPacotesWithProdutos = async (req, res) => {
  try {
    const pacotes = await Pacote.findAll({
      include: [
        {
          model: Produto,
          through: { attributes: ['idVersaoP'] }, // Inclui o idVersaoP na tabela de junção
          include: [
            {
              model: VersaoP,
              attributes: ['idVersaoP', 'nomeVersaoP', 'data'], // Seleciona os atributos desejados da versão
              where: {
                idVersaoP: {
                  [Op.eq]: sequelize.col('produtos.ProdutoPacotes.idVersaoP') // Garante que a comparação seja feita corretamente
                }
              },
              required: false // Inclui o produto mesmo se não houver versão associada
            }
          ]
        }
      ]
    });

    if (!pacotes || pacotes.length === 0) {
      return res.status(200).json([]); // Retorna um array vazio se nenhum pacote for encontrado
    }

    res.status(200).json(pacotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Obter um pacote por ID
exports.getPacoteById = async (req, res) => {
  try {
    const pacote = await Pacote.findByPk(req.params.id);
    if (!pacote) {
      return res.status(404).json({ error: 'Pacote não encontrado' });
    }
    res.status(200).json(pacote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePacote = async (req, res) => {
  const { id } = req.params;
  const { valor, nomePacote, quantidadePacote, produtos } = req.body;

  let transaction;
  try {
    // Inicia uma transação
    transaction = await sequelize.transaction();

    // Encontra o pacote pelo ID
    const pacote = await Pacote.findByPk(id, { transaction });

    if (!pacote) {
      return res.status(404).json({ error: 'Pacote não encontrado' });
    }

    // Atualiza os dados do pacote
    await pacote.update({
      valor,
      nomePacote,
      quantidadePacote
    }, { transaction });

    console.log('Pacote atualizado:', pacote);

    // Atualiza os produtos e as versões associadas ao pacote
    if (produtos && produtos.length > 0) {
      console.log('Produtos fornecidos para atualização:', produtos);

      // Encontra os produtos atualmente associados ao pacote
      const produtosAtuais = await pacote.getProdutos({
        joinTableAttributes: ['idVersaoP'], // Inclui o idVersaoP na busca
        transaction
      });

      // Mapeia os IDs dos produtos e versões atualmente associados
      const produtosAtuaisMap = produtosAtuais.map(produto => ({
        idProduto: produto.idProduto,
        idVersaoP: produto.ProdutoPacotes.idVersaoP
      }));

      // Identifica os produtos a adicionar e a remover
      const produtosParaAdicionar = produtos.filter(p => !produtosAtuaisMap.some(pa => pa.idProduto === p.idProduto && pa.idVersaoP === p.idVersaoP));
      const produtosParaRemover = produtosAtuaisMap.filter(pa => !produtos.some(p => p.idProduto === pa.idProduto && p.idVersaoP === pa.idVersaoP));

      console.log('Produtos para adicionar:', produtosParaAdicionar);
      console.log('Produtos para remover:', produtosParaRemover);

      // Remove os produtos que não devem mais estar associados
      if (produtosParaRemover.length > 0) {
        for (const produto of produtosParaRemover) {
          await sequelize.models.ProdutoPacotes.destroy({
            where: {
              idPacote: id,
              idProduto: produto.idProduto,
              idVersaoP: produto.idVersaoP
            },
            transaction
          });
        }
        console.log('Produtos removidos do pacote:', produtosParaRemover);
      }

      // Adiciona os novos produtos com as versões correspondentes
      for (const { idProduto, idVersaoP } of produtosParaAdicionar) {
        await sequelize.models.ProdutoPacotes.create({
          idPacote: id,
          idProduto,
          idVersaoP
        }, { transaction });
        console.log(`Produto ${idProduto} com versão ${idVersaoP} adicionado ao pacote ${id}`);
      }
    } else {
      console.log('Nenhum produto fornecido para atualização');
    }

    // Comita a transação
    await transaction.commit();

    // Devolve o pacote atualizado como resposta
    res.status(200).json(pacote);
    console.log('Pacote atualizado com sucesso:', pacote);
  } catch (error) {
    // Dá rollback na transação em caso de erro
    if (transaction) await transaction.rollback();

    console.error('Erro ao atualizar o pacote:', error);
    res.status(500).json({ error: error.message });
  }
};



// Excluir um pacote por ID
exports.deletePacote = async (req, res) => {
  const { id } = req.params; // Recebe 'id' do frontend
  const idPacote = id; // Renomeia 'id' para 'idPacote'

  let transaction;
  try {
    console.log('Iniciando exclusão do pacote:', idPacote);

    // Inicia uma transação
    transaction = await sequelize.transaction();
    console.log('Transação iniciada');

    // Verifica se o pacote existe
    const pacote = await Pacote.findByPk(idPacote, { transaction });
    console.log('Pacote encontrado:', pacote);

    if (!pacote) {
      console.log('Pacote não encontrado');
      return res.status(404).json({ error: 'Pacote não encontrado' });
    }

    // Remove as associações na tabela ProdutoPacotes
    const produtoPacotesDestruidos = await sequelize.models.ProdutoPacotes.destroy({
      where: { idPacote },
      transaction
    });
    console.log(`Associações na tabela ProdutoPacotes removidas para o pacote ${idPacote}, entradas removidas: ${produtoPacotesDestruidos}`);

    // Remove o pacote
    await pacote.destroy({ transaction });
    console.log(`Pacote ${idPacote} removido com sucesso`);

    // Comita a transação
    await transaction.commit();
    console.log('Transação comitada');

    res.status(200).json({ message: 'Pacote removido com sucesso' });
  } catch (error) {
    // Dá rollback na transação em caso de erro
    if (transaction) {
      console.log('Erro ocorrido, dando rollback na transação');
      await transaction.rollback();
    }

    console.error('Erro ao remover o pacote:', error);
    res.status(500).json({ error: error.message });
  }
};

