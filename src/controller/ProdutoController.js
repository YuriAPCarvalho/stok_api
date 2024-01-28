const express = require("express");
const router = express.Router();
const ProdutoService = require("../services/ProdutoService");

router.post("/", async (req, res) => {
  const produto = req.body;
  try {
    const result = await ProdutoService.createProduto(produto);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar produto.", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await ProdutoService.findProdutos();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produtos.", error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ProdutoService.findProdutoById(id);
    if (!result) {
      res.status(404).json({ message: `Produto com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar produto.", error });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const produto = req.body;
  try {
    const result = await ProdutoService.updateProduto(id, produto);
    if (!result) {
      res.status(404).json({ message: `Produto com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar produto.", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProdutoService.deleteProduto(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Produto não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir produto" });
  }
});

module.exports = router;