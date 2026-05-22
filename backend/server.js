require("dotenv").config();
require("./config/db");

const express = require("express");
const cors = require("cors");

const entregasRutas = require("./routes/entregasRutas");
const rutasPrueba = require("./routes/rutasPrueba");
const authRutas = require("./routes/authRutas");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/entregas", entregasRutas);
app.use("/api/prueba", rutasPrueba);
app.use("/api/autenticacion", authRutas);

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});