const envs = require("./config/envs");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = envs.PORT;

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const credentialsRoutes = require("./routes/credentialsRoutes");

app.use("/auth", authRoutes);
app.use("/credentials", credentialsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de Mini Vault" });
});

app.listen(PORT, () => {
  console.log(`Servidor de Mini Vault corriendo en http://localhost:${PORT}`);
});
