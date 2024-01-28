const express = require("express");
const router = express.Router();
const SubEstoqueService = require("../services/SubEstoqueService");

router.post("/", async (req, res) => {
  const estoque = req.body;
  try {
    const result = await SubEstoqueService.createEstoque(estoque);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar sub-estoque.", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await SubEstoqueService.findEstoques();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar sub-estoques.", error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await SubEstoqueService.findEstoqueById(id);
    if (!result) {
      res
        .status(404)
        .json({ message: `Sub-estoque com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar sub-estoque.", error });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const estoque = req.body;
  try {
    const result = await SubEstoqueService.updateEstoque(id, estoque);
    if (!result) {
      res
        .status(404)
        .json({ message: `Sub-Estoque com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar eub-estoque.", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SubEstoqueService.deleteEstoque(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Sub-Estoque não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir Sub-estoque" });
  }
});

module.exports = router;
