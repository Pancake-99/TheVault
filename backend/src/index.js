const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("ola");
});
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
