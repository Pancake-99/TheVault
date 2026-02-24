const crypto = require("crypto");
const envs = require("../config/envs");

const ALGORITHM = "aes-256-cbc";
const ENCRYPTION_KEY = Buffer.from(envs.ENCRYPTION_KEY, "hex");

const encrypt = (text) => {
  // Generamos un Vector de Inicialización (IV) de 16 bytes aleatorios
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Guardamos el IV junto con el texto cifrado
  return `${iv.toString("hex")}:${encrypted}`;
};

// Función para descifrar la contraseña cuando el usuario presiona "Mostrar"
const decrypt = (encryptedText) => {
  // Separamos el IV del texto cifrado
  const textParts = encryptedText.split(":");
  const iv = Buffer.from(textParts[0], "hex");
  const encryptedTextBuffer = Buffer.from(textParts[1], "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let decrypted = decipher.update(encryptedTextBuffer, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

module.exports = { encrypt, decrypt };
