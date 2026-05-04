import express from "express";
import {
    addServiceController,
    removeServiceController,
    getServicesByChambreController
} from "../controller/ChambreServiceController.js";

const router = express.Router();

// Créer un lien chambre-service
router.post("/chambre-service", addServiceController);

// Supprimer un lien chambre-service
router.delete("/chambre-service/:id_chambre/:id_service", removeServiceController);

// Lister tous les services d'une chambre
router.get("/chambre-services/:id_chambre", getServicesByChambreController);

export default router;
