const express = require("express");
const router = express.Router();
const DevolucaoItemService = require("../services/DevolucaoItemService");

router.post("/", async (req, res) => {
  const devolucao = req.body;
  try {
    const result = await DevolucaoItemService.createDevolucaoItem(devolucao);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar devolução.", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await DevolucaoItemService.findDevolucaoItems();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar devoluções.", error });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await DevolucaoItemService.findDevolucaoItemById(id);
    if (!result) {
      res.status(404).json({ message: `devolução com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar devolução.", error });
  }
});

router.get("/produtoId/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await DevolucaoItemService.findDevolucaoItemByProdutoId(id);
    if (!result) {
      res.status(404).json({ message: `Produto com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao buscar estoque.", error });
  }
});

router.get("/descricao/:descricao", async (req, res) => {
  const { descricao } = req.params;
  try {
    const result = await DevolucaoItemService.findDevolucaoItemByDescricao(descricao);
    if (!result) {
      res.status(404).json({ message: `Estoque com id ${descricao} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erro ao buscar estoque.", error });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const devolucao = req.body;
  try {
    const result = await DevolucaoItemService.updateDevolucaoItem(id, devolucao);
    if (!result) {
      res.status(404).json({ message: `devolução com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar devolução.", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DevolucaoItemService.deleteDevolucaoItem(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "devolução não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir devolução" });
  }
});

module.exports = router;