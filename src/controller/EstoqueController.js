const express = require("express");
const router = express.Router();
const EstoqueService = require("../services/EstoqueService");

router.post("/criar-estoque", async (req, res) => {
  const estoque = req.body;
  try {
    const result = await EstoqueService.createEstoque(estoque);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar estoque.", error });
  }
});

router.get("/buscar-estoques", async (req, res) => {
  try {
    const result = await EstoqueService.findEstoques();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar estoques.", error });
  }
});

router.get("/buscar-estoque/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await EstoqueService.findEstoqueById(id);
    if (!result) {
      res.status(404).json({ message: `Estoque com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar estoque.", error });
  }
});

router.put("/atualizar-estoque/:id", async (req, res) => {
  const { id } = req.params;
  const estoque = req.body;
  try {
    const result = await EstoqueService.updateEstoque(id, estoque);
    if (!result) {
      res.status(404).json({ message: `Estoque com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar estoque.", error });
  }
});

router.delete("/estoque/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EstoqueService.deleteEstoque(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Estoque não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir estoque" });
  }
});

module.exports = router;