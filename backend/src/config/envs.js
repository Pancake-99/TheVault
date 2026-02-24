require("dotenv").config();

const requiredEnvs = [
  "PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "JWT_SECRET",
  "ENCRYPTION_KEY",
];

requiredEnvs.forEach((envName) => {
  if (!process.env[envName]) {
    console.error(
      `ERROR FATAL: Falta la variable de entorno ${envName} en el archivo .env`,
    );
    process.exit(1);
  }
});

module.exports = {
  PORT: process.env.PORT,
  DB: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  },
  JWT_SECRET: process.env.JWT_SECRET,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
};
