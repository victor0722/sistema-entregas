const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registrarUsuario = async (req, res) => {

  try {

    const { nombre, correo, password, rol } = req.body;

    const salt = await bcrypt.genSalt(10);

    const passwordEncriptado = await bcrypt.hash(password, salt);

    const sql = `
      INSERT INTO usuarios
      (nombre, correo, password, rol)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [nombre, correo, passwordEncriptado, rol],
      (err, result) => {

        if (err) {
          return res.status(500).json(err);
        }

        res.json({
          mensaje: "Usuario registrado correctamente 🚀",
        });

      }
    );

  } catch (error) {

    res.status(500).json(error);

  }

};

const iniciarSesion = (req, res) => {

  const { correo, password } = req.body;

  const sql = `
    SELECT * FROM usuarios
    WHERE correo = ?
  `;

  db.query(sql, [correo], async (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(401).json({
        mensaje: "Usuario no encontrado",
      });
    }

    const usuario = result[0];

    const passwordCorrecto = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordCorrecto) {
      return res.status(401).json({
        mensaje: "Contraseña incorrecta",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    res.json({
      mensaje: "Login correcto 🚀",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });

  });

};

module.exports = {
  registrarUsuario,
  iniciarSesion,
};