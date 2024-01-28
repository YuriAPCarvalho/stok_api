const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Estoque = sequelize.define(
  "Estoque",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

module.exports = Estoque;