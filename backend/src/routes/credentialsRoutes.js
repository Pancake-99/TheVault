const express = require("express");
const router = express.Router();
const credentialsController = require("../controllers/credentialsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/", credentialsController.createCredential);
router.get("/", credentialsController.getCredentials);
router.get("/:id", credentialsController.getCredentialById);
router.delete("/:id", credentialsController.deleteCredential);
router.put("/:id", credentialsController.updateCredential);

router.post("/:id/reveal", credentialsController.revealPassword);

module.exports = router;
