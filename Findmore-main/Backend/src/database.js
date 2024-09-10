const Sequelize = require("sequelize");
const sequelize = new Sequelize(
'projetoFindmore',
'postgres',
'1234', //password pgadmin
{
host: 'localhost',
port: '5432',
dialect: 'postgres', 
}
);
module.exports = sequelize;