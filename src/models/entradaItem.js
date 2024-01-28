const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Estoque = require('./estoque')
const Produto = require("./produto");


const EntradaItem = sequelize.define(
  "EntradaItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    produtoId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Produto",
        key: "id",
      },
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    preco: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dataEntrada: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estoqueId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Estoque', 
        key: 'id',
      },
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

EntradaItem.belongsTo(Estoque, { as: 'estoque', foreignKey: 'estoqueId' });
EntradaItem.belongsTo(Produto, { foreignKey: "produtoId", as: "produto" });




module.exports = EntradaItem;