const express = require('express');
const router = express.Router();
const middleware = require('../middleware');
const autenticarController = require('../controllers/autenticarController');

router.post('/register', autenticarController.register);
router.post('/login',autenticarController.login);

module.exports = router;