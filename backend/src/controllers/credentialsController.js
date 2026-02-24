const db = require("../DB/db");
const { encrypt, decrypt } = require("../services/encryptionService");

// Crear una nueva credencial (POST /credentials)
const createCredential = async (req, res) => {
  try {
    const { service_name, account_username, password, url, notes } = req.body;
    const userId = req.user.userId;

    if (!service_name || !password) {
      return res.status(400).json({
        error: "El nombre del servicio y la contraseña son obligatorios",
      });
    }

    const encryptedPassword = encrypt(password);

    const query = `
            INSERT INTO CREDENTIALS (id_user, service_name, account_username, password_encrypted, url, notes)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id_credential, service_name, created_at_credential
        `;
    const values = [
      userId,
      service_name,
      account_username,
      encryptedPassword,
      url,
      notes,
    ];

    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la credencial" });
  }
};

// Listar todas las credenciales del usuario (GET /credentials)
const getCredentials = async (req, res) => {
  try {
    const userId = req.user.userId;

    const query = `
            SELECT id_credential, service_name, account_username, url, notes, created_at_credential, update_at_credential 
            FROM CREDENTIALS 
            WHERE id_user = $1
        `;
    const result = await db.query(query, [userId]);

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las credenciales" });
  }
};

// Obtener detalle de una credencial (GET /credentials/:id)
const getCredentialById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const query = `
            SELECT id_credential, service_name, account_username, url, notes, created_at_credential, update_at_credential 
            FROM CREDENTIALS 
            WHERE id_credential = $1 AND id_user = $2
        `;
    const result = await db.query(query, [id, userId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Credencial no encontrada o no tienes acceso" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la credencial" });
  }
};

// Eliminar una credencial (DELETE /credentials/:id)
const deleteCredential = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const query =
      "DELETE FROM CREDENTIALS WHERE id_credential = $1 AND id_user = $2 RETURNING id_credential";
    const result = await db.query(query, [id, userId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Credencial no encontrada o no tienes acceso" });
    }

    res.status(200).json({ message: "Credencial eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la credencial" });
  }
};

// Revelar Contraseña y Auditar
const revealPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const credQuery =
      "SELECT password_encrypted FROM CREDENTIALS WHERE id_credential = $1 AND id_user = $2";
    const credResult = await db.query(credQuery, [id, userId]);

    if (credResult.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "Acceso denegado a esta credencial" });
    }

    const decryptedPassword = decrypt(credResult.rows[0].password_encrypted);

    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const metadata = JSON.stringify({ ip, userAgent });

    const auditQuery = `
            INSERT INTO audit_logs (id_user, id_credential, action, metadata)
            VALUES ($1, $2, $3, $4)
        `;
    await db.query(auditQuery, [userId, id, "SHOW_PASSWORD", metadata]);

    res.status(200).json({ password: decryptedPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al revelar la contraseña" });
  }
};

// Actualizar una credencial (PUT /credentials/:id)
const updateCredential = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { service_name, account_username, password, url, notes } = req.body;

    const checkQuery =
      "SELECT id_credential FROM CREDENTIALS WHERE id_credential = $1 AND id_user = $2";
    const checkResult = await db.query(checkQuery, [id, userId]);

    if (checkResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Credencial no encontrada o no tienes acceso" });
    }

    let query;
    let values;

    if (password) {
      const encryptedPassword = encrypt(password);
      query = `
                UPDATE CREDENTIALS 
                SET service_name = $1, account_username = $2, password_encrypted = $3, url = $4, notes = $5, update_at_credential = CURRENT_TIMESTAMP
                WHERE id_credential = $6 AND id_user = $7
                RETURNING id_credential, service_name, update_at_credential
            `;
      values = [
        service_name,
        account_username,
        encryptedPassword,
        url,
        notes,
        id,
        userId,
      ];
    } else {
      query = `
                UPDATE CREDENTIALS 
                SET service_name = $1, account_username = $2, url = $3, notes = $4, update_at_credential = CURRENT_TIMESTAMP
                WHERE id_credential = $5 AND id_user = $6
                RETURNING id_credential, service_name, update_at_credential
            `;
      values = [service_name, account_username, url, notes, id, userId];
    }

    const result = await db.query(query, values);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la credencial" });
  }
};

module.exports = {
  createCredential,
  getCredentials,
  getCredentialById,
  deleteCredential,
  revealPassword,
  updateCredential,
};
