const Utilizador = require('../model/utilizador');
const Perfil = require('../model/perfil');

exports.findPerfisByUtilizadorId = async (idUtilizador) => {
  
  console.log(`Recebido pedido para encontrar perfis do utilizador com id: ${idUtilizador}`);

  try {
    const utilizador = await Utilizador.findByPk(idUtilizador, {
      include: [{
        model: Perfil,
        as: 'perfils',
        through: {
          attributes: []
        }
      }]
    });

    console.log('Resultado da consulta:', utilizador);

    if (utilizador) {
      console.log('Perfis associados:', utilizador.perfils);
    } else {
      console.log('Utilizador não encontrado.');
    }
    return utilizador ? utilizador.perfils : [];
  } catch (error) {
    console.error('Erro ao buscar perfis para o utilizador:', error);
    return [];  // Retornar array vazio em caso de erro
  }
};

