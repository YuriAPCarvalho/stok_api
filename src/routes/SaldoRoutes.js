const express = require("express");
const router = express.Router();
const SaldoService = require("../services/SaldoService");
const { Saldo } = require('../models/saldo');
const { Op, literal, QueryTypes, Sequelize } = require("sequelize");


router.post("/", async (req, res) => {
  console.log("Entrou na rota POST /");
  const saldo = req.body;
  try {
    const result = await SaldoService.createSaldo(saldo);

    const newSaldos = {
      [result.produtoId]: {
        estoqueId: saldo.estoqueId,
        subestoqueId: saldo.subestoqueId,
        saldo: saldo.saldo,
      },
    };
    await SaldoService.updateSaldosDuringInventory(newSaldos);

    res.json(result);
  } catch (error) {
    console.error("Erro ao criar saldo:", error);
    res.status(500).json({ message: "Erro ao criar saldo.", error });
  }
});


router.get("/busca", async (req, res) => {
  console.log("Entrou na rota GET /busca");
  try {
    const { estoqueId, local, grupo } = req.query;
    const result = await SaldoService.findSaldosByParams(
      estoqueId,
      local,
      grupo
    );

    res.json(result);
  } catch (error) {
    console.error("Erro ao buscar dados: ", error);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});


router.put("/:produtoId/:estoqueId/:subestoqueId", async (req, res) => {
  console.log("Entrou na rota PUT /:produtoId/:estoqueId/:subestoqueId");
  const { produtoId, estoqueId, subestoqueId } = req.params;
  console.log("produtoId:", produtoId),
    console.log("estoqueId:", estoqueId),
    console.log("subestoqueId:", subestoqueId);
  const saldo = req.body;
  try {
    const result = await SaldoService.updateSaldo(produtoId, estoqueId, subestoqueId, saldo);
    if (!result) {
      res.status(404).json({ message: `Saldo não encontrado para produtoId ${produtoId}, estoqueId ${estoqueId}, subestoqueId ${subestoqueId}.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error("Erro ao atualizar saldo:", error);
    res.status(500).json({ message: "Erro ao atualizar saldo.", error });
  }
});


module.exports = router;
