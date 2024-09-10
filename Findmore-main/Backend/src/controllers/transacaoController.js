const Transacao = require("../model/transacao");

// Criar nova transação
exports.createTransacao = async (req, res) => {
  try {
    const transacao = await Transacao.create(req.body);
    res.status(201).json(transacao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter todas as transações
exports.getAllTransacoes = async (req, res) => {
  try {
    const transacoes = await Transacao.findAll();
    res.status(200).json(transacoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter uma transação por ID
exports.getTransacaoById = async (req, res) => {
  try {
    const transacao = await Transacao.findByPk(req.params.id);
    if (!transacao) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    res.status(200).json(transacao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar uma transação por ID
exports.updateTransacao = async (req, res) => {
  try {
    const [updated] = await Transacao.update(req.body, {
      where: { idTransacao: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    const updatedTransacao = await Transacao.findByPk(req.params.id);
    res.status(200).json(updatedTransacao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Excluir uma transação por ID
exports.deleteTransacao = async (req, res) => {
  try {
    const deleted = await Transacao.destroy({
      where: { idTransacao: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};