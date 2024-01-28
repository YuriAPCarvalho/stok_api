const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  }
);

module.exports = {
  Sequelize,
  DataTypes: Sequelize.DataTypes,
  Model: Sequelize.Model,
  sequelize,
};

sequelize
  .sync()
  .then(() => {
    console.log("Banco de dados Conectado");
  })
  .catch((error) => {
    console.log("Erro ao criar tabelas no banco de dados", error);
  });
