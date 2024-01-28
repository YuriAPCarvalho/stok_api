const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Categoria = require("./categoria");

const Produto = sequelize.define(
  "Produto",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    patrimonio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Categoria",
        key: "id",
      },
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estoqueMinimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estoqueMaximo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pontoPedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fotoProduto: {
      type: DataTypes.BLOB('long'),
      allowNull: true,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { freezeTableName: true }
);

Produto.belongsTo(Categoria, { as: "categoria", foreignKey: "categoriaId" });

module.exports = Produto;
