const Utilizador = require("../model/utilizador");
const utilizadorPerfisController = require('./utilizadorPerfisController');
const bcrypt = require('bcrypt');
const config = require('../config');
const jwt = require('jsonwebtoken');
const sequelize = require('../database');


const perfilMap = {
    admin: 1,
    comprador: 2,
    vendedor: 3
};

// Criar novo utilizador
exports.register = async (req, res) => {
    console.log('dado do registo:', req.body);
    const { nomeU, email, password, ativo, perfil } = req.body;
    console.log("string idPerfil:", perfil);
    const idPerfil = perfilMap[perfil];
    console.log("idPerfil:", idPerfil)
    try {
        const data = await Utilizador.create({
            nomeU: nomeU,
            email: email,
            password: password,
            ativo: ativo,
        });

        console.log('Utilizador criado com sucesso:', data);

        // Adicionar a entrada na tabela de UtilizadorPerfis
        await sequelize.models.UtilizadorPerfis.create({
            idUtilizador: data.idUtilizador,
            idPerfil: idPerfil
        });

        console.log('Perfil associado ao utilizador com sucesso.');

        res.status(200).json({
            success: true,
            message: "Registado e Perfil associado",
            data: data
        });
    } catch (error) {
        console.log('Erro ao criar utilizador:', error);
        res.status(500).json({
            success: false,
            message: "Erro ao registrar utilizador",
            error: error.message
        });
    }
}


//Login
exports.login = async (req, res) => {
    if (req.body.email && req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
    }

    console.log("request", req.body);
    var user = await Utilizador.findOne({ where: { email: email } })
        .then(function (data) {
            return data;
        })
        .catch(error => {
            console.log("Erro: " + error);
            return error;
        })
    if (password === null || typeof password === "undefined") {
        res.status(403).json({
            success: false,
            message: 'Campos em Branco'
        });
    } else {
        if (req.body.email && req.body.password && user) {

            console.log('Password fornecida:', password);
            console.log('Password armazenada:', user.password);

            const isMatch = bcrypt.compareSync(password, user.password);


            console.log('Comparação de senha:', isMatch);
            console.log('Password fornecida (após comparação):', password);
            console.log('Password armazenada (após comparação):', user.password);

            if (req.body.email === user.email && isMatch) {


                // Verificar se o utilizador tem o perfil necessário
                const perfis = await utilizadorPerfisController.findPerfisByUtilizadorId(user.idUtilizador);
                if (!Array.isArray(perfis)) {
                    return res.status(500).json({
                        success: false,
                        message: 'Erro ao verificar perfis do utilizador.'
                    });
                }

                const perfilIds = perfis.map(perfil => perfil.idPerfil);
                const requiredPerfilId = perfilMap[req.body.role];

                console.log('Perfis do utilizador:', perfilIds);
                console.log('Perfil necessário:', requiredPerfilId);

                if (!perfilIds.includes(requiredPerfilId)) {
                    return res.status(403).json({
                        success: false,
                        message: 'Perfil não autorizado.'
                    });
                }

                // Verificar se o utilizador está ativo
                if (!user.ativo) {
                    return res.status(403).json({ success: false, message: 'Utilizador inativo.' });
                }

                let token = jwt.sign({ email: req.body.email }, config.jwtSecret, {
                    expiresIn: '1h' // expira em 1 hora
                });

                console.log('Token gerado:', token);

                res.json({ success: true, message: 'Autenticação realizada com sucesso!', token: token, user: user });
            } else {
                res.status(403).json({ success: false, message: 'Dados de autenticação inválidos.' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Erro no processo de autenticação. Tente de novo mais tarde.' });
        }
    }
};