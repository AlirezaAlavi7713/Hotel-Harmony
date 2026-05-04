import express from "express";
import {
    createReservationController,
    updateReservationController,
    deleteReservationController,
    getAllReservationsController,
    getReservationByIdController,
    getMyReservationsController,
    cancelReservationController,
    confirmReservationByStaffController
} from "../controller/ResaController.js";
import { checkToken } from "../middlewares/CheckToken.js";
import { checkRole } from "../middlewares/CheckRole.js";

const router = express.Router();

router.post("/reservation", checkToken, checkRole("client", "employe", "admin"), createReservationController);
router.put("/reservation/:id", updateReservationController);
router.delete("/reservation/:id", deleteReservationController);
router.get("/reservations", checkToken, checkRole("employe", "admin"), getAllReservationsController);
router.get("/reservation/:id", checkToken, checkRole("client", "employe", "admin"), getReservationByIdController);
router.get("/reservations/me", checkToken, checkRole("client"), getMyReservationsController);
router.patch("/reservation/:id/annuler", checkToken, checkRole("client", "employe", "admin"), cancelReservationController);
router.patch("/reservation/:id/confirmer", checkToken, checkRole("employe", "admin"), confirmReservationByStaffController);


export default router;
