import express from "express";
import {
    createServiceController,
    updateServiceController,
    deleteServiceController,
    desactiverServiceController,
    getAllServiceController,
    getServiceByIdController
} from "../controller/ServiceController.js";

const router = express.Router();

router.post("/service", createServiceController);
router.put("/service/:id", updateServiceController);
router.delete("/service/:id", deleteServiceController);
router.patch("/service/:id/desactiver", desactiverServiceController);
router.get("/services", getAllServiceController);
router.get("/service/:id", getServiceByIdController);

export default router;
