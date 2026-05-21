const express = require("express");

const router = express.Router();

const validarToken = require("../middleware/validarToken");

router.get("/", validarToken, (req, res) => {

  res.json({
    mensaje: "Ruta protegida 🚀",
    usuario: req.usuario,
  });

});

module.exports = router;