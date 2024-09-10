const Utilizador = require("../model/utilizador");
const Perfil = require("../model/perfil");
const Produto = require("../model/produto");
const Compra = require("../model/compra");
const Pacote = require('../model/pacote');
const Feedback = require("../model/feedback");
const sequelize = require('../database');

const { Op, fn, col, Sequelize } = require('sequelize');


// Obter estatísticas gerais
exports.getEstatisticasGerais = async (req, res) => {
    try {
        // Contar total de compradores (perfil ID 2)
        const totalCompradores = await Utilizador.count({
            include: {
                model: Perfil,
                where: {
                    idPerfil: 2 // ID do perfil de comprador
                },
                through: {
                    attributes: []
                }
            }
        });

        // Contar total de vendedores (perfil ID 3)
        const totalVendedores = await Utilizador.count({
            include: {
                model: Perfil,
                where: {
                    idPerfil: 3 // ID do perfil de vendedor
                },
                through: {
                    attributes: []
                }
            }
        });

        // Contar total de produtos
        const totalProdutos = await Produto.count();

        // Calcular total de vendas
        const totalVendas = await Compra.sum('valorTotal');

        // Preparar resposta
        const resposta = {
            totalCompradores,
            totalVendedores,
            totalProdutos,
            totalVendas: totalVendas || 0 // Para garantir que não retornamos null
        };

        res.status(200).json(resposta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter a percentagem de produtos por categoria
exports.getPercentagemPorCategoria = async (req, res) => {
    try {
        // Contar o número total de produtos
        const totalProdutos = await Produto.count();

        // Verificar se o total de produtos é zero
        if (totalProdutos === 0) {
            return res.status(200).json({
                percentagens: {
                    fotografia: 0,
                    performance: 0,
                    ferramenta: 0
                },
                unidades: {
                    fotografia: 0,
                    performance: 0,
                    ferramenta: 0
                }
            });
        }

        // Contar o número de produtos em cada categoria
        const categoriasCount = await Produto.findAll({
            attributes: [
                'categoria',
                [sequelize.fn('COUNT', sequelize.col('idProduto')), 'count']
            ],
            group: 'categoria',
            raw: true  // Adiciona esta linha para obter os resultados como objetos simples
        });

        // Verificar os dados retornados
        console.log('Contagens por Categoria:', categoriasCount);

        // Inicializar contadores
        const categoriaCounts = {
            fotografia: 0,
            performance: 0,
            ferramenta: 0
        };

        // Preencher o objeto com os contadores reais
        categoriasCount.forEach(({ categoria, count }) => {
            const countValue = parseInt(count, 10); // Garantir que o valor é um número
            if (!isNaN(countValue) && categoriaCounts.hasOwnProperty(categoria)) {
                categoriaCounts[categoria] = countValue;
            }
        });

        // Verificar contadores preenchidos
        console.log('Contadores:', categoriaCounts);

        // Calcular a percentagem para cada categoria
        const percentagens = {
            fotografia: ((categoriaCounts.fotografia / totalProdutos) * 100).toFixed(2),
            performance: ((categoriaCounts.performance / totalProdutos) * 100).toFixed(2),
            ferramenta: ((categoriaCounts.ferramenta / totalProdutos) * 100).toFixed(2),
        };

        // Verificar percentagens calculadas
        console.log('Percentagens:', percentagens);

        // Enviar a resposta com percentagens e contadores
        res.status(200).json({
            percentagens: percentagens,
            unidades: categoriaCounts
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.listarComprasMaisRecentes = async function (req, res) {
    try {
        console.log('Iniciando a consulta das compras mais recentes.');

        // Consultar as 10 compras mais recentes
        const compras = await Compra.findAll({
            order: [['dataCompra', 'DESC']], // Ordenar por data de compra mais recente
            limit: 10
        });

        console.log(`Número de compras encontradas: ${compras.length}`, compras);

        // Função auxiliar para buscar o vendedor
        const buscarVendedor = async (idUtilizador) => {
            if (!idUtilizador) return 'Desconhecido';
            console.log(`Buscando vendedor com ID: ${idUtilizador}`);
            const vendedor = await Utilizador.findByPk(idUtilizador, { attributes: ['nomeU'] });
            console.log('Vendedor encontrado:', vendedor);
            return vendedor ? vendedor.nomeU : 'Desconhecido';
        };

        // Função auxiliar para buscar feedback
        const buscarFeedback = async (idCompra) => {
            console.log(`Buscando feedback para a compra ID: ${idCompra}`);
            const feedback = await Feedback.findOne({
                where: { idCompra: idCompra },
                attributes: ['comentario', 'avaliacao']
            });
            console.log('Feedback encontrado:', feedback);
            return feedback ? feedback.avaliacao : 'Nenhuma avaliação';
        };

        // Inicialize um array para armazenar resultados
        const resultados = [];

        // Para cada compra, buscar detalhes do comprador, produtos/pacotes, e feedback
        for (const compra of compras) {
            console.log(`Processando compra ID: ${compra.idCompra}`);

            // Buscar detalhes do comprador
            console.log(`Buscando comprador com ID: ${compra.idUtilizador}`);
            const comprador = await Utilizador.findByPk(compra.idUtilizador, {
                attributes: ['nomeU']
            });
            console.log('Comprador encontrado:', comprador);

            // Buscar todos os produtos associados a esta compra
            console.log(`Buscando produtos para a compra ID: ${compra.idCompra}`);
            const produtos = await Produto.findAll({
                include: [
                    {
                        model: Compra,
                        where: { idCompra: compra.idCompra },
                        attributes: [] // Não precisamos dos atributos da tabela Compra aqui
                    }
                ]
            });
            console.log('Produtos encontrados:', produtos);

            // Buscar todos os pacotes associados a esta compra
            console.log(`Buscando pacotes para a compra ID: ${compra.idCompra}`);
            const pacotes = await Pacote.findAll({
                include: [
                    {
                        model: Compra,
                        where: { idCompra: compra.idCompra },
                        attributes: [] // Não precisamos dos atributos da tabela Compra aqui
                    }
                ]
            });
            console.log('Pacotes encontrados:', pacotes);

            // Buscar feedback associado à compra
            const avaliacao = await buscarFeedback(compra.idCompra);

            // Processar produtos e pacotes
            for (const produto of produtos) {
                const vendedorProduto = await buscarVendedor(produto.idUtilizador);
                resultados.push({
                    nome: produto.nomeP,
                    dataCompra: compra.dataCompra,
                    nomeComprador: comprador ? comprador.nomeU : 'Desconhecido',
                    nomeVendedor: vendedorProduto,
                    valorCompra: compra.valorTotal,
                    avaliacao
                });
            }

            for (const pacote of pacotes) {
                const vendedorPacote = await buscarVendedor(pacote.idUtilizador);
                resultados.push({
                    nome: pacote.nomePacote,
                    dataCompra: compra.dataCompra,
                    nomeComprador: comprador ? comprador.nomeU : 'Desconhecido',
                    nomeVendedor: vendedorPacote,
                    valorCompra: compra.valorTotal,
                    avaliacao
                });
            }

            console.log(`Compra ID: ${compra.idCompra} processada com sucesso.`);
        }

        console.log('Resultado final a ser enviado para o endpoint:', resultados);
        // Enviar resposta JSON com status 200 (OK)
        res.status(200).json(resultados);
    } catch (error) {
        console.error('Erro ao listar compras:', error);
        res.status(500).json({ error: 'Erro ao listar compras.' });
    }
};


exports.getTotalVendasPorMes = async (req, res) => {
    try {
        const inicioAno = new Date(new Date().getFullYear(), 0, 1);
        const fimAno = new Date(new Date().getFullYear(), 11, 31);

        console.log('Intervalo de datas:', { inicioAno, fimAno });

        // Consultar todas as compras no período desejado
        const compras = await Compra.findAll({
            attributes: ['idCompra', 'dataCompra', 'valorTotal'],
            where: {
                dataCompra: {
                    [Op.between]: [inicioAno, fimAno]
                }
            },
            raw: true
        });
        console.log('Dados da tabela Compra:');
        console.log(compras);

        // Inicializar resultado final
        const resultado = {};

        // Processar cada compra
        for (const compra of compras) {
            const mes = compra.dataCompra.toISOString().split('T')[0].slice(0, 7); // Obter ano-mês

            // Inicializar dados do mês se ainda não existirem
            if (!resultado[mes]) {
                resultado[mes] = { produtos: 0, pacotes: 0 };
            }

            // Verificar se há dados de produtos associados à compra
            const produtosComprados = await Produto.findAll({
                attributes: ['idProduto', 'nomeP', 'preco'],
                include: [{
                    model: Compra,
                    through: { attributes: [] },  // Exclui atributos da tabela de junção
                    where: { idCompra: compra.idCompra }
                }],
                raw: true
            });

            if (produtosComprados.length > 0) {
                // Calcular o total de vendas de produtos
                resultado[mes].produtos += parseFloat(compra.valorTotal) || 0;
            }

            // Verificar se há dados de pacotes associados à compra
            const pacotesComprados = await Pacote.findAll({
                attributes: ['idPacote', 'nomePacote', 'valor'],
                include: [{
                    model: Compra,
                    through: { attributes: [] },  // Exclui atributos da tabela de junção
                    where: { idCompra: compra.idCompra }
                }],
                raw: true
            });

            if (pacotesComprados.length > 0) {
                // Calcular o total de vendas de pacotes
                resultado[mes].pacotes += parseFloat(compra.valorTotal) || 0;
            }
        }

        console.log('Resultado final:');
        console.log(resultado);

        res.status(200).json(resultado);
    } catch (error) {
        console.error('Erro ao obter total de vendas por mês:', error);
        res.status(500).json({ error: error.message });
    }
};


// Função para obter o top 3 dos itens mais comprados do mês
exports.getTop3ItensMaisComprados = async (req, res) => {
    try {
        // Obter o primeiro e último dia do mês atual
        const primeiroDiaDoMes = new Date();
        primeiroDiaDoMes.setDate(1);
        primeiroDiaDoMes.setHours(0, 0, 0, 0);

        const ultimoDiaDoMes = new Date();
        ultimoDiaDoMes.setMonth(ultimoDiaDoMes.getMonth() + 1);
        ultimoDiaDoMes.setDate(0);
        ultimoDiaDoMes.setHours(23, 59, 59, 999);

        // Consultar todas as compras do mês atual
        const compras = await Compra.findAll({
            attributes: ['idCompra', 'valorTotal'], // Inclui valorTotal
            where: {
                dataCompra: {
                    [Op.between]: [primeiroDiaDoMes, ultimoDiaDoMes]
                }
            },
            raw: true
        });

        console.log('Compras do mês atual:', compras);

        // Inicializar resultado final
        const resultado = { produtos: {}, pacotes: {} };

        // Processar cada compra
        for (const compra of compras) {
            console.log(`Processando compra ID: ${compra.idCompra}, Valor Total: ${compra.valorTotal}`);

            // Verificar produtos associados à compra
            const produtosComprados = await Produto.findAll({
                attributes: ['idProduto', 'nomeP'],
                include: [{
                    model: Compra,
                    through: { attributes: [] },  // Inclui a quantidade da tabela de junção
                    where: { idCompra: compra.idCompra }
                }],
                raw: true
            });

            console.log(`Produtos encontrados para a compra ID ${compra.idCompra}:`, produtosComprados);

            // Atualizar contagem de produtos
            for (const produto of produtosComprados) {
                const idProduto = produto.idProduto;
                const quantidade = produto['compras.quantidade']; // Quantidade da tabela Compra
                const nomeProduto = produto.nomeP;

                console.log(`Produto ID: ${idProduto}, Nome: ${nomeProduto}, Quantidade da compra: ${quantidade}`);
                if (!resultado.produtos[idProduto]) {
                    resultado.produtos[idProduto] = { nome: nomeProduto, quantidade: 0, valorTotal: 0 };
                }
                resultado.produtos[idProduto].quantidade += parseInt(quantidade, 10) || 0;
                resultado.produtos[idProduto].valorTotal += compra.valorTotal || 0;

                console.log(`Atualização da quantidade e valor total do produto ${idProduto}:`, resultado.produtos[idProduto]);
            }

            // Verificar pacotes associados à compra
            const pacotesComprados = await Pacote.findAll({
                attributes: ['idPacote', 'nomePacote'],
                include: [{
                    model: Compra,
                    through: { attributes: [] },  // Inclui a quantidade da tabela de junção
                    where: { idCompra: compra.idCompra }
                }],
                raw: true
            });

            console.log(`Pacotes encontrados para a compra ID ${compra.idCompra}:`, pacotesComprados);

            // Atualizar contagem de pacotes
            for (const pacote of pacotesComprados) {
                const idPacote = pacote.idPacote;
                const quantidade = pacote['compras.quantidade']; // Quantidade da tabela Compra
                if (!resultado.pacotes[idPacote]) {
                    resultado.pacotes[idPacote] = { nome: pacote.nomePacote, quantidade: 0, valorTotal: 0 };
                }
                resultado.pacotes[idPacote].quantidade += parseInt(quantidade, 10) || 0;
                resultado.pacotes[idPacote].valorTotal += compra.valorTotal || 0;

                console.log(`Atualização da quantidade e valor total do pacote ${idPacote}:`, resultado.pacotes[idPacote]);
            }
        }

        console.log('Resultado final de produtos:', resultado.produtos);
        console.log('Resultado final de pacotes:', resultado.pacotes);

        // Combinar produtos e pacotes em uma única lista
        const todosItens = [
            ...Object.values(resultado.produtos).map(item => ({ ...item, tipo: 'produto' })),
            ...Object.values(resultado.pacotes).map(item => ({ ...item, tipo: 'pacote' }))
        ];

        // Ordenar e obter os 3 itens mais vendidos
        const top3Itens = todosItens
            .sort((a, b) => b.quantidade - a.quantidade)
            .slice(0, 3);

        console.log('Top 3 itens mais comprados:', top3Itens);

        res.status(200).json(top3Itens);
    } catch (error) {
        console.error('Erro ao obter o top 3 itens mais comprados:', error);
        res.status(500).json({ error: error.message });
    }
};



