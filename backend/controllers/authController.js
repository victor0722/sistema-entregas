const iniciarSesion = (req, res) => {

  try {

    const { correo, password } = req.body;

    const sql = `
      SELECT * FROM usuarios
      WHERE correo = ?
    `;

    db.query(sql, [correo], async (err, result) => {

      try {

        if (err) {
          console.log(err);
          return res.status(500).json({
            mensaje: "Error en servidor",
            error: err,
          });
        }

        if (!result || result.length === 0) {
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

      } catch (errorInterno) {

        console.log(errorInterno);

        res.status(500).json({
          mensaje: "Error interno login",
          error: errorInterno.message,
        });

      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      mensaje: "Error general",
      error: error.message,
    });

  }

};