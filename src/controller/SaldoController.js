const express = require("express");
const router = express.Router();
const SaldoService = require("../services/SaldoService");

router.post("/criar-saldo", async (req, res) => {
  const saldo = req.body;
  try {
    const result = await SaldoService.createSaldo(saldo);
    res.json(result);
  } catch (error) {
    console.error("Erro ao criar saldo:", error);
    res.status(500).json({ message: "Erro ao criar saldo.", error });
  }
});

router.get("/buscar-saldos", async (req, res) => {
  try {
    const result = await SaldoService.findSaldos();
    res.json(result);
  } catch (error) {
    console.error("Erro ao buscar saldos:", error);
    res.status(500).json({ message: "Erro ao buscar saldos.", error });
  }
});

router.get("/buscar-saldo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await SaldoService.findSaldoById(id);
    if (!result) {
      res.status(404).json({ message: `Saldo com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error("Erro ao buscar saldo:", error);
    res.status(500).json({ message: "Erro ao buscar saldo.", error });
  }
});

router.put("/atualizar-saldo/:id", async (req, res) => {
  const { id } = req.params;
  const saldo = req.body;
  try {
    const result = await SaldoService.updateSaldo(id, saldo);
    if (!result) {
      res.status(404).json({ message: `Saldo com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error("Erro ao atualizar saldo:", error);
    res.status(500).json({ message: "Erro ao atualizar saldo.", error });
  }
});

router.delete("/saldo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SaldoService.deleteSaldo(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "Saldo não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao excluir saldo:", error);
    res.status(500).json({ message: "Erro ao excluir saldo", error });
  }
});

module.exports = router;
