const express = require("express");
const router = express.Router();
const RegisterUserRoutes = require("./src/routes/RegisterUserRoutes");
const LoginUserRoutes = require("./src/routes/LoginUserRoutes");
const EstoqueRoutes = require("./src/routes/EstoqueRoutes");
const CategoriaRoutes = require("./src/routes/CategoriaRoutes");
const SolicitanteRoutes = require("./src/routes/SolicitanteRoutes");
const ProdutoRoutes = require("./src/routes/ProdutoRoutes");
const EntradaItemRoutes = require("./src/routes/EntradaItemRoutes");
const SaidaItemRoutes = require("./src/routes/SaidaItemRoutes");
const SubEstoqueRoutes = require("./src/routes/SubEstoqueRoutes");
const SaldoRoutes = require("./src/routes/SaldoRoutes");

router.use("/usuario", RegisterUserRoutes);
router.use("/login", LoginUserRoutes);
router.use("/estoque", EstoqueRoutes);
router.use("/categoria", CategoriaRoutes);
router.use("/solicitante", SolicitanteRoutes);
router.use("/produto", ProdutoRoutes);
router.use("/entrada-item", EntradaItemRoutes);
router.use("/saida-item", SaidaItemRoutes);
router.use("/sub-estoque", SubEstoqueRoutes);
router.use("/saldo", SaldoRoutes);

module.exports = router;
