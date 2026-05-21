const express = require("express");

const router = express.Router();

const validarToken = require("../middleware/validarToken");

const {
  obtenerEntregas,
  crearEntrega,
  actualizarEstatus,
  reprogramarEntrega,
  aceptarReprogramacion,
  proponerNuevaFecha,
} = require("../controllers/entregasController");

// OBTENER ENTREGAS

router.get(
  "/",
  validarToken,
  obtenerEntregas
);

// CREAR ENTREGA

router.post(
  "/",
  validarToken,
  crearEntrega
);

// ACTUALIZAR ESTATUS

router.put(
  "/:id",
  validarToken,
  actualizarEstatus
);

// REPROGRAMAR ENTREGA

router.put(
  "/reprogramar/:id",
  validarToken,
  reprogramarEntrega
);

router.put(
  "/aceptar-reprogramacion/:id",
  validarToken,
  aceptarReprogramacion
);

router.put(
  "/proponer-fecha/:id",
  validarToken,
  proponerNuevaFecha
);
module.exports = router;