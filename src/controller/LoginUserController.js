const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UsuarioService = require("../services/RegisterUserService");

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await UsuarioService.autenticarUsuario(email, senha);
    if (usuario) {
      // Generate token with the secret key
      const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET); // Use the same secret key as in backend/index.js

      // Return the user and the token
      res.json({ usuario, token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error authenticating user.", error });
  }
});

module.exports = router;
