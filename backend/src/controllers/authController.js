const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../DB/db");
const envs = require("../config/envs");

// Registro de usuario
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios" });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const query = `
            INSERT INTO USERS (email, password_hash) 
            VALUES ($1, $2) 
            RETURNING id_user, email, created_at
        `;
    const result = await db.query(query, [email, passwordHash]);

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor al registrar" });
  }
};

// Inicio de sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios" });
    }

    // Buscar el usuario en la base de datos
    const result = await db.query("SELECT * FROM USERS WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    // Validar si existe y si la contraseña coincide
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { userId: user.id_user, email: user.email }, // Payload (datos que viajan en el token)
      envs.JWT_SECRET, // Tu secreto del .env
      { expiresIn: "2h" }, // Tiempo de expiración
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al iniciar sesión" });
  }
};

module.exports = { register, login };
