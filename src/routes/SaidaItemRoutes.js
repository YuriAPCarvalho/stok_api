const express = require("express");
const router = express.Router();
const SaidaItemService = require("../services/SaidaItemService");

router.post("/", async (req, res) => {
  const saidaItem = req.body;
  try {
    const result = await SaidaItemService.createSaidaItem(saidaItem);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar item de saída.", error });
  }
});

router.get("/", async (req, res) => {
  const { estoqueId, produtoId } = req.query;
  try {
    const result = await SaidaItemService.findSaidaItems(estoqueId, produtoId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar itens de saída.", error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await SaidaItemService.findSaidaItemById(id);
    if (!result) {
      res
        .status(404)
        .json({ message: `Item de saída com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar item de saída.", error });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const saidaItem = req.body;
  try {
    const result = await SaidaItemService.updateSaidaItem(id, saidaItem);
    if (!result) {
      res
        .status(404)
        .json({ message: `Item de saída com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar item de saída.", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SaidaItemService.deleteSaidaItem(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Item de saída não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir item de saída" });
  }
});

module.exports = router;
