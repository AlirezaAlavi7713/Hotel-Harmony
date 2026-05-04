import express from "express";
import { checkToken } from "../middlewares/CheckToken.js";
import { checkRole } from "../middlewares/CheckRole.js";
import {
    createClientController,
    updateClientController,
    deleteClientController,
    desactiverClientController,
    getAllClientController,
    getClientByIdController,
    loginClientController,
    getMeClientController,
    updateMeClientController
} from "../controller/ClientController.js";

const router = express.Router();

/* ✅ PUBLIC */
router.post("/client", createClientController);
router.post("/client/login", loginClientController);

/* ✅ CLIENT (profil connecté) — IMPORTANT: avant /client/:id */
router.get("/client/me", checkToken, checkRole("client"), getMeClientController);
router.put("/client/me", checkToken, checkRole("client"), updateMeClientController);

/* ✅ (gestion clients) */
router.get("/clients", checkToken, checkRole("admin", "employe"), getAllClientController);
router.get("/client/:id", checkToken, checkRole("admin", "employe"), getClientByIdController);
router.put("/client/:id", checkToken, checkRole("admin", "employe"), updateClientController);
router.patch("/client/:id/desactiver", checkToken, checkRole("admin", "employe"), desactiverClientController);
router.delete("/client/:id", checkToken, checkRole("admin", "employe"), deleteClientController);

export default router;