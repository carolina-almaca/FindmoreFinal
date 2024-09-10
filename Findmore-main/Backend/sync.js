const sequelize = require("./src/database");
const { Utilizador, Perfil} = require("./src/model/associar");

sequelize.sync({ force: true }).then(async () => {
  console.log("Tabelas sincronizadas");

  // Criação dos perfis
  try {
    await Perfil.bulkCreate([
      { idPerfil: 1, admin: true, comprador: false, gestorProduct: false },
      { idPerfil: 2, admin: false, comprador: true, gestorProduct: false },
      { idPerfil: 3, admin: false, comprador: false, gestorProduct: true },
    ]);
    console.log("Perfis criados com sucesso");
  } catch (error) {
    console.error("Erro ao criar perfis:", error);
  }

  // Criação do admin
  try {
    const admin = await Utilizador.create({
      nomeU: 'administrador',
      email: 'admin@gmail.com',
      password: '1234',  // A senha será criptografada pelo hook beforeCreate
      ativo: true,
    });

    // Adicionar entrada na tabela UtilizadorPerfis para o admin
    await sequelize.models.UtilizadorPerfis.create({
      idUtilizador: admin.idUtilizador,
      idPerfil: 1  // Assume que o perfil de admin tem idPerfil = 1
    });

    console.log("Administrador criado com sucesso");
  } catch (error) {
    console.error("Erro ao criar administrador:", error);
  }

  process.exit(); // Encerra o processo após a sincronização e criação dos perfis e do admin
}).catch(error => {
  console.error("Erro ao sincronizar tabelas:", error);
});
