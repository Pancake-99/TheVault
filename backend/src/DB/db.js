const { Pool } = require("pg");
const envs = require("../config/envs"); // Importamos la configuración

const pool = new Pool({
  user: envs.DB.user,
  host: envs.DB.host,
  database: envs.DB.database,
  password: envs.DB.password,
  port: envs.DB.port,
});

pool.on("connect", () => {
  console.log("Conexión a la base de datos PostgreSQL establecida.");
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
