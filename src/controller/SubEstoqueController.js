const express = require("express");
const router = express.Router();
const SubEstoqueService = require("../services/SubEstoqueService");

router.post("/criar-sub-estoque", async (req, res) => {
  const estoque = req.body;
  try {
    const result = await SubEstoqueService.createEstoque(estoque);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar sub-estoque.", error });
  }
});

router.get("/buscar-sub-estoques", async (req, res) => {
  try {
    const result = await SubEstoqueService.findEstoques();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar sub-estoque.", error });
  }
});

router.get("/buscar-sub-estoque/:id", async (req, res) => {
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

router.put("/atualizar-sub-estoque/:id", async (req, res) => {
  const { id } = req.params;
  const estoque = req.body;
  try {
    const result = await SubEstoqueService.updateEstoque(id, estoque);
    if (!result) {
      res
        .status(404)
        .json({ message: `Sub-estoque com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar sub-estoque.", error });
  }
});

router.delete("/sub-estoque/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SubEstoqueService.deleteEstoque(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Sub-estoque não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir sub-estoque" });
  }
});

module.exports = router;
