const { Usuario } = require("../models");
const bcrypt = require("bcrypt");

class UsuarioService {
  async autenticarUsuario(email, senha) {
    try {
      const usuario = await Usuario.findOne({ where: { email: email } });
      if (!usuario) {
        return null;
      }
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (senhaCorreta) {
        return usuario;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new UsuarioService();
