const express = require('express');
const router = express.Router();
const versaoPController = require('../controllers/versaoPController');

router.post('/', versaoPController.createVersaoP);
router.get('/', versaoPController.getAllVersoesP);
router.get('/:id', versaoPController.getVersaoPById);
router.put('/:id', versaoPController.updateVersaoP);
router.delete('/:id', versaoPController.deleteVersaoP);

module.exports = router;