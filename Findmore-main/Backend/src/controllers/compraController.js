const Compra = require("../model/compra");
const Utilizador = require('../model/utilizador');
const Transacao = require('../model/transacao');
const Feedback = require('../model/feedback');
const Produto = require('../model/produto');
const Pacote = require('../model/pacote');
const VersaoP = require("../model/versaoP");
const sequelize = require('../database');
const { Op } = require('sequelize');


// Criar nova compra de um produto e a versãoP com transação, feedback e atualização de stock
exports.createCompra = async (req, res) => {
  const { idUtilizador, idProduto, idVersaoP, valorTotal, descricao, quantidade, dataCompra, nomeCartao, numeroCartao, validadeCartao, CVV, comentario, avaliacao,orcamento } = req.body;
  console.log("req body: ",req.body);
  let transaction;
  try {
    // Inicia uma transação
    transaction = await sequelize.transaction();
    console.log("Transação iniciada");

    // Cria a compra
    const compra = await Compra.create({
      idUtilizador,
      valorTotal,
      descricao,
      quantidade,
      dataCompra,
      orcamento
    }, { transaction });
    console.log("Compra criada:", compra);

    // Cria a transação associada
    const transacao = await Transacao.create({
      idCompra: compra.idCompra,
      nomeCartao,
      numeroCartao,
      validadeCartao,
      CVV,
    }, { transaction });
    console.log("Transação criada:", transacao);

    // Cria o feedback associado
    const feedback = await Feedback.create({
      idCompra: compra.idCompra,
      comentario,
      avaliacao
    }, { transaction });
    console.log("Feedback criado:", feedback);

    // Atualiza a compra com idTransacao e idFeedback
    await compra.update({
      idTransacao: transacao.idTransacao,
      idFeedback: feedback.idFeedback
    }, { transaction });
    console.log("Compra atualizada com idTransacao e idFeedback");

    // Adicionar a entrada na tabela ProdutoCompras
    await sequelize.models.ProdutoCompras.create({
      idCompra: compra.idCompra,
      idProduto: idProduto,
      idVersaoP: idVersaoP,
    }, { transaction });
    console.log("Entrada adicionada à tabela ProdutoCompras");

    // Atualiza o stock do produto
    const produto = await Produto.findByPk(idProduto, { transaction });
    if (!produto) {
      throw new Error(`Produto com ID ${idProduto} não encontrado`);
    }
    console.log("Produto encontrado:", produto);

    const novoStock = produto.stock - quantidade;
    console.log("Novo stock calculado:", novoStock);

    if (novoStock < 0) {
      throw new Error(`Quantidade de stock insuficiente para o produto ${produto.nomeP}`);
    }

    await produto.update({ stock: novoStock }, { transaction });
    console.log("Stock do produto atualizado");

    // Comita a transação
    await transaction.commit();
    console.log("Transação comitada com sucesso");

    res.status(201).json(compra);
  } catch (error) {
    // Dá rollback na transação em caso de erro
    if (transaction) {
      await transaction.rollback();
      console.log("Rollback da transação realizado");
    }

    console.error("Erro ao criar compra:", error.message);
    res.status(500).json({ error: error.message });
  }
};


// Criar nova compra de pacote com transação, feedback e atualização de stock dos produtos
exports.createCompraPacote = async (req, res) => {
  const { idUtilizador, idPacote, valorTotal, descricao, quantidade, dataCompra, nomeCartao, numeroCartao, validadeCartao, CVV, comentario, avaliacao,orcamento } = req.body;

  let transaction;
  try {
    // Inicia uma transação
    transaction = await sequelize.transaction();
    console.log('Transação iniciada');

    // Cria a compra
    const compra = await Compra.create({
      idUtilizador,
      valorTotal,
      descricao,
      quantidade,
      dataCompra,
      orcamento
    }, { transaction });
    console.log('Compra criada:', compra.toJSON());

    // Cria a transação associada
    const transacao = await Transacao.create({
      idCompra: compra.idCompra,
      nomeCartao,
      numeroCartao,
      validadeCartao,
      CVV,
    }, { transaction });
    console.log('Transação criada:', transacao.toJSON());

    // Cria o feedback associado
    const feedback = await Feedback.create({
      idCompra: compra.idCompra,
      comentario,
      avaliacao
    }, { transaction });
    console.log('Feedback criado:', feedback.toJSON());

    // Atualiza a compra com idTransacao e idFeedback
    await compra.update({
      idTransacao: transacao.idTransacao,
      idFeedback: feedback.idFeedback
    }, { transaction });
    console.log('Compra atualizada com idTransacao e idFeedback');

    // Adicionar a entrada na tabela PacoteCompra
    await sequelize.models.PacoteCompra.create({
      idCompra: compra.idCompra,
      idPacote: idPacote,
    }, { transaction });
    console.log('Entrada na tabela PacoteCompra criada');

    // Procura o pacote e seus produtos associados
    const pacote = await Pacote.findByPk(idPacote, {
      include: [{
        model: Produto,
      }],
      transaction
    });

    if (!pacote) {
      throw new Error(`Pacote com ID ${idPacote} não encontrado`);
    }
    console.log('Pacote encontrado:', pacote.toJSON());

    // Atualiza o stock dos produtos do pacote
    for (const produto of pacote.produtos) {
      const { idProduto } = produto.Produtos || {};

      if (!produto) {
        throw new Error(`Produto com ID ${idProduto} não encontrado`);
      }

      const novoStock = produto.stock - quantidade;
      if (novoStock < 0) {
        throw new Error(`Quantidade de stock insuficiente para o produto ${produto.nomeP}`);
      }

      await produto.update({ stock: novoStock }, { transaction });

    }

    // Comita a transação
    await transaction.commit();
    console.log('Transação comitada');

    res.status(201).json(compra);
  } catch (error) {
    // Dá rollback na transação em caso de erro
    if (transaction) {
      console.log('Erro ocorrido, dando rollback na transação');
      await transaction.rollback();
    }

    console.error('Erro ao criar a compra de pacote:', error);
    res.status(500).json({ error: error.message });
  }
};



// Obter todas as compras
exports.getAllCompras = async (req, res) => {
  try {
    // Obtenha todas as compras
    const compras = await Compra.findAll({
      include: [
        { model: Feedback },
        { model: Transacao },
        {
          model: Produto,
          include: [{ model: Utilizador, attributes: ['nomeU', 'email'] }], // Inclui o nome do vendedor
          through: { attributes: ['idVersaoP'] }  // Exclui atributos da tabela de junção
        },
        {
          model: Pacote,
          include: [
            {
              model: Produto,
              include: [{ model: Utilizador, attributes: ['nomeU', 'email'] }], // Inclui o nome do vendedor
              through: { attributes: [] }  // Exclui atributos da tabela de junção
            }
          ],
          through: { attributes: [] }
        },
      ]
    });

    console.log('Compras Encontradas:', JSON.stringify(compras, null, 2)); // Log das compras encontradas

    if (compras.length === 0) {
      return res.status(404).json({ error: 'Nenhuma compra encontrada.' });
    }

    // Estrutura a resposta para separar pacotes e produtos
  // Busque o comprador de cada compra
  const response = await Promise.all(compras.map(async (compra) => {
    // Obtenha o comprador
    const comprador = await Utilizador.findByPk(compra.idUtilizador);

      return {
        Compra: {
          idCompra: compra.idCompra,
          idUtilizador: compra.idUtilizador,
          idTransacao: compra.idTransacao,
          idFeedback: compra.idFeedback,
          valorTotal: compra.valorTotal,
          descricao: compra.descricao,
          dataCompra: compra.dataCompra,
          quantidade: compra.quantidade
        },
        Comprador: comprador ? {
          idUtilizador: comprador.idUtilizador,
          nomeU: comprador.nomeU,
          email: comprador.email
        } : null,
        Feedback: compra.feedback,
        Transacao: compra.transacao,
        Produtos: await Promise.all(compra.produtos.map(async (produto) => {
          // Busca os dados da versão específica
          const versaoP = await VersaoP.findByPk(produto.ProdutoCompras.idVersaoP);

          return {
            idProduto: produto.idProduto,
            nomeP: produto.nomeP,
            preco: produto.preco,
            imagem: produto.imagem,
            descricao: produto.descricao,
            categoria: produto.categoria,
            miniDescricao: produto.miniDescricao,
            licenca: produto.licenca,
            stock: produto.stock,
            VersaoP: versaoP ? {
              idVersaoP: versaoP.idVersaoP,
              nomeVersaoP: versaoP.nomeVersaoP
            } : null,
            Vendedor: produto.utilizador
          };
        })),
        Pacotes: compra.pacotes.map(pacote => ({
          idPacote: pacote.idPacote,
          valor: pacote.valor,
          nomePacote: pacote.nomePacote,
          quantidadePacote: pacote.quantidadePacote,
          Produtos: pacote.produtos.map(produto => ({
            idProduto: produto.idProduto,
            nomeP: produto.nomeP,
            preco: produto.preco,
            imagem: produto.imagem,
            descricao: produto.descricao,
            categoria: produto.categoria,
            miniDescricao: produto.miniDescricao,
            licenca: produto.licenca,
            stock: produto.stock,
            Vendedor: produto.utilizador
          }))
        }))
      };
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro:', error.message); // Log do erro
    res.status(500).json({ error: error.message });
  }
};


// Obter uma compra por ID
exports.getCompraById = async (req, res) => {
  try {
    const compra = await Compra.findByPk(req.params.id);
    if (!compra) {
      return res.status(404).json({ error: 'Compra não encontrada' });
    }
    res.status(200).json(compra);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar uma compra por ID
exports.updateCompra = async (req, res) => {
  try {
    const [updated] = await Compra.update(req.body, {
      where: { idCompra: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: 'Compra não encontrada' });
    }
    const updatedCompra = await Compra.findByPk(req.params.id);
    res.status(200).json(updatedCompra);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Excluir uma compra por ID
exports.deleteCompra = async (req, res) => {
  try {
    const deleted = await Compra.destroy({
      where: { idCompra: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Compra não encontrada' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar todas as compras de produtos feitas pelo comprador
exports.getComprasByComprador = async (req, res) => {
  const { idUtilizador } = req.params;

  try {
    // Obtenha todas as compras do comprador
    const compras = await Compra.findAll({
      where: { idUtilizador },
      include: [
        { model: Feedback },
        { model: Transacao },
        {
          model: Produto,
          include: [{ model: Utilizador, attributes: ['nomeU'] }], // Inclui o nome do vendedor
          through: { attributes: [] }  // Exclui atributos da tabela de junção
        },
        {
          model: Pacote,
          through: { attributes: [] }  // Exclui atributos da tabela de junção
        },
      ]
    });

    console.log('Compras Encontradas:', JSON.stringify(compras, null, 2)); // Log das compras encontradas

    // Filtra as compras para incluir apenas aquelas que têm produtos
    const comprasProdutos = compras.filter(compra => compra.produtos && compra.produtos.length > 0);

    if (comprasProdutos.length === 0) {
      return res.status(404).json({ error: 'Compras de produtos não encontradas para este utilizador' });
    }

    // Estrutura a resposta para incluir o nome do comprador separadamente e as categorias desejadas
    const response = await Promise.all(compras.map(async (compra) => {
      // Busca a versão específica na tabela ProdutoCompras
      let produtoCompra = null;
      try {
        produtoCompra = await sequelize.models.ProdutoCompras.findOne({
          where: { idCompra: compra.idCompra }
        });
      } catch (err) {
        console.error("Erro ao buscar ProdutoCompra:", err.message);
      }
      
      if (!produtoCompra) {
        return {
          Compra: {
            idCompra: compra.idCompra,
            idUtilizador: compra.idUtilizador,
            idTransacao: compra.idTransacao,
            idFeedback: compra.idFeedback,
            valorTotal: compra.valorTotal,
            descricao: compra.descricao,
            dataCompra: compra.dataCompra,
            quantidade: compra.quantidade
          },
          Feedback: {
            idFeedback: compra.feedback.idFeedback,
            idCompra: compra.feedback.idCompra,
            comentario: compra.feedback.comentario,
            avaliacao: compra.feedback.avaliacao
          },
          Transacao: {
            idTransacao: compra.transacao.idTransacao,
            idCompra: compra.transacao.idCompra,
            nomeCartao: compra.transacao.nomeCartao,
            numeroCartao: compra.transacao.numeroCartao,
            validadeCartao: compra.transacao.validadeCartao,
            CVV: compra.transacao.CVV
          },
          Produto: null,
          VersaoP: null,
          Vendedor: null
        };
      }

      // Busca s dados da versão específica
      const versaoP = await VersaoP.findByPk(produtoCompra.idVersaoP);
      //console.log("VersaoP:", versaoP);

      // Busca os dados do produto usando o idProduto
      const produto = await Produto.findByPk(produtoCompra.idProduto);
      console.log("Produto:", produto);

      const vendedor= await Utilizador.findByPk(produto.idUtilizador);
      console.log("vendedor:", vendedor);

      return {
        Compra: {
          idCompra: compra.idCompra,
          idUtilizador: compra.idUtilizador,
          idTransacao: compra.idTransacao,
          idFeedback: compra.idFeedback,
          valorTotal: compra.valorTotal,
          descricao: compra.descricao,
          dataCompra: compra.dataCompra,
          quantidade: compra.quantidade
        },
        Feedback: {
          idFeedback: compra.feedback.idFeedback,
          idCompra: compra.feedback.idCompra,
          comentario: compra.feedback.comentario,
          avaliacao: compra.feedback.avaliacao
        },
        Transacao: {
          idTransacao: compra.transacao.idTransacao,
          idCompra: compra.transacao.idCompra,
          nomeCartao: compra.transacao.nomeCartao,
          numeroCartao: compra.transacao.numeroCartao,
          validadeCartao: compra.transacao.validadeCartao,
          CVV: compra.transacao.CVV
        },
        Produto: produto ? {
          idProduto: produto.idProduto,
          idUtilizador: produto.idUtilizador,
          nomeP: produto.nomeP,
          preco: produto.preco,
          imagem: produto.imagem,
          descricao: produto.descricao,
          categoria: produto.categoria,
          miniDescricao: produto.miniDescricao,
          licenca: produto.licenca,
          stock: produto.stock
        } : null,
        VersaoP: versaoP ? {
          idVersaoP: versaoP.idVersaoP,
          nomeVersaoP: versaoP.nomeVersaoP
        } : null,
        Vendedor:vendedor ? {
          nomeU:vendedor.nomeU,
          email: vendedor.email,
        } : null
      };
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro:', error.message); // Log do erro
    res.status(500).json({ error: error.message });
  }
};

// Listar todas as compras de pacotes feitas pelo comprador
exports.getComprasDePacotesByComprador = async (req, res) => {
  const { idUtilizador } = req.params;

  try {
    const compras = await Compra.findAll({
      where: { idUtilizador },
      include: [
        {
          model: Pacote,
          include: [
            {
              model: Produto,
              include: [{ model: Utilizador, attributes: ['nomeU', 'email'] }], // Inclui o nome do vendedor
              through: { attributes: [] }  // Exclui atributos da tabela de junção
            }
          ],
          through: { attributes: [] }  // Exclui atributos da tabela de junção
        },
        { model: Feedback },
        { model: Transacao }
      ]
    });

    // Filtra as compras para incluir apenas aquelas que têm pacotes
    const comprasDePacotes = compras.filter(compra => compra.pacotes && compra.pacotes.length > 0);

    if (comprasDePacotes.length === 0) {
      return res.status(404).json({ error: 'Nenhuma compra de pacotes encontrada para este utilizador' });
    }
    const response = comprasDePacotes.map(compra => {
      const vendedores = [];

      compra.pacotes.forEach(pacote => {
        pacote.produtos.forEach(produto => {
          if (produto.utilizador && !vendedores.includes(produto.utilizador.nomeU)) {
            vendedores.push(produto.utilizador);
          }
        });
      });

      return {
        ...compra.get({ plain: true }),
        vendedores
      };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getComprasByVendedor = async (req, res) => {
  const { idUtilizador } = req.params;

  try {
    // Busca todos os produtos do vendedor
    const produtos = await Produto.findAll({
      where: { idUtilizador },
      include: [
        {
          model: Compra,
          include: [
            { model: Feedback },
            { model: Transacao },
            { model: Utilizador, attributes: ['nomeU'] } // Inclui o nome do comprador
          ],
          through: { attributes: [] } // Exclui atributos da tabela de junção
        }
      ]
    });

    // Lista todas as compras associadas aos produtos do vendedor
    const compras = produtos.reduce((acc, produto) => {
      produto.compras.forEach(compra => {
        if (!acc.find(c => c.idCompra === compra.idCompra)) {
          acc.push(compra);
        }
      });
      return acc;
    }, []);

    // Verifica se há compras encontradas
    if (compras.length === 0) {
      return res.status(404).json({ error: 'Compras não encontradas para os produtos deste vendedor' });
    }

    // Estrutura a resposta para incluir o nome do comprador separadamente e as categorias desejadas
    const response = await Promise.all(compras.map(async (compra) => {
      // Busca a versão específica na tabela ProdutoCompras
      const produtoCompra = await sequelize.models.ProdutoCompras.findOne({
        where: { idCompra: compra.idCompra }
      });

      // Busca os dados do produto usando o idProduto
      const produto = await Produto.findByPk(produtoCompra.idProduto);

      // Busca os dados da versão específica
      const versaoP = await VersaoP.findByPk(produtoCompra.idVersaoP);

      return {
        Compra: {
          idCompra: compra.idCompra,
          idUtilizador: compra.idUtilizador,
          idTransacao: compra.idTransacao,
          idFeedback: compra.idFeedback,
          valorTotal: compra.valorTotal,
          descricao: compra.descricao,
          dataCompra: compra.dataCompra,
          quantidade: compra.quantidade
        },
        Feedback: {
          idFeedback: compra.feedback.idFeedback,
          idCompra: compra.feedback.idCompra,
          comentario: compra.feedback.comentario,
          avaliacao: compra.feedback.avaliacao
        },
        Transacao: {
          idTransacao: compra.transacao.idTransacao,
          idCompra: compra.transacao.idCompra,
          nomeCartao: compra.transacao.nomeCartao,
          numeroCartao: compra.transacao.numeroCartao,
          validadeCartao: compra.transacao.validadeCartao,
          CVV: compra.transacao.CVV
        },
        Produto: {
          idProduto: produto.idProduto,
          idUtilizador: produto.idUtilizador,
          nomeP: produto.nomeP,
          preco: produto.preco,
          imagem: produto.imagem,
          descricao: produto.descricao,
          categoria: produto.categoria,
          miniDescricao: produto.miniDescricao,
          licenca: produto.licenca,
          stock: produto.stock
        },
        VersaoP: versaoP ? {
          idVersaoP: versaoP.idVersaoP,
          nomeVersaoP: versaoP.nomeVersaoP
        } : null,
        Comprador: {
          nomeU: compra.utilizador ? compra.utilizador.nomeU : null
        }
      };
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.getComprasPacotesByVendedor = async (req, res) => {
  const { idUtilizador } = req.params;

  try {
    // Encontrar todos os produtos do vendedor
    const produtos = await Produto.findAll({
      where: { idUtilizador },
      include: [
        {
          model: Pacote,
          through: { attributes: [] },  // Exclui atributos da tabela de junção
        }
      ]
    });

    // Listar todos os IDs dos pacotes que têm os produtos do vendedor
    const pacoteIds = produtos.reduce((acc, produto) => {
      produto.pacotes.forEach(pacote => {
        if (!acc.includes(pacote.idPacote)) {
          acc.push(pacote.idPacote);
        }
      });
      return acc;
    }, []);

    // Listar todas as compras que contêm esses pacotes
    const compras = await Compra.findAll({
      include: [
        {
          model: Pacote,
          where: { idPacote: pacoteIds },
          through: { attributes: [] },  // Exclui atributos da tabela de junção
          include: [
            {
              model: Produto,
              through: { attributes: [] }  // Exclui atributos da tabela de junção
            }
          ]
        },
        { model: Feedback },
        { model: Transacao },
        { model: Utilizador, attributes: ['nomeU'] }, // Inclui o nome do comprador
      ]
    });

    if (compras.length === 0) {
      return res.status(404).json({ error: 'Nenhuma compra encontrada para os pacotes com produtos deste vendedor' });
    }

    // Estruturar a resposta para renomear 'utilizador' para 'comprador'
    const response = compras.map(compra => ({
      idCompra: compra.idCompra,
      idUtilizador: compra.idUtilizador,
      idTransacao: compra.idTransacao,
      idFeedback: compra.idFeedback,
      valorTotal: compra.valorTotal,
      descricao: compra.descricao,
      dataCompra: compra.dataCompra,
      quantidade: compra.quantidade,
      pacote: compra.pacotes.map(pacote => ({
        idPacote: pacote.idPacote,
        valor: pacote.valor,
        nomePacote: pacote.nomePacote,
        quantidadePacote: pacote.quantidadePacote,
        produtos: pacote.produtos.map(produto => ({
          idProduto: produto.idProduto,
          idUtilizador: produto.idUtilizador,
          nomeP: produto.nomeP,
          preco: produto.preco,
          imagem: produto.imagem,
          descricao: produto.descricao,
          categoria: produto.categoria,
          miniDescricao: produto.miniDescricao,
          licenca: produto.licenca,
          stock: produto.stock
        }))
      })),
      feedback: {
        idFeedback: compra.feedback.idFeedback,
        idCompra: compra.feedback.idCompra,
        comentario: compra.feedback.comentario,
        avaliacao: compra.feedback.avaliacao
      },
      transacao: {
        idTransacao: compra.transacao.idTransacao,
        idCompra: compra.transacao.idCompra,
        nomeCartao: compra.transacao.nomeCartao,
        numeroCartao: compra.transacao.numeroCartao,
        validadeCartao: compra.transacao.validadeCartao,
        CVV: compra.transacao.CVV
      },
      comprador: compra.utilizador ? compra.utilizador.nomeU : null
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

