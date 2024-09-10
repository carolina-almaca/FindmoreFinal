const jwt = require('jsonwebtoken'); //módulo NPM
const config = require('./config'); //ficheiro de configuração

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    // Verifique se o token não é undefined antes de chamar startsWith
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length); // remove a palavra ‘Bearer ’
    }

    if (token) {
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'O token não é válido.'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Token indisponível.'
        });
    }
};
module.exports = { checkToken: checkToken };
