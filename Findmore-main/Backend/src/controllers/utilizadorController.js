const Utilizador = require("../model/utilizador");
const Perfil = require ("../model/perfil");
const jwt = require('jsonwebtoken');

// Obter todos os utilizadores
exports.getAllUtilizadores = async (req, res) => {
  try {
    const utilizadores = await Utilizador.findAll();
    res.status(200).json(utilizadores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter um utilizador por ID
exports.getUtilizadorById = async (req, res) => {
  try {
    const utilizador = await Utilizador.findByPk(req.params.id);
    if (!utilizador) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }
    res.status(200).json(utilizador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um utilizador por ID
exports.updateUtilizador = async (req, res) => {
  try {
    const [updated] = await Utilizador.update(req.body, {
      where: { idUtilizador: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }
    const updatedUtilizador = await Utilizador.findByPk(req.params.id);
    res.status(200).json(updatedUtilizador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Excluir um utilizador por ID
exports.deleteUtilizador = async (req, res) => {
  try {
    const deleted = await Utilizador.destroy({
      where: { idUtilizador: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter e contar utilizadores com perfil de comprador
exports.getCompradores = async (req, res) => {
  try {
   
    const compradores = await Utilizador.findAll({
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
    console.log(`Total de compradores encontrados: ${compradores.length}`);
    res.status(200).json({ totalCompradores: compradores.length, compradores });
  } catch (error) {
    console.error(`Erro ao procurar compradores: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Obter e contar utilizadores com perfil de vendedor
exports.getVendedores = async (req, res) => {
  try {
    const vendedores = await Utilizador.findAll({
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
    console.log(`Total de vendedores encontrados: ${vendedores.length}`);
    res.status(200).json({ totalVendedores: vendedores.length, vendedores });
  } catch (error) {
    console.error(`Erro ao procurar vendedores: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
