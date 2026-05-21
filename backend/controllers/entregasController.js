const connection = require("../config/db");

//////////////////////////////////////////////////////
// OBTENER ENTREGAS
//////////////////////////////////////////////////////

const obtenerEntregas = (req, res) => {

  const sql = `
  SELECT
    entregas.*,
    usuarios.nombre AS vendedor_nombre
  FROM entregas
  LEFT JOIN usuarios
    ON usuarios.id = entregas.vendedor_id
  ORDER BY fecha ASC, hora ASC
`;

  connection.query(sql, (error, results) => {

    if (error) {

      console.log(error);

      return res.status(500).json({
        mensaje: "Error al obtener entregas",
      });

    }

    res.json(results);

  });

};

//////////////////////////////////////////////////////
// CREAR ENTREGA
//////////////////////////////////////////////////////

const crearEntrega = (req, res) => {

 const {
  titulo,
  cliente,
  unidad,
  fecha,
  hora,
  estado,
} = req.body;

const vendedor_id = req.usuario.id;
  // VALIDAR CAMPOS

  if (
    !titulo ||
    !cliente ||
    !unidad ||
    !fecha ||
    !hora
  ) {

    return res.status(400).json({
      mensaje:
        "Todos los campos son obligatorios 🚫",
    });

  }

  //////////////////////////////////////////////////////
  // VALIDAR MÁXIMO 2 ENTREGAS
  //////////////////////////////////////////////////////

 const validarSQL = `
  SELECT COUNT(*) AS total
  FROM entregas
  WHERE fecha = ?
  AND hora = ?
  AND estado != 'cancelada'
`;

  connection.query(
    validarSQL,
    [fecha, hora],
    (error, results) => {

      if (error) {

        console.log(error);

        return res.status(500).json({
          mensaje:
            "Error al validar horario",
        });

      }

      const total =
        results[0].total;

      if (total >= 2) {

        return res.status(400).json({
          mensaje:
            "Ya existen 2 entregas en ese horario 🚫",
        });

      }

      //////////////////////////////////////////////////////
      // INSERTAR ENTREGA
      //////////////////////////////////////////////////////

     const insertSQL = `
  INSERT INTO entregas
  (
    vendedor_id,
    titulo,
    cliente,
    unidad,
    fecha,
    hora,
    estado
  )
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

      connection.query(
        insertSQL,
        [
  vendedor_id,
  titulo,
  cliente,
  unidad,
  fecha,
  hora,
  estado || "pendiente",
],
        (error, result) => {

          if (error) {

            console.log(error);

            return res.status(500).json({
              mensaje:
                "Error al crear entrega 🚫",
            });

          }

          res.json({
            mensaje:
              "Entrega creada correctamente 🚀",
            id: result.insertId,
          });

        }
      );

    }
  );

};

//////////////////////////////////////////////////////
// ACTUALIZAR ESTATUS
//////////////////////////////////////////////////////

const actualizarEstatus = (req, res) => {

  const { id } = req.params;

  const { estado } = req.body;

  const sql = `
    UPDATE entregas
    SET estado = ?
    WHERE id = ?
  `;

  connection.query(
    sql,
    [estado, id],
    (error) => {

      if (error) {

        console.log(error);

        return res.status(500).json({
          mensaje:
            "Error al actualizar estado",
        });

      }

      res.json({
        mensaje:
          "Estado actualizado ✅",
      });

    }
  );

};

//////////////////////////////////////////////////////
// REPROGRAMAR
//////////////////////////////////////////////////////

const reprogramarEntrega = (req, res) => {

  const { id } = req.params;

  const {
    nueva_fecha,
    nueva_hora,
  } = req.body;

  const sql = `
    UPDATE entregas
    SET
      nueva_fecha = ?,
      nueva_hora = ?,
      estado = 'reprogramada'
    WHERE id = ?
  `;

  connection.query(
    sql,
    [
      nueva_fecha,
      nueva_hora,
      id,
    ],
    (error) => {

      if (error) {

        console.log(error);

        return res.status(500).json({
          mensaje:
            "Error al reprogramar",
        });

      }

      res.json({
        mensaje:
          "Entrega reprogramada ⚠️",
      });

    }
  );

};

//////////////////////////////////////////////////////
// ACEPTAR REPROGRAMACIÓN
//////////////////////////////////////////////////////

const aceptarReprogramacion = (
  req,
  res
) => {

  const { id } = req.params;

  const sql = `
    UPDATE entregas
    SET
      fecha = nueva_fecha,
      hora = nueva_hora,
      nueva_fecha = NULL,
      nueva_hora = NULL,
      estado = 'aprobada'
    WHERE id = ?
  `;

  connection.query(
    sql,
    [id],
    (error) => {

      if (error) {

        console.log(error);

        return res.status(500).json({
          mensaje:
            "Error al aceptar reprogramación",
        });

      }

      res.json({
        mensaje:
          "Reprogramación aceptada ✅",
      });

    }
  );

};

//////////////////////////////////////////////////////
// PROPONER NUEVA FECHA
//////////////////////////////////////////////////////

const proponerNuevaFecha = (
  req,
  res
) => {

  const { id } = req.params;

  const {
    propuesta_fecha,
    propuesta_hora,
  } = req.body;

  const sql = `
    UPDATE entregas
    SET
      nueva_fecha = ?,
      nueva_hora = ?,
      estado = 'reprogramada'
    WHERE id = ?
  `;

  connection.query(
    sql,
    [
      propuesta_fecha,
      propuesta_hora,
      id,
    ],
    (error) => {

      if (error) {

        console.log(error);

        return res.status(500).json({
          mensaje:
            "Error al enviar propuesta",
        });

      }

      res.json({
        mensaje:
          "Nueva propuesta enviada 🚀",
      });

    }
  );

};

module.exports = {
  obtenerEntregas,
  crearEntrega,
  actualizarEstatus,
  reprogramarEntrega,
  aceptarReprogramacion,
  proponerNuevaFecha,
};