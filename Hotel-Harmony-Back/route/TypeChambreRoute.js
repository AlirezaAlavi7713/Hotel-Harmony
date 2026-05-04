import express from "express";
import {
    createTypeChambreController,
    updateTypeChambreController,
    deleteTypeChambreController,
    getAllTypeChambreController,
    getTypeChambreByIdController
} from "../controller/TypeChambreController.js";

const router = express.Router();

router.post("/type_chambre", createTypeChambreController);
router.put("/type_chambre/:id", updateTypeChambreController);
router.delete("/type_chambre/:id", deleteTypeChambreController);
router.get("/type_chambres", getAllTypeChambreController);
router.get("/type_chambre/:id", getTypeChambreByIdController);

export default router;
