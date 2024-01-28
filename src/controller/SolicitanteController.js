const express = require("express");
const router = express.Router();
const SolicitanteService = require("../services/SolicitanteService");

router.post("/criar-solicitante", async (req, res) => {
  const solicitante = req.body;
  try {
    const result = await SolicitanteService.createSolicitante(solicitante);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar solicitante.", error });
  }
});

router.get("/buscar-solicitantes", async (req, res) => {
  try {
    const result = await SolicitanteService.findSolicitantes();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar solicitantes.", error });
  }
});

router.get("/buscar-solicitante/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await SolicitanteService.findSolicitanteById(id);
    if (!result) {
      res.status(404).json({ message: `solicitante com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar solicitante.", error });
  }
});

router.put("/atualizar-solicitante/:id", async (req, res) => {
  const { id } = req.params;
  const solicitante = req.body;
  try {
    const result = await SolicitanteService.updateSolicitante(id, solicitante);
    if (!result) {
      res.status(404).json({ message: `solicitante com id ${id} não encontrado.` });
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar solicitante.", error });
  }
});

router.delete("/solicitante/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SolicitanteService.deleteSolicitante(id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: "solicitante não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir solicitante" });
  }
});

module.exports = router;