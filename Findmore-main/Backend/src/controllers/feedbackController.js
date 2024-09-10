const Feedback = require("../model/feedback");

exports.createFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.create(req.body);
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll();
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFeedbackById = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByPk(id)
;
        if (feedback) {
            res.status(200).json(feedback);
        } else {
            res.status(404).json({ error: 'Feedback não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Feedback.update(req.body, {
            where: { idFeedback: id }
        });
        if (updated) {
            const updatedFeedback = await Feedback.findByPk(id)
;
            res.status(200).json(updatedFeedback);
        } else {
            res.status(404).json({ error: 'Feedback não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Feedback.destroy({
            where: { id: id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Feedback não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
