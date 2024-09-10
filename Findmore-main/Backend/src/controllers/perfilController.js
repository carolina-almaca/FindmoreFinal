const Perfil = require("../model/perfil");

// Criar novo perfil
exports.createPerfil = async (req, res) => {
  try {
    const perfil = await Perfil.create(req.body);
    res.status(201).json(perfil);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter todos os perfis
exports.getAllPerfis = async (req, res) => {
  try {
    const perfis = await Perfil.findAll();
    res.status(200).json(perfis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter um perfil por ID
exports.getPerfilById = async (req, res) => {
  try {
    const perfil = await Perfil.findByPk(req.params.id);
    if (!perfil) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    res.status(200).json(perfil);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um perfil por ID
exports.updatePerfil = async (req, res) => {
  try {
    const [updated] = await Perfil.update(req.body, {
      where: { idPerfil: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    const updatedPerfil = await Perfil.findByPk(req.params.id);
    res.status(200).json(updatedPerfil);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Excluir um perfil por ID
exports.deletePerfil = async (req, res) => {
  try {
    const deleted = await Perfil.destroy({
      where: { idPerfil: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};