import express from "express";
import {
    createContactMessageController,
    getAllContactMessagesController,
    markContactMessageAsReadController,
    replyToContactMessageController
} from "../controller/ContactController.js";

import { checkToken } from "../middlewares/CheckToken.js";
import { checkRole } from "../middlewares/CheckRole.js";

const router = express.Router();

// Public
router.post("/contact", createContactMessageController);

// Staff (admin + employe)
router.get("/contact/messages", checkToken, checkRole("admin", "employe"), getAllContactMessagesController);
router.patch("/contact/messages/:id/lu", checkToken, checkRole("admin", "employe"), markContactMessageAsReadController);
router.patch("/contact/messages/:id/repondre", checkToken, checkRole("admin", "employe"), replyToContactMessageController);

export default router;