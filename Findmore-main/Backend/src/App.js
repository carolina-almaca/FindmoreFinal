const express = require('express');
const app = express();
const middleware = require ('./middleware');


// Configurações
app.set('port', process.env.PORT || 3001);

// Middlewares

app.use(express.json());

// Configurar CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

// Importar associações e sequelize
const { sequelize } = require('./database');
require('./model/associar');

// Rotas
app.use("/compra", require("./routes/compraRoute"));
app.use("/feedback", require("./routes/feedbackRoute"));
app.use("/orcamento", require("./routes/orcamentoRoute"));
app.use("/pacote", require("./routes/pacoteRoute"));
app.use("/perfil", require("./routes/perfilRoute"));
app.use("/produto", require("./routes/produtoRoute"));
app.use("/transacao", require("./routes/transacaoRoute"));
app.use("/utilizador", require("./routes/utilizadorRoute"));
app.use("/versaoP", require("./routes/versaoPRoute"));
app.use("/autenticar", require("./routes/autenticarRoute"));
app.use("/utilizadorPerfil",require("./routes/utilizadorPerfisRoute"));
app.use("/dashboard",require("./routes/adminDashboardRoute"));

app.listen(app.get('port'),()=>{
console.log("Start server on port "+app.get('port'))
})