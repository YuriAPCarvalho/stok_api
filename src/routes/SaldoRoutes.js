const express = require("express");
const router = express.Router();
const SaldoService = require("../services/SaldoService");

router.post("/", async (req, res) => {
  console.log("Entrou na rota POST /");
  const saldo = req.body;
  try {
    const result = await SaldoService.createSaldo(saldo);
    res.json(result);
  } catch (error) {
    console.error("Erro ao criar saldo:", error);
    res.status(500).json({ message: "Erro ao criar saldo.", error });
  }
});

router.get("/", async (req, res) => {
  console.log("Entrou na rota GET /");
  try {
    const { estoqueId, produtoId } = req.query;

    if (estoqueId || produtoId) {
      const result = await SaldoService.findSaldosByFilters(
        estoqueId,
        produtoId
      );
      res.json(result);
    } else {
      const result = await SaldoService.findSaldos();
      res.json(result);
    }
  } catch (error) {
    console.error("Erro ao buscar saldos:", error);
    res.status(500).json({ message: "Erro ao buscar saldos.", error });
  }
});

router.get("/inventario", async (req, res) => {
  console.log("Entrou na rota GET /api/saldo");
  try {
    const { estoqueId } = req.query;

    if (estoqueId) {
      const result = await SaldoService.findLastSaldosByEstoqueId(estoqueId);
      res.json(result);
    } else {
      res
        .status(400)
        .json({ message: "O parâmetro 'estoqueId' é obrigatório." });
    }
  } catch (error) {
    console.error("Erro ao buscar saldos agrupados:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar saldos agrupados.", error });
  }
});
router.get("/:id", async (req, res) => {
  console.log("Entrou na rota GET /:id");
  const { id } = req.params;
  try {
    const result = await SaldoService.findSaldoById(id);
    if (!result) {
      res.status(404).json({ message: `saldo com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error("Erro ao buscar saldo:", error);
    res.status(500).json({ message: "Erro ao buscar saldo.", error });
  }
});

router.put("/:id", async (req, res) => {
  console.log("Entrou na rota PUT /:id");
  const { id } = req.params;
  const saldo = req.body;
  try {
    const result = await SaldoService.updateSaldo(id, saldo);
    if (!result) {
      res.status(404).json({ message: `saldo com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error("Erro ao atualizar saldo:", error);
    res.status(500).json({ message: "Erro ao atualizar saldo.", error });
  }
});

router.delete("/:id", async (req, res) => {
  console.log("Entrou na rota DELETE /:id");
  try {
    const { id } = req.params;
    const result = await SaldoService.deleteSaldo(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "saldo não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao excluir saldo:", error);
    res.status(500).json({ message: "Erro ao excluir saldo", error });
  }
});

module.exports = router;
