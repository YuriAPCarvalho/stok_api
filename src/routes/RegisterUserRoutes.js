const express = require("express");
const router = express.Router();
const UsuarioService = require("../services/RegisterUserService");

router.post("/", async (req, res) => {
  const usuario = req.body;
  try {
    const result = await UsuarioService.createUsuario(usuario);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário.", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await UsuarioService.findUsuarios();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários.", error });
  }
});

router.get("/:id", async (req, res) => {
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

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await UsuarioService.deleteUsuario(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Usuário não encontrado" });
    }
  } catch (error) {
    const { id } = req.params;
    if (id == 2) {
      res.status(401).json({ message: "Esse usuário não pode ser deletado." });
    }
    console.log(error);
    res.status(500).json({ message: "Erro ao excluir usuário" });
  }
});

module.exports = router;
