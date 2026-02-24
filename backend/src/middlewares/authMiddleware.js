const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ error: "Acceso denegado: Se requiere un token" });
  }

  // Verificamos que el token sea válido y no haya expirado
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
