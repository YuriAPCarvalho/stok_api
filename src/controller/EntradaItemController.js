const express = require("express");
const router = express.Router();
const EntradaItemService = require("../services/EntradaItemService");

router.post("/entrada-item", async (req, res) => {
  const entradaItem = req.body;
  try {
    const result = await EntradaItemService.createEntradaItem(entradaItem);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar entrada de item.", error });
  }
});

router.get("/entrada-item", async (req, res) => {
  try {
    const result = await EntradaItemService.findEntradaItems();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar entradas de itens.", error });
  }
});

router.get("/entrada-item/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await EntradaItemService.findEntradaItemById(id);
    if (!result) {
      res.status(404).json({ message: `Entrada de item com id ${id} não encontrada.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar entrada de item.", error });
  }
});

router.put("/entrada-item/:id", async (req, res) => {
  const { id } = req.params;
  const entradaItem = req.body;
  try {
    const result = await EntradaItemService.updateEntradaItem(id, entradaItem);
    if (!result) {
      res.status(404).json({ message: `Entrada de item com id ${id} não encontrada.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar entrada de item.", error });
  }
});

router.delete("/entrada-item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EntradaItemService.deleteEntradaItem(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Entrada de item não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir entrada de item" });
  }
});

module.exports = router;