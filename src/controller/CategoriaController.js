
const express = require("express");
const router = express.Router();
const CategoriaService = require("../services/CategoriaService");

router.post("/", async (req, res) => {
  const categoria = req.body;
  try {
    const result = await CategoriaService.createCategoria(categoria);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar categoria.", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await CategoriaService.findCategorias();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar categorias.", error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await CategoriaService.findCategoriaById(id);
    if (!result) {
      res.status(404).json({ message: `Categoria com id ${id} não encontrada.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar categoria.", error });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const categoria = req.body;
  try {
    const result = await CategoriaService.updateCategoria(id, categoria);
    if (!result) {
      res.status(404).json({ message: `Categoria com id ${id} não encontrada.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar categoria.", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CategoriaService.deleteCategoria(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Categoria não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir categoria" });
  }
});

module.exports = router;