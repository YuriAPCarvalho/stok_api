const express = require("express");
const router = express.Router();
const EntradaItemService = require("../services/EntradaItemService");

router.post("/", async (req, res) => {
  const entradaItem = req.body;
  try {
    const result = await EntradaItemService.createEntradaItem(entradaItem);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar item de entrada.", error });
  }
});

router.get("/", async (req, res) => {
  const { estoqueId, produtoId } = req.query;
  try {
    const result = await EntradaItemService.findEntradaItems(
      estoqueId,
      produtoId
    );
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar itens de entrada.", error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await EntradaItemService.findEntradaItemById(id);
    if (!result) {
      res
        .status(404)
        .json({ message: `Item de entrada com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar item de entrada.", error });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const entradaItem = req.body;
  try {
    const result = await EntradaItemService.updateEntradaItem(id, entradaItem);
    if (!result) {
      res
        .status(404)
        .json({ message: `Item de entrada com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar item de entrada.", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await EntradaItemService.deleteEntradaItem(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Item de entrada não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir item de entrada" });
  }
});

module.exports = router;
