const express = require("express");
const router = express.Router();
const { Usuario } = require("../models/usuario");

router.post("/registrar-usuario", async (req, res) => {
  const usuario = req.body;
  try {
    const result = await UsuarioService.createUsuario(usuario);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário.", error });
  }
});

router.get("/buscar-usuario", async (req, res) => {
  try {
    const result = await UsuarioService.findUsuarios();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários.", error });
  }
});

router.get("/buscar-usuario/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await UsuarioService.findUsuarioById(id);
    if (!result) {
      res.status(404).json({ message: `Usuário com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuário.", error });
  }
});

router.put("/atualizar-usuario/:id", async (req, res) => {
  const { id } = req.params;
  const usuario = req.body;
  try {
    const result = await UsuarioService.updateUsuario(id, usuario);
    if (!result) {
      res.status(404).json({ message: `Usuário com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuário.", error });
  }
});

router.delete("/usuario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await usuario.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar o usuário" });
  }
});

module.exports = router;