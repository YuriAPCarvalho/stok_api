const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Produto = require("./produto");


const Saldo = sequelize.define(
  "Saldo",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estoqueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subestoqueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    saldo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

Saldo.belongsTo(Produto, { foreignKey: "produtoId", as: "produto" });


module.exports = Saldo;
