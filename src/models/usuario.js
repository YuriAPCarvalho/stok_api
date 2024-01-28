const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const bcrypt = require("bcrypt");

const Usuario = sequelize.define(
  "Usuario",
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const hash = bcrypt.hashSync(value, 10);
        this.setDataValue("senha", hash);
      },
    },
  },
  { freezeTableName: true }
);

module.exports = Usuario;
