import express from "express";
import { checkToken } from "../middlewares/CheckToken.js";
import { checkRole } from "../middlewares/CheckRole.js";
import {
  createChambreController,
  updateChambreController,
  deleteChambreController,
  getAllChambreController,
  getAvailableChambresController,
  getChambreByIdController,
  getAllChambreStaffController,
  setChambreStatutController,
} from "../controller/ChambreController.js";

const router = express.Router();

/* ✅ PUBLIC */
router.get("/chambres", getAllChambreController);
router.get("/chambres/disponibles", getAvailableChambresController);
router.get("/chambre/:id", getChambreByIdController);

/* ✅ STAFF (admin + employe) */
router.get("/staff/chambres", checkToken, checkRole("admin", "employe"), getAllChambreStaffController);

router.post("/chambre", checkToken, checkRole("admin", "employe"), createChambreController);
router.put("/chambre/:id", checkToken, checkRole("admin", "employe"), updateChambreController);

// ✅ une seule route pour activer/désactiver
router.patch("/chambre/:id/statut", checkToken, checkRole("admin", "employe"), setChambreStatutController);

// option : delete admin only (si tu le gardes)
router.delete("/chambre/:id", checkToken, checkRole("admin"), deleteChambreController);

export default router;
