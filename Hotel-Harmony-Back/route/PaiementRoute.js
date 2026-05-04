import express from "express";
import { checkToken } from "../middlewares/CheckToken.js";
import { checkRole } from "../middlewares/CheckRole.js";
import {
  initierPaiementController,
  stripeWebhookController,
} from "../controller/PaiementController.js";

const router = express.Router();

router.post("/paiements/webhook", express.raw({ type: "application/json" }), stripeWebhookController);
router.post("/paiements/initier", checkToken, checkRole("client"), initierPaiementController);

export default router;
