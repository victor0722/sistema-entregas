const jwt = require("jsonwebtoken");

const validarToken = (req, res, next) => {

  try {

    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        mensaje: "Acceso denegado",
      });
    }

    const tokenLimpio = token.replace("Bearer ", "");

    const verificado = jwt.verify(
      tokenLimpio,
      process.env.JWT_SECRET
    );

    req.usuario = verificado;

    next();

  } catch (error) {

    res.status(401).json({
      mensaje: "Token inválido",
    });

  }

};

module.exports = validarToken;