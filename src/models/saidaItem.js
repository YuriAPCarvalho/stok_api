const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Usuario = require("./usuario");
const Estoque = require("./estoque");
const Solicitante = require("./solicitante");
const Produto = require("./produto");
const Subestoque = require("./subestoque");

const SaidaItem = sequelize.define(
  "SaidaItem",
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
    data: {
      type: DataTypes.DATE,
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
    subestoqueId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Subestoque",
        key: "id",
      },
      allowNull: false,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Usuario",
        key: "id",
      },
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
    gerarRecibo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    tipoSaida: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

SaidaItem.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });
SaidaItem.belongsTo(Estoque, { foreignKey: "estoqueId", as: "estoque" });
SaidaItem.belongsTo(Solicitante, {  oreignKey: "solicitanteId", as: "solicitante" });
SaidaItem.belongsTo(Produto, { foreignKey: "produtoId", as: "produto" });
SaidaItem.belongsTo(Subestoque, { foreignKey: "subestoqueId", as: "subestoque" });



module.exports = SaidaItem;
