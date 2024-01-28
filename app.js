require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");

const cors = require("cors");

const app = express();
const PORT = process.env.API_PORT || 3002;

app.use(
  cors({
    origin: "*",
  })
);
require("./src/config/db");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Rota base da API
app.use("/api", routes);

// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
