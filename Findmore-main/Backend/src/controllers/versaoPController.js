const VersaoP = require("../model/versaoP");

// Criar nova versão de produto
exports.createVersaoP = async (req, res) => {
  try {
    const versaoP = await VersaoP.create(req.body);
    res.status(201).json(versaoP);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter todas as versões de produtos
exports.getAllVersoesP = async (req, res) => {
  try {
    const versoesP = await VersaoP.findAll();
    res.status(200).json(versoesP);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter uma versão de produto por ID
exports.getVersaoPById = async (req, res) => {
  try {
    const versaoP = await VersaoP.findByPk(req.params.id);
    if (!versaoP) {
      return res.status(404).json({ error: 'Versão de produto não encontrada' });
    }
    res.status(200).json(versaoP);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar uma versão de produto por ID
exports.updateVersaoP = async (req, res) => {
  try {
    const [updated] = await VersaoP.update(req.body, {
      where: { idVersaoP: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: 'Versão de produto não encontrada' });
    }
    const updatedVersaoP = await VersaoP.findByPk(req.params.id);
    res.status(200).json(updatedVersaoP);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Excluir uma versão de produto por ID
exports.deleteVersaoP = async (req, res) => {
  try {
    const deleted = await VersaoP.destroy({
      where: { idVersaoP: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Versão de produto não encontrada' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};