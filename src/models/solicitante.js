const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Solicitante = sequelize.define(
  "Solicitante",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

module.exports = Solicitante;
