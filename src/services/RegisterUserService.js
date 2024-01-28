const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

class UsuarioService {
  constructor() {}
  async createUsuario(usuario) {
    try {
      const newUsuario = await Usuario.create(usuario);
      return newUsuario;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findUsuarios() {
    try {
      const usuarios = await Usuario.findAll();
      return usuarios;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findUsuarioById(id) {
    try {
      const usuario = await Usuario.findByPk(id);
      return usuario;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUsuario(id, usuario) {
    try {
      const [updatedRowsCount, updatedRows] = await Usuario.update(usuario, {
        where: {
          id: id,
        },
        returning: true,
      });
      if (updatedRowsCount === 0) {
        throw new Error("Usuário não encontrado");
      }
      return updatedRows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteUsuario(id) {
    try {
      if (id == 2) {
        throw new Error("Não é possível excluir esse usuário.");
      }
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        throw new Error("Usuário não encontrado");
      }

      await Usuario.destroy({
        where: {
          id: id,
        },
      });

      return usuario;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async autenticarUsuario(email, senha) {
    try {
      const usuario = await Usuario.findOne({ where: { email: email } });
      if (!usuario) {
        return null;
      }
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (senhaCorreta) {
        const token = jwt.sign(
          { id: usuario.id, perfil: usuario.perfil },
          SECRET,
          { expiresIn: "1h" }
        );
        return { ...usuario.toJSON(), token };
      } else {
        return null;
      }
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }
}

module.exports = new UsuarioService();
