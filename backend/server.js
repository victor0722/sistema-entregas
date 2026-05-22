require("dotenv").config();
require("./config/db");

const express = require("express");
const cors = require("cors");

const entregasRutas = require("./routes/entregasRutas");
const rutasPrueba = require("./routes/rutasPrueba");
const authRutas = require("./routes/authRutas");

const app = express();

app.use(cors({
  origin: [
    "https://sistema-entregas-three.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api/entregas", entregasRutas);
app.use("/api/prueba", rutasPrueba);
app.use("/api/autenticacion", authRutas);

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});