const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Solicitante = require("./solicitante");
const Produto = require("./produto");
const Estoque = require("./estoque");

const DevolucaoItem = sequelize.define(
  "DevolucaoItem",
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
    dataEntrada: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    solicitanteId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Solicitante",
        key: "id",
      },
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

DevolucaoItem.belongsTo(Produto, { foreignKey: "produtoId", as: "produto" });
DevolucaoItem.belongsTo(Solicitante, {foreignKey: "solicitanteId", as: "solicitante",});
DevolucaoItem.belongsTo(Estoque, { foreignKey: "estoqueId", as: "estoque" });

module.exports = DevolucaoItem;
