const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Estoque = require("./estoque");

const Subestoque = sequelize.define(
  "Subestoque",
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
    estoqueId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Estoque",
        key: "id",
      },
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

Subestoque.belongsTo(Estoque, { as: "estoque", foreignKey: "estoqueId" });

module.exports = Subestoque;
